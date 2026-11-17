package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.Models
import ar.vale.projectorlauncher.claude.Transport
import ar.vale.projectorlauncher.juntada.Accounts
import ar.vale.projectorlauncher.juntada.Juntada
import ar.vale.projectorlauncher.juntada.JuntadaError
import ar.vale.projectorlauncher.juntada.TriviaBank
import ar.vale.projectorlauncher.juntada.TriviaMaker
import ar.vale.projectorlauncher.juntada.TriviaSource
import ar.vale.projectorlauncher.remote.Access
import ar.vale.projectorlauncher.remote.HttpParser
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.JuntadaRoutes
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.RemoteDevice
import ar.vale.projectorlauncher.remote.Router
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.util.Random

class JuntadaTest {

    private var clock = 1_000_000L
    private val pending = ArrayList<() -> Unit>()
    private fun juntada(stored: JSONObject? = null) = Juntada(stored, { clock }, Random(7)) { pending.add(it) }

    private val four = listOf("a", "b", "c", "d")
    private fun quiz(n: Int) = Juntada.Quiz((1..n).map { Juntada.Question("Pregunta $it", four, 2, "dato $it") }, own = false)
    private val source = TriviaSource { _, count -> quiz(count) }

    private fun code(block: () -> Unit): String? = try {
        block()
        null
    } catch (e: JuntadaError) {
        e.code
    }

    private fun Juntada.play(count: Int = 3) {
        startTrivia("tema", count, source)
        pending.removeAt(0)()
        clock += Juntada.READY_MS
    }

    private fun Juntada.trivia(key: String? = null) = state(key, owner = true).getJSONObject("trivia")

    // --- Quién entra ---

    @Test
    fun `contrato - el nombre se limpia y no se repite`() {
        val j = juntada()
        assertEquals("Vale", j.join("  Vale\n ").name)
        assertEquals("name_taken", code { j.join("vale") })
        assertEquals("name", code { j.join("   ") })
        assertEquals(18, j.join("x".repeat(60)).name.length)
    }

    @Test
    fun `contrato - la juntada tiene tope de gente`() {
        val j = juntada()
        repeat(Juntada.MAX_PEOPLE) { j.join("p$it") }
        assertEquals("full", code { j.join("uno más") })
    }

    @Test
    fun `contrato - sin haber entrado no se juega`() {
        val j = juntada()
        j.play()
        assertEquals("join", code { j.answer(null, 0, 1) })
        assertEquals("join", code { j.answer("clave inventada", 0, 1) })
        assertEquals("join", code { j.vote("x", 0) })
        assertEquals("join", code { j.createPoll(null, true, "¿?", listOf("a", "b")) })
    }

    @Test
    fun `contrato - la clave de una persona no aparece en lo que ven los demas`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val seen = j.state(beto.key, owner = false).toString()
        assertFalse(seen.contains(ana.key))
    }

    @Test
    fun `contrato - empezar de cero saca a todos y avisa para que tambien se vayan los invitados`() {
        val j = juntada()
        var told = 0
        j.onReset = { told++ }
        val ana = j.join("Ana")
        j.addExpense(ana.key, ana.id, 100, "pan", listOf(ana.id))
        j.reset()
        assertEquals(1, told)
        val state = j.state(ana.key, owner = true)
        assertEquals(0, state.getJSONArray("people").length())
        assertEquals(0, state.getJSONArray("expenses").length())
        assertFalse(state.has("me"))
    }

    // --- Trivia ---

    @Test
    fun `contrato - la respuesta correcta no viaja mientras la pregunta esta abierta`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.play()
        val open = j.trivia(ana.key)
        assertEquals("question", open.getString("phase"))
        assertFalse(open.has("correct"))
        assertFalse(open.has("fact"))
        assertFalse(open.toString().contains("dato"))
        clock += Juntada.QUESTION_MS
        val closed = j.trivia(ana.key)
        assertEquals("reveal", closed.getString("phase"))
        assertEquals(2, closed.getInt("correct"))
    }

    @Test
    fun `contrato - acertar rapido vale mas que acertar tarde y errar no suma`() {
        val j = juntada()
        val fast = j.join("Rápida")
        val slow = j.join("Lento")
        val wrong = j.join("Erra")
        j.play()
        j.answer(fast.key, 0, 2)
        clock += Juntada.QUESTION_MS - 1000
        j.answer(slow.key, 0, 2)
        j.answer(wrong.key, 0, 1)
        fun score(key: String) = j.state(key, false).getJSONObject("me").getInt("score")
        assertEquals(Juntada.BASE_POINTS + Juntada.SPEED_POINTS.toInt(), score(fast.key))
        assertTrue(score(slow.key) in Juntada.BASE_POINTS until score(fast.key))
        assertEquals(0, score(wrong.key))
    }

    @Test
    fun `contrato - cuenta la primera respuesta, no se puede corregir`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.join("Beto")
        j.play()
        j.answer(ana.key, 0, 1)
        assertEquals("closed", code { j.answer(ana.key, 0, 2) })
        assertEquals(0, j.state(ana.key, false).getJSONObject("me").getInt("score"))
    }

    @Test
    fun `contrato - no se responde fuera de tiempo ni una pregunta que ya paso`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.join("Beto")
        j.play()
        assertEquals("closed", code { j.answer(ana.key, 1, 2) })
        assertEquals("invalid", code { j.answer(ana.key, 0, 4) })
        clock += Juntada.QUESTION_MS + 1
        assertEquals("closed", code { j.answer(ana.key, 0, 2) })
    }

    @Test
    fun `contrato - cuando respondieron todos no se espera al reloj`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.play()
        j.answer(ana.key, 0, 2)
        assertEquals("question", j.trivia().getString("phase"))
        j.answer(beto.key, 0, 0)
        assertEquals("reveal", j.trivia().getString("phase"))
    }

    @Test
    fun `contrato - quien no esta jugando no le frena la trivia al resto, y quien erro todo igual figura`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.join("Solo anota gastos")
        j.play(3)
        j.answer(ana.key, 0, 2)
        j.answer(beto.key, 0, 1)
        assertEquals("en la primera se espera a toda la sala", "question", j.trivia().getString("phase"))
        clock += Juntada.QUESTION_MS
        assertEquals("reveal", j.trivia().getString("phase"))
        clock += Juntada.REVEAL_MS
        assertEquals(1, j.trivia().getInt("index"))
        j.answer(ana.key, 1, 2)
        j.answer(beto.key, 1, 1)
        val reveal = j.trivia()
        assertEquals("desde la segunda, alcanza con los que juegan", "reveal", reveal.getString("phase"))
        val names = reveal.getJSONArray("ranking").let { r -> (0 until r.length()).map { r.getJSONObject(it).getString("name") } }
        assertEquals(listOf("Ana", "Beto"), names)
    }

    @Test
    fun `contrato - la trivia recorre todas las preguntas y termina con el ranking`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.play(3)
        repeat(3) { i ->
            assertEquals(i, j.trivia().getInt("index"))
            j.answer(ana.key, i, 2)
            j.answer(beto.key, i, if (i == 0) 2 else 0)
            clock += Juntada.REVEAL_MS
        }
        val end = j.trivia()
        assertEquals("final", end.getString("phase"))
        val ranking = end.getJSONArray("ranking")
        assertEquals("Ana", ranking.getJSONObject(0).getString("name"))
        assertEquals("Beto", ranking.getJSONObject(1).getString("name"))
        assertTrue(ranking.getJSONObject(0).getInt("score") > ranking.getJSONObject(1).getInt("score"))
    }

    @Test
    fun `contrato - si la sala se queda sola la trivia avanza igual con el reloj`() {
        val j = juntada()
        j.join("Ana")
        j.play(3)
        // Nadie responde: la pared sigue consultando, y con eso alcanza para que el reloj la mueva.
        repeat((3 * (Juntada.QUESTION_MS + Juntada.REVEAL_MS) / 250).toInt() + 2) {
            clock += 250
            j.trivia()
        }
        assertEquals("final", j.trivia().getString("phase"))
    }

    @Test
    fun `contrato - si no se pudieron armar las preguntas vuelve al inicio y lo avisa`() {
        val j = juntada()
        j.startTrivia("tema", 5) { _, _ -> error("sin red") }
        assertEquals("loading", j.trivia().getString("phase"))
        pending.removeAt(0)()
        assertEquals("idle", j.trivia().getString("phase"))
        assertTrue(j.trivia().getBoolean("failed"))
    }

    @Test
    fun `contrato - preguntas mal formadas no se juegan`() {
        val bad = listOf(
            Juntada.Question("¿?", listOf("a", "b", "c"), 0, ""),
            Juntada.Question("¿?", four, 4, ""),
            Juntada.Question(" ", four, 0, "")
        )
        for (q in bad) {
            val j = juntada()
            j.startTrivia("tema", 5) { _, _ -> Juntada.Quiz(listOf(q), false) }
            pending.removeAt(0)()
            assertEquals("idle", j.trivia().getString("phase"))
        }
    }

    @Test
    fun `contrato - una trivia frenada no revive cuando llegan las preguntas tarde`() {
        val j = juntada()
        j.startTrivia("tema", 5, source)
        j.stopTrivia()
        pending.removeAt(0)()
        assertEquals("idle", j.trivia().getString("phase"))
        assertEquals("busy", code {
            j.startTrivia("a", 5, source)
            j.startTrivia("b", 5, source)
        })
    }

    @Test
    fun `contrato - la cantidad de preguntas tiene limites`() {
        val j = juntada()
        assertEquals("invalid", code { j.startTrivia("tema", 2, source) })
        assertEquals("invalid", code { j.startTrivia("tema", 16, source) })
        assertEquals("invalid", code { j.startTrivia("  ", 5, source) })
    }

    @Test
    fun `contrato - el banco propio alcanza para una partida y mezcla la correcta`() {
        val quiz = TriviaBank.pick(15, Random(1))
        assertTrue(quiz.own)
        assertEquals(15, quiz.questions.size)
        assertEquals(15, quiz.questions.map { it.text }.distinct().size)
        for (q in quiz.questions) {
            assertEquals(4, q.options.distinct().size)
            assertTrue(q.correct in 0..3)
        }
        assertTrue("no siempre en el mismo lugar", quiz.questions.map { it.correct }.distinct().size > 1)
    }

    @Test
    fun `contrato - mezclar conserva cual es la correcta`() {
        repeat(20) { seed ->
            val q = TriviaBank.mix("¿?", listOf("bien", "mal1", "mal2", "mal3"), 0, "", Random(seed.toLong()))
            assertEquals("bien", q.options[q.correct])
        }
    }

    // --- Lo que escribe Claude ---

    private val made = """{"preguntas":[
        {"pregunta":"¿Capital de Francia?","opciones":["París","Lyon","Niza","Lille"],"correcta":0,"dato":"Desde el siglo X."},
        {"pregunta":"Tres opciones","opciones":["a","b","c"],"correcta":0,"dato":""},
        {"pregunta":"Fuera de rango","opciones":["a","b","c","d"],"correcta":7,"dato":""},
        {"pregunta":"Repetidas","opciones":["a","a","c","d"],"correcta":0,"dato":""},
        {"pregunta":"","opciones":["a","b","c","d"],"correcta":0,"dato":""}
    ]}"""

    @Test
    fun `contrato - de lo que manda Claude solo se juega lo que cumple`() {
        val questions = TriviaMaker.parse(JSONObject(made), Random(3))
        assertEquals(1, questions.size)
        assertEquals("París", questions[0].options[questions[0].correct])
    }

    private class OneReply(private val text: String, private val stop: String = "end_turn") : Transport {
        var body: JSONObject? = null
        override fun stream(body: JSONObject, onEvent: (String, JSONObject) -> Unit) {
            this.body = JSONObject(body.toString())
            onEvent("content_block_start", JSONObject("""{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}"""))
            onEvent("content_block_delta", JSONObject().put("type", "content_block_delta").put("index", 0)
                .put("delta", JSONObject().put("type", "text_delta").put("text", text)))
            onEvent("message_delta", JSONObject("""{"type":"message_delta","delta":{"stop_reason":"$stop"}}"""))
        }
        override fun cancel() = Unit
    }

    @Test
    fun `contrato - el pedido de la trivia exige el formato y no lleva herramientas`() {
        val transport = OneReply(made)
        val quiz = TriviaMaker.make(transport, Models.of("claude-opus-5-5"), "Francia", 5, Random(3))
        assertFalse(quiz.own)
        val body = transport.body!!
        assertEquals("claude-opus-5-5", body.getString("model"))
        assertFalse(body.has("tools"))
        assertFalse("el formato y el relleno previo no van juntos", body.has("tool_choice"))
        val format = body.getJSONObject("output_config").getJSONObject("format")
        assertEquals("json_schema", format.getString("type"))
        assertFalse(format.getJSONObject("schema").getBoolean("additionalProperties"))
        assertTrue(body.getJSONArray("messages").getJSONObject(0).toString().contains("Francia"))
    }

    @Test
    fun `contrato - una respuesta cortada o sin preguntas jugables es una falla`() {
        for (transport in listOf(OneReply(made, "max_tokens"), OneReply("""{"preguntas":[]}"""), OneReply(made, "refusal"))) {
            try {
                TriviaMaker.make(transport, Models.of("claude-opus-5-5"), "x", 5, Random(1))
                fail("tenía que fallar")
            } catch (e: IllegalStateException) {
                // Con esto la juntada cae al banco propio.
            }
        }
    }

    // --- Votación ---

    @Test
    fun `contrato - se vota una opcion por persona y se puede cambiar mientras este abierta`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.createPoll(ana.key, false, "¿Qué comemos?", listOf("Asado", "Pizza", " ", "Pizza"))
        j.vote(ana.key, 0)
        j.vote(beto.key, 0)
        j.vote(beto.key, 1)
        val poll = j.state(beto.key, false).getJSONObject("poll")
        assertEquals(2, poll.getJSONArray("options").length())
        assertEquals(1, poll.getJSONArray("options").getJSONObject(0).getInt("votes"))
        assertEquals(1, poll.getJSONArray("options").getJSONObject(1).getInt("votes"))
        assertEquals(2, poll.getInt("total"))
        assertEquals(1, poll.getInt("mine"))
        assertEquals("invalid", code { j.vote(ana.key, 5) })
    }

    @Test
    fun `contrato - una votacion abierta la cierra o la reemplaza quien la armo, o el dueno`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.createPoll(ana.key, false, "¿?", listOf("a", "b"))
        assertEquals("poll_open", code { j.createPoll(beto.key, false, "otra", listOf("a", "b")) })
        assertEquals("not_allowed", code { j.closePoll(beto.key, false) })
        j.closePoll(ana.key, false)
        assertEquals("closed", code { j.vote(beto.key, 0) })
        j.createPoll(beto.key, false, "otra", listOf("a", "b"))
        j.closePoll(null, owner = true)
        assertFalse(j.state(null, true).getJSONObject("poll").getBoolean("open"))
    }

    @Test
    fun `contrato - una votacion necesita entre dos y seis opciones`() {
        val j = juntada()
        val ana = j.join("Ana")
        assertEquals("options", code { j.createPoll(ana.key, false, "¿?", listOf("una")) })
        assertEquals("options", code { j.createPoll(ana.key, false, "¿?", (1..7).map { "o$it" }) })
        assertEquals("invalid", code { j.createPoll(ana.key, false, " ", listOf("a", "b")) })
    }

    // --- Cuentas ---

    private fun expense(payer: String, amount: Long, among: List<String>) = Juntada.Expense(0, payer, amount, "x", among, payer)

    @Test
    fun `contrato - los saldos siempre suman cero, aunque no se pueda dividir justo`() {
        val people = listOf("a", "b", "c")
        val balance = Accounts.balance(people, listOf(expense("a", 100, people), expense("b", 1, people), expense("c", 50, listOf("a", "b"))))
        assertEquals(0L, balance.values.sum())
        assertEquals(100L - 34 - 1 - 25, balance["a"])
    }

    @Test
    fun `contrato - con los pagos propuestos todos quedan en cero`() {
        val people = listOf("a", "b", "c", "d")
        val expenses = listOf(expense("a", 9000, people), expense("b", 2500, listOf("b", "c")), expense("d", 333, people))
        val balance = Accounts.balance(people, expenses).toMutableMap()
        val transfers = Accounts.settle(balance)
        assertTrue("como mucho uno menos que la gente", transfers.size <= people.size - 1)
        for (t in transfers) {
            assertTrue(t.amount > 0)
            balance[t.from] = balance[t.from]!! + t.amount
            balance[t.to] = balance[t.to]!! - t.amount
        }
        assertTrue(balance.values.all { it == 0L })
    }

    @Test
    fun `contrato - si nadie debe nada no hay pagos`() {
        assertTrue(Accounts.settle(Accounts.balance(listOf("a", "b"), emptyList())).isEmpty())
        assertTrue(Accounts.settle(Accounts.balance(listOf("a"), listOf(expense("a", 500, listOf("a"))))).isEmpty())
    }

    @Test
    fun `contrato - un gasto pide gente que este, un monto real y entre quienes se reparte`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        assertEquals("amount", code { j.addExpense(ana.key, ana.id, 0, "pan", listOf(ana.id)) })
        assertEquals("amount", code { j.addExpense(ana.key, ana.id, -5, "pan", listOf(ana.id)) })
        assertEquals("amount", code { j.addExpense(ana.key, ana.id, Juntada.MAX_AMOUNT + 1, "pan", listOf(ana.id)) })
        assertEquals("invalid", code { j.addExpense(ana.key, "nadie", 10, "pan", listOf(ana.id)) })
        assertEquals("invalid", code { j.addExpense(ana.key, ana.id, 10, "pan", emptyList()) })
        assertEquals("invalid", code { j.addExpense(ana.key, ana.id, 10, "pan", listOf("nadie")) })
        assertEquals("invalid", code { j.addExpense(ana.key, ana.id, 10, "  ", listOf(ana.id)) })
        j.addExpense(ana.key, beto.id, 1000, "asado", listOf(ana.id, beto.id, ana.id))
        val state = j.state(ana.key, false)
        assertEquals(1000L, state.getLong("total"))
        val transfer = state.getJSONArray("transfers").getJSONObject(0)
        assertEquals(ana.id, transfer.getString("from"))
        assertEquals(beto.id, transfer.getString("to"))
        assertEquals(500L, transfer.getLong("amount"))
    }

    @Test
    fun `contrato - un gasto lo borra quien lo anoto, quien pago o el dueno, y nadie mas`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val caro = j.join("Caro")
        j.addExpense(ana.key, beto.id, 100, "pan", listOf(ana.id, beto.id))
        assertEquals("not_allowed", code { j.deleteExpense(caro.key, false, 1) })
        assertEquals("not_allowed", code { j.deleteExpense(null, false, 1) })
        j.deleteExpense(beto.key, false, 1)
        j.addExpense(ana.key, beto.id, 100, "pan", listOf(ana.id))
        j.deleteExpense(null, owner = true, id = 2)
        assertEquals(0, j.state(null, true).getJSONArray("expenses").length())
    }

    @Test
    fun `contrato - la gente y las cuentas sobreviven a un reinicio, la trivia no`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.addExpense(ana.key, ana.id, 700, "hielo", listOf(ana.id, beto.id))
        j.play()
        val again = juntada(JSONObject(j.export().toString()))
        val state = again.state(ana.key, false)
        assertEquals("Ana", state.getJSONObject("me").getString("name"))
        assertEquals(700L, state.getLong("total"))
        assertEquals("idle", state.getJSONObject("trivia").getString("phase"))
        again.addExpense(beto.key, beto.id, 1, "otro", listOf(beto.id))
        val ids = again.state(null, true).getJSONArray("expenses")
        assertNotEquals(ids.getJSONObject(0).getInt("id"), ids.getJSONObject(1).getInt("id"))
    }

    @Test
    fun `contrato - un archivo guardado roto no rompe el arranque`() {
        val broken = JSONObject("""{"guest":"corto","people":[{"id":"","key":"k","name":"x"},"basura"],"expenses":[{"payer":"nadie","amount":5,"among":["nadie"]}]}""")
        val j = juntada(broken)
        val state = j.state(null, true)
        assertEquals(0, state.getJSONArray("people").length())
        assertEquals(0, state.getJSONArray("expenses").length())
    }

    // --- Lo que alcanza un invitado ---

    private class Device : RemoteDevice {
        val calls = ArrayList<String>()
        override fun state() = JSONObject().also { calls.add("state") }
        override fun key(name: String) = RemoteDevice.Result.OK.also { calls.add("key") }
        override fun text(value: String, submit: Boolean) = RemoteDevice.Result.OK.also { calls.add("text") }
        override fun link(url: String) = RemoteDevice.Result.OK.also { calls.add("link") }
        override fun upload(name: String, length: Long, body: InputStream) = name.also { calls.add("upload") }
        override fun saveClaudeKey(key: String) = true.also { calls.add("claude_key") }
        override fun askClaude(text: String) = RemoteDevice.Result.OK.also { calls.add("ask") }
        override fun claudeState() = JSONObject().also { calls.add("claude_state") }
        override fun stopClaude() { calls.add("claude_stop") }
        override fun pointer(x: Float, y: Float, visible: Boolean) { calls.add("pointer") }
        override fun tap(x: Float, y: Float) = RemoteDevice.Result.OK.also { calls.add("tap") }
        override fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float) = RemoteDevice.Result.OK.also { calls.add("swipe") }
        override fun apps() = JSONObject().also { calls.add("apps") }
        override fun open(pkg: String) = RemoteDevice.Result.OK.also { calls.add("open") }
        override fun fits(length: Long) = true
        override fun privateScreen() = false
    }

    private val pairing = Pairing("t".repeat(48), {}, { clock })
    private val device = Device()
    private val access = Access(now = { clock })
    private val house = juntada().also { it.onReset = { access.clearGuests() } }
    private val router = Router(pairing, device, JuntadaRoutes(house, source), access) { null }

    /** Un celular que pidió entrar y al que el dueño dejó pasar a la juntada. */
    private fun guest(name: String = "Invitado"): String {
        val pass = (access.ask(name, "10.0.0.$name") as Access.Asked.Pass).value
        access.decide(access.pending().last().id, Access.Level.PARTY)
        return pass
    }

    private fun call(path: String, body: String, token: String?, method: String = "POST", extra: String = ""): HttpResponse {
        val head = StringBuilder("$method $path HTTP/1.1\r\nHost: 10.0.0.2:8686\r\nContent-Type: application/json\r\n")
        token?.let { head.append("Authorization: Bearer $it\r\n") }
        head.append(extra).append("Content-Length: ${body.toByteArray().size}\r\n\r\n").append(body)
        return router.handle(HttpParser.parse(ByteArrayInputStream(head.toString().toByteArray()))!!)
    }

    private fun HttpResponse.json(): JSONObject =
        JSONObject(ByteArrayOutputStream().also(::write).toString("UTF-8").substringAfter("\r\n\r\n"))

    @Test
    fun `contrato - un invitado de la juntada no maneja el proyector`() {
        val guest = guest()
        val owned = listOf(
            "POST" to "/api/key", "POST" to "/api/text", "POST" to "/api/link", "POST" to "/api/upload?name=a.apk",
            "POST" to "/api/claude/key", "POST" to "/api/claude/ask", "POST" to "/api/claude/stop", "GET" to "/api/claude/state",
            "POST" to "/api/pointer", "POST" to "/api/tap", "POST" to "/api/swipe", "POST" to "/api/open",
            "GET" to "/api/state", "GET" to "/api/apps"
        )
        for ((method, path) in owned) assertEquals(path, 403, call(path, "{}", guest, method).status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - la juntada no se usa sin permiso ni con uno viejo`() {
        assertEquals(401, call("/api/juntada/state", "{}", null).status)
        assertEquals(401, call("/api/juntada/join", """{"name":"x"}""", "g".repeat(48)).status)
        assertEquals("el código de la pared no entra solo", 401, call("/api/juntada/state", "{}", access.code).status)
        val guest = guest()
        assertEquals(200, call("/api/juntada/state", "{}", guest).status)
        house.reset()
        assertEquals(401, call("/api/juntada/state", "{}", guest).status)
    }

    @Test
    fun `contrato - un invitado entra, juega y anota, pero no arma ni frena ni borra todo`() {
        val guest = guest()
        val joined = call("/api/juntada/join", """{"name":"Ana"}""", guest)
        assertEquals(200, joined.status)
        val key = joined.json().getString("key")
        val id = joined.json().getString("id")
        assertEquals(403, call("/api/juntada/trivia/start", """{"topic":"x","count":5}""", guest).status)
        assertEquals(403, call("/api/juntada/trivia/stop", "{}", guest).status)
        assertEquals(403, call("/api/juntada/reset", "{}", guest).status)
        assertEquals(200, call("/api/juntada/expense", """{"key":"$key","payer":"$id","amount":500,"what":"pan","among":["$id"]}""", guest).status)
        assertEquals(200, call("/api/juntada/poll", """{"key":"$key","question":"¿?","options":["a","b"]}""", guest).status)
        val state = call("/api/juntada/state", """{"key":"$key"}""", guest).json()
        assertFalse(state.getBoolean("owner"))
        assertEquals("Ana", state.getJSONObject("me").getString("name"))
        assertEquals(500L, state.getLong("total"))
    }

    @Test
    fun `contrato - el dueno arma la trivia desde su celular`() {
        assertEquals(200, call("/api/juntada/trivia/start", """{"topic":"Kotlin","count":5}""", pairing.token).status)
        assertEquals("loading", house.trivia().getString("phase"))
        assertTrue(call("/api/juntada/state", "{}", pairing.token).json().getBoolean("owner"))
    }

    @Test
    fun `contrato - los errores de la juntada llegan con su codigo y no como falla del servidor`() {
        val guest = guest()
        call("/api/juntada/join", """{"name":"Ana"}""", guest)
        val taken = call("/api/juntada/join", """{"name":"ana"}""", guest("Otro"))
        assertEquals(409, taken.status)
        assertEquals("name_taken", taken.json().getString("error"))
        val stranger = call("/api/juntada/vote", """{"key":"nadie","option":0}""", guest)
        assertEquals(403, stranger.status)
        assertEquals("join", stranger.json().getString("error"))
        assertEquals(400, call("/api/juntada/join", "{}", guest).status)
        assertEquals(404, call("/api/juntada/inventada", "{}", guest).status)
        assertEquals(405, call("/api/juntada/state", "", guest, method = "GET").status)
    }

    @Test
    fun `contrato - otra pagina no puede usar la juntada desde el navegador de un invitado`() {
        val r = call("/api/juntada/join", """{"name":"Ana"}""", guest(), extra = "Origin: http://malo.com\r\n")
        assertEquals(403, r.status)
        assertNull(house.state(null, true).getJSONArray("people").optJSONObject(0))
    }

    @Test
    fun `contrato - una lista enorme de opciones se rechaza antes de procesarla`() {
        val guest = guest()
        val key = call("/api/juntada/join", """{"name":"Ana"}""", guest).json().getString("key")
        val many = (1..200).joinToString(",") { "\"o$it\"" }
        assertEquals(400, call("/api/juntada/poll", """{"key":"$key","question":"¿?","options":[$many]}""", guest).status)
    }
}
