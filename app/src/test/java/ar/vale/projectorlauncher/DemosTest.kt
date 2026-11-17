package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.device.DeviceHints
import ar.vale.projectorlauncher.juntada.DemoFiles
import ar.vale.projectorlauncher.juntada.Demos
import ar.vale.projectorlauncher.juntada.Juntada
import ar.vale.projectorlauncher.juntada.JuntadaError
import ar.vale.projectorlauncher.juntada.Stage
import ar.vale.projectorlauncher.juntada.TriviaMaker
import ar.vale.projectorlauncher.juntada.TriviaSource
import ar.vale.projectorlauncher.remote.Access
import ar.vale.projectorlauncher.remote.HttpParser
import ar.vale.projectorlauncher.remote.HttpRequest
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.JuntadaRoutes
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.RemoteDevice
import ar.vale.projectorlauncher.remote.Router
import org.json.JSONObject
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.InputStream
import java.nio.file.Files
import java.util.Random
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

/**
 * La fila de presentaciones y lo que se le sumó a las votaciones y a la trivia. Cada prueba cuida
 * una promesa hecha a quien arma una muestra de demos: los archivos no se pisan, hay una sola
 * persona en escena, y mientras presenta nadie más le maneja la pared.
 */
class DemosTest {

    private class FakeStage : Stage {
        val calls = ArrayList<String>()
        var opens = true
        var keys = true
        override fun open(demo: Demos.Shown): Boolean = opens.also { calls.add("open:${demo.id}:${demo.file}") }
        override fun close(id: Int) { calls.add("close:$id") }
        override fun key(id: Int, name: String): Boolean = keys.also { calls.add("key:$id:$name") }
        override fun pointer(id: Int, x: Float, y: Float, visible: Boolean) { calls.add("pointer:$id:$visible") }
        override fun timeUp(name: String) { calls.add("time:$name") }
        var inputs = listOf("cast", "hdmi")
        override fun sources(): List<String> = inputs
        override fun source(id: Int, name: String): Boolean = (name in inputs).also { calls.add("source:$id:$name") }
    }

    private class Device : RemoteDevice {
        val calls = ArrayList<String>()
        override fun state() = JSONObject().also { calls.add("state") }
        override fun key(name: String) = RemoteDevice.Result.OK.also { calls.add("key:$name") }
        override fun text(value: String, submit: Boolean) = RemoteDevice.Result.OK.also { calls.add("text") }
        override fun link(url: String) = RemoteDevice.Result.OK
        override fun upload(name: String, length: Long, body: InputStream) = name
        override fun saveClaudeKey(key: String) = true
        override fun askClaude(text: String) = RemoteDevice.Result.OK
        override fun claudeState() = JSONObject()
        override fun stopClaude() {}
        override fun newClaude() { calls.add("claude_new") }
        override fun report() = JSONObject().put("model", "fake").also { calls.add("report") }
        override fun pointer(x: Float, y: Float, visible: Boolean) { calls.add("pointer") }
        override fun tap(x: Float, y: Float) = RemoteDevice.Result.OK.also { calls.add("tap") }
        override fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float) = RemoteDevice.Result.OK.also { calls.add("swipe") }
        override fun apps() = JSONObject().also { calls.add("apps") }
        override fun open(pkg: String) = RemoteDevice.Result.OK.also { calls.add("open") }
        override fun cast() = RemoteDevice.Result.OK.also { calls.add("cast") }
        override fun fits(length: Long) = true
        override fun privateScreen() = false
    }

    private var clock = 1_000_000L
    private val pending = ArrayList<() -> Unit>()
    private val stage = FakeStage()
    private val gone = ArrayList<Int>()
    private fun juntada(stored: JSONObject? = null) = Juntada(stored, { clock }, Random(7)) { pending.add(it) }.also {
        it.stage = stage
        it.onDemosGone = { ids -> gone.addAll(ids) }
    }

    private val root: File = Files.createTempDirectory("gd-demos").toFile()

    @After
    fun clean() {
        root.deleteRecursively()
    }

    private fun code(block: () -> Unit): String? = try {
        block()
        null
    } catch (e: JuntadaError) {
        e.code
    }

    private fun Juntada.demos(key: String? = null, owner: Boolean = false) = state(key, owner).getJSONObject("demos")
    private fun JSONObject.entries() = getJSONArray("list").let { list -> (0 until list.length()).map(list::getJSONObject) }
    private fun JSONObject.entry(id: Int) = entries().first { it.getInt("id") == id }

    /** Una presentación con su archivo ya cargado, como queda después de una subida. */
    private fun Juntada.ready(person: Juntada.Person, title: String = "Demo de ${person.name}"): Int {
        val id = signUpDemo(person.key, false, title, "file")
        attachDemo(person.key, false, id, "demo.pdf", Demos.Media.PDF, 1000)
        return id
    }

    // --- Anotarse ---

    @Test
    fun `contrato - cada persona tiene una sola presentación esperando`() {
        val j = juntada()
        val ana = j.join("Ana")
        val id = j.signUpDemo(ana.key, false, "  Mi   app\u0007  ", "file")
        assertEquals("Mi app", j.demos().entry(id).getString("title"))
        assertEquals("demo_have", code { j.signUpDemo(ana.key, false, "Otra", "screen") })
        assertEquals("invalid", code { j.signUpDemo(j.join("Beto").key, false, "   ", "file") })
        assertEquals("invalid", code { j.signUpDemo(j.join("Caro").key, false, "Algo", "holograma") })
        assertEquals("join", code { j.signUpDemo("no-existe", false, "Algo", "file") })
    }

    @Test
    fun `contrato - quien ya presentó puede anotarse de nuevo`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.signUpDemo(ana.key, false, "Primera", "screen")
        j.startDemo(null)
        assertEquals("demo_have", code { j.signUpDemo(ana.key, false, "Segunda", "screen") })
        j.finishDemo(ana.key, false)
        j.signUpDemo(ana.key, false, "Segunda", "screen")
        assertEquals(2, j.demos().entries().size)
    }

    @Test
    fun `contrato - con la fila cerrada solo anota el dueño`() {
        val j = juntada()
        val ana = j.join("Ana")
        val host = j.join("Vale")
        j.demoOpen(false)
        assertEquals("demo_closed", code { j.signUpDemo(ana.key, false, "Tarde", "screen") })
        j.signUpDemo(host.key, true, "La del anfitrión", "screen")
        assertFalse(j.demos().getBoolean("open"))
    }

    // --- El escenario ---

    @Test
    fun `contrato - hay una sola presentación en escena`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val first = j.ready(ana)
        val second = j.ready(beto)
        j.startDemo(first)
        assertEquals("stage_busy", code { j.startDemo(second) })
        assertEquals("live", j.demos().entry(first).getString("state"))
        assertEquals("waiting", j.demos().entry(second).getString("state"))
        assertEquals(listOf("open:$first:demo.pdf"), stage.calls)
    }

    @Test
    fun `contrato - una presentación con archivo no empieza hasta que el archivo llegó`() {
        val j = juntada()
        val ana = j.join("Ana")
        val id = j.signUpDemo(ana.key, false, "Sin archivo", "file")
        assertEquals("demo_no_file", code { j.startDemo(id) })
        assertTrue(stage.calls.isEmpty())
        // Quien muestra su propia pantalla no manda nada: la pared solo le guarda el turno.
        val beto = j.join("Beto")
        val own = j.signUpDemo(beto.key, false, "Mi notebook", "screen")
        j.startDemo(own)
        assertEquals(listOf("open:$own:null"), stage.calls)
    }

    @Test
    fun `contrato - sin pedir ninguna empieza la primera de la fila, y el dueño puede cambiar el orden`() {
        val j = juntada()
        val ana = j.ready(j.join("Ana"))
        val beto = j.ready(j.join("Beto"))
        val caro = j.ready(j.join("Caro"))
        j.moveDemo(caro, up = true)
        j.moveDemo(caro, up = true)
        j.moveDemo(caro, up = true)
        assertEquals(listOf(caro, ana, beto), j.demos().entries().map { it.getInt("id") })
        j.moveDemo(ana, up = false)
        assertEquals(listOf(caro, beto, ana), j.demos().entries().map { it.getInt("id") })
        j.startDemo(null)
        assertEquals(caro, j.demos().getJSONObject("live").getInt("id"))
        assertEquals("demo_none", code { juntada().startDemo(null) })
    }

    @Test
    fun `contrato - el turno lo termina quien presenta o el dueño, y nadie más`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val id = j.ready(ana)
        j.startDemo(id)
        assertEquals("stage", code { j.finishDemo(beto.key, false) })
        assertEquals("live", j.demos().entry(id).getString("state"))
        j.finishDemo(ana.key, false)
        assertEquals("done", j.demos().entry(id).getString("state"))
        assertTrue(stage.calls.contains("close:$id"))
        assertEquals("closed", code { j.finishDemo(null, owner = true) })
    }

    @Test
    fun `contrato - mientras alguien presenta solo ella y el dueño manejan la pared`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val id = j.ready(ana)
        assertEquals("closed", code { j.demoKey(ana.key, false, "right") })
        j.startDemo(id)
        stage.calls.clear()
        assertEquals("stage", code { j.demoKey(beto.key, false, "right") })
        assertEquals("stage", code { j.demoPointer(beto.key, false, 0.5f, 0.5f, true) })
        assertEquals("stage", code { j.demoKey(null, false, "right") })
        assertTrue(stage.calls.isEmpty())
        assertTrue(j.demoKey(ana.key, false, "right"))
        assertTrue(j.demoKey(null, owner = true, name = "left"))
        j.demoPointer(ana.key, false, 0.2f, 0.3f, true)
        assertEquals(listOf("key:$id:right", "key:$id:left", "pointer:$id:true"), stage.calls)
        assertTrue(j.demos(ana.key).getJSONObject("live").getBoolean("control"))
        assertFalse(j.demos(beto.key).getJSONObject("live").getBoolean("control"))
        assertTrue(j.demos(beto.key, owner = true).getJSONObject("live").getBoolean("control"))
    }

    @Test
    fun `contrato - quien presenta solo alcanza pasar, volver, pausar y dejar la imagen en negro`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.startDemo(j.ready(ana))
        stage.calls.clear()
        for (name in listOf("home", "back", "up", "menu", "volup", "")) {
            assertEquals(name, "invalid", code { j.demoKey(ana.key, false, name) })
        }
        assertTrue(stage.calls.isEmpty())
        for (name in listOf("left", "right", "ok", "black")) assertTrue(j.demoKey(ana.key, false, name))
        // Si la pared está en otra cosa, la tecla no toca nada y se avisa.
        stage.keys = false
        assertFalse(j.demoKey(ana.key, false, "right"))
    }

    @Test
    fun `contrato - una presentación que se cortó vuelve a la fila, primera, con su archivo y sus votos`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val cut = j.ready(ana)
        val next = j.ready(beto)
        assertEquals("closed", code { j.requeueDemo(cut) })
        j.startDemo(cut)
        j.demoLeft(cut)
        j.rateDemo(beto.key, cut, 5)
        j.requeueDemo(cut)
        val demos = j.demos(beto.key)
        assertEquals(listOf(cut, next), demos.entries().map { it.getInt("id") })
        val back = demos.entry(cut)
        assertEquals("waiting", back.getString("state"))
        assertEquals("demo.pdf", j.demos(ana.key).entry(cut).getString("file"))
        assertEquals(5, back.getInt("my_stars"))
        assertTrue("ya no está en el podio ni en los aplausos", demos.isNull("thanks"))
        j.startDemo(null)
        assertEquals(cut, j.demos().getJSONObject("live").getInt("id"))
        assertEquals("gone", code { j.requeueDemo(999) })
    }

    @Test
    fun `contrato - no vuelve a la fila quien ya se anotó de nuevo`() {
        val j = juntada()
        val ana = j.join("Ana")
        val first = j.ready(ana)
        j.startDemo(first)
        j.finishDemo(ana.key, false)
        j.signUpDemo(ana.key, false, "La segunda", "screen")
        assertEquals("demo_have", code { j.requeueDemo(first) })
        assertEquals("done", j.demos().entry(first).getString("state"))
    }

    @Test
    fun `contrato - si la pared no puede abrir el archivo la presentación no empieza y vuelve a la fila`() {
        val j = juntada()
        val id = j.ready(j.join("Ana"))
        stage.opens = false
        assertEquals("stage_fail", code { j.startDemo(id) })
        assertEquals("waiting", j.demos().entry(id).getString("state"))
        assertTrue(j.demos().isNull("live"))
        assertFalse(j.staged)
    }

    @Test
    fun `contrato - cerrar la pantalla en la pared termina el turno`() {
        val j = juntada()
        val ana = j.ready(j.join("Ana"))
        val beto = j.ready(j.join("Beto"))
        j.startDemo(ana)
        j.demoLeft(beto)
        assertTrue("cerrar otra cosa no termina el turno de nadie", j.staged)
        j.demoLeft(ana)
        assertFalse(j.staged)
        assertEquals("done", j.demos().entry(ana).getString("state"))
        j.demoLeft(ana)
        assertEquals("waiting", j.demos().entry(beto).getString("state"))
    }

    @Test
    fun `contrato - el aviso de tiempo cumplido sale una sola vez y no corta a nadie`() {
        val j = juntada()
        val id = j.ready(j.join("Ana"))
        j.demoLimit(5)
        j.startDemo(id)
        stage.calls.clear()
        clock += 5 * 60_000L - 1
        j.state(null, false)
        assertTrue(stage.calls.isEmpty())
        clock += 1
        val live = j.demos().getJSONObject("live")
        assertEquals(5 * 60_000L, live.getLong("elapsed_ms"))
        assertEquals(5 * 60_000L, live.getLong("limit_ms"))
        clock += 60_000
        j.state(null, false)
        assertEquals(listOf("time:Ana"), stage.calls)
        assertEquals("live", j.demos().entry(id).getString("state"))
        assertEquals("invalid", code { j.demoLimit(61) })
        assertEquals("invalid", code { j.demoLimit(-1) })
    }

    // --- La sala ---

    @Test
    fun `contrato - nadie se aplaude ni se vota a sí mismo`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val id = j.ready(ana)
        j.startDemo(id)
        assertEquals("demo_own", code { j.clapDemo(ana.key, id, 1) })
        j.finishDemo(ana.key, false)
        assertEquals("demo_own", code { j.rateDemo(ana.key, id, 5) })
        j.rateDemo(beto.key, id, 4)
        assertEquals("join", code { j.rateDemo("nadie", id, 5) })
        assertEquals(1, j.demos().entry(id).getInt("votes"))
    }

    @Test
    fun `contrato - se aplaude en escena y hasta medio minuto después, y los aplausos de un celular tienen tope`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val caro = j.join("Caro")
        val id = j.ready(ana)
        assertEquals("closed", code { j.clapDemo(beto.key, id, 1) })
        j.startDemo(id)
        j.clapDemo(beto.key, id, 3)
        j.clapDemo(caro.key, id, 500)
        assertEquals(3 + Demos.CLAP_BATCH, j.demos().entry(id).getInt("claps"))
        repeat(10) { j.clapDemo(beto.key, id, Demos.CLAP_BATCH) }
        assertEquals(Demos.CLAP_CAP + Demos.CLAP_BATCH, j.demos().entry(id).getInt("claps"))
        j.finishDemo(null, owner = true)
        assertEquals(id, j.demos().getInt("thanks"))
        clock += Demos.CLAP_MS
        j.clapDemo(caro.key, id, 1)
        clock += 1
        assertEquals("closed", code { j.clapDemo(caro.key, id, 1) })
        assertTrue(j.demos().isNull("thanks"))
    }

    @Test
    fun `contrato - se vota de 1 a 5 solo cuando terminó, y se puede cambiar el voto`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val id = j.ready(ana)
        assertEquals("closed", code { j.rateDemo(beto.key, id, 5) })
        j.startDemo(id)
        assertEquals("closed", code { j.rateDemo(beto.key, id, 5) })
        j.finishDemo(ana.key, false)
        assertEquals("invalid", code { j.rateDemo(beto.key, id, 0) })
        assertEquals("invalid", code { j.rateDemo(beto.key, id, 6) })
        j.rateDemo(beto.key, id, 2)
        j.rateDemo(beto.key, id, 5)
        val entry = j.demos(beto.key).entry(id)
        assertEquals(1, entry.getInt("votes"))
        assertEquals(5.0, entry.getDouble("stars"), 0.0)
        assertEquals(5, entry.getInt("my_stars"))
        assertTrue(j.demos(ana.key).entry(id).isNull("my_stars"))
    }

    @Test
    fun `contrato - el podio ordena por promedio de votos y desempata con los aplausos`() {
        val j = juntada()
        val people = listOf("Ana", "Beto", "Caro", "Dani", "Eva").map { j.join(it) }
        val ids = people.map { j.ready(it) }
        fun present(index: Int, stars: List<Int>, claps: Int) {
            j.startDemo(ids[index])
            val voters = people.filterIndexed { i, _ -> i != index }
            if (claps > 0) j.clapDemo(voters[0].key, ids[index], claps)
            j.finishDemo(null, owner = true)
            stars.forEachIndexed { i, value -> j.rateDemo(voters[i].key, ids[index], value) }
        }
        present(0, listOf(4, 4, 4), claps = 2)
        present(1, listOf(5, 5, 4), claps = 0)
        present(2, listOf(4, 4, 4), claps = 9)
        present(3, emptyList(), claps = 20)
        present(4, listOf(4, 4), claps = 20)
        val podium = j.demos().getJSONArray("podium").let { p -> (0 until p.length()).map(p::getInt) }
        // Beto tiene el mejor promedio, y gana sin un solo aplauso. Ana, Caro y Eva empatan en
        // promedio: Eva tuvo menos votos y queda detrás aunque la aplaudieron más. Entre Ana y Caro,
        // con los mismos votos, deciden los aplausos. Sin votos, al final.
        assertEquals(listOf(ids[1], ids[2], ids[0], ids[4], ids[3]), podium)
        assertEquals(4.7, j.demos().entry(ids[1]).getDouble("stars"), 0.0)
        assertTrue(j.demos().entry(ids[3]).isNull("stars"))
    }

    // --- Lo que se guarda y lo que se borra ---

    @Test
    fun `contrato - la fila sobrevive a un apagón, y quien estaba en escena vuelve a esperar`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val caro = j.join("Caro")
        val done = j.ready(ana, "Ya pasó")
        j.startDemo(done)
        j.clapDemo(beto.key, done, 7)
        j.finishDemo(ana.key, false)
        j.rateDemo(beto.key, done, 4)
        clock += Demos.CLAP_MS + 1
        val live = j.ready(beto, "En escena")
        j.signUpDemo(caro.key, false, "Su pantalla", "screen")
        j.demoLimit(10)
        j.demoOpen(false)
        j.startDemo(live)

        val back = juntada(JSONObject(j.export().toString()))
        val demos = back.demos(beto.key)
        assertEquals(listOf("done", "waiting", "waiting"), demos.entries().map { it.getString("state") })
        assertTrue(demos.isNull("live"))
        assertFalse(back.staged)
        assertEquals(10, demos.getInt("limit_min"))
        assertFalse(demos.getBoolean("open"))
        val first = demos.entry(done)
        assertEquals(7, first.getInt("claps"))
        assertEquals(4, first.getInt("my_stars"))
        assertEquals("demo.pdf", back.demos(owner = true).entry(live).getString("file"))
        assertEquals("pdf", demos.entry(live).getString("media"))
        // Los números siguen desde donde iban: una presentación nueva no pisa la carpeta de otra.
        back.demoOpen(true)
        val next = back.signUpDemo(ana.key, false, "Otra", "file")
        assertTrue(next > live)
    }

    @Test
    fun `contrato - mientras se aplaude no se escribe el disco por cada toque`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val id = j.ready(ana)
        j.startDemo(id)
        val before = j.export().toString()
        j.clapDemo(beto.key, id, 5)
        assertEquals(before, j.export().toString())
        j.finishDemo(ana.key, false)
        val finished = j.export().toString()
        j.clapDemo(beto.key, id, 5)
        assertEquals(finished, j.export().toString())
        clock += Demos.CLAP_MS + 1
        assertTrue(j.export().toString().contains("\"claps\":{\"${beto.id}\":10}"))
    }

    @Test
    fun `contrato - al cerrarse el rato de aplausos se guarda una vez, sin esperar a que pase otra cosa`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val id = j.ready(ana)
        j.startDemo(id)
        j.finishDemo(ana.key, false)
        j.clapDemo(beto.key, id, 5)
        var saves = 0
        j.onChange = { saves++ }
        j.state(beto.key, false)
        assertEquals(0, saves)
        clock += Demos.CLAP_MS + 1
        j.state(beto.key, false)
        j.state(beto.key, false)
        assertEquals(1, saves)
    }

    @Test
    fun `contrato - empezar de cero vacía la fila, cierra el escenario y pide borrar los archivos`() {
        val j = juntada()
        val ana = j.ready(j.join("Ana"))
        val beto = j.ready(j.join("Beto"))
        j.demoLimit(5)
        j.startDemo(ana)
        j.reset()
        assertTrue(stage.calls.contains("close:$ana"))
        assertEquals(listOf(ana, beto), gone)
        val demos = j.demos()
        assertTrue(demos.entries().isEmpty())
        assertEquals(0, demos.getInt("limit_min"))
        assertFalse(j.staged)
    }

    @Test
    fun `contrato - bajarse de la fila pide borrar su archivo, y quien está en escena no se baja`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        val mine = j.ready(ana)
        val other = j.ready(beto)
        assertEquals("not_allowed", code { j.withdrawDemo(ana.key, false, other) })
        j.startDemo(mine)
        assertEquals("demo_live", code { j.withdrawDemo(ana.key, false, mine) })
        j.withdrawDemo(null, owner = true, id = other)
        assertEquals(listOf(other), gone)
        assertEquals("gone", code { j.withdrawDemo(null, owner = true, id = other) })
    }

    @Test
    fun `contrato - una presentación cuyo archivo ya no está en el disco pide el archivo de nuevo`() {
        val j = juntada()
        val ana = j.ready(j.join("Ana"))
        val beto = j.ready(j.join("Beto"))
        j.dropMissingDemoFiles { id, name -> id == beto && name == "demo.pdf" }
        assertTrue(j.demos(owner = true).entry(ana).isNull("file"))
        assertEquals("demo.pdf", j.demos(owner = true).entry(beto).getString("file"))
        assertEquals("demo_no_file", code { j.startDemo(ana) })
    }

    // --- Las rutas ---

    private val pairing = Pairing("t".repeat(48), {}, { clock })
    private val device = Device()
    private val access = Access(now = { clock })
    private val house = juntada().also { it.onReset = { access.clearGuests() } }
    private val files = DemoFiles(root, margin = 0)
    private val source = TriviaSource { _, _ -> error("sin trivia") }
    private val routes = JuntadaRoutes(house, source, files, waitMs = 150)
    private val router = Router(pairing, device, routes, access) { null }

    private fun guest(name: String, level: Access.Level = Access.Level.PARTY): String {
        val pass = (access.ask(name, "10.0.0.$name") as Access.Asked.Pass).value
        access.decide(access.pending().last().id, level)
        return pass
    }

    private fun call(path: String, body: String = "{}", token: String?, method: String = "POST"): HttpResponse {
        val head = StringBuilder("$method $path HTTP/1.1\r\nHost: 10.0.0.2:8686\r\nContent-Type: application/json\r\n")
        token?.let { head.append("Authorization: Bearer $it\r\n") }
        head.append("Content-Length: ${body.toByteArray().size}\r\n\r\n").append(body)
        return router.handle(HttpParser.parse(ByteArrayInputStream(head.toString().toByteArray()))!!)
    }

    private fun upload(token: String?, key: String?, id: Int, name: String, body: InputStream, length: Long): HttpRequest {
        val headers = HashMap<String, String>()
        headers["host"] = "10.0.0.2:8686"
        token?.let { headers["authorization"] = "Bearer $it" }
        key?.let { headers[JuntadaRoutes.KEY_HEADER] = it }
        return HttpRequest("POST", "/api/juntada/demo/upload", mapOf("id" to id.toString(), "name" to name), headers, length, body)
    }

    private fun send(token: String?, key: String?, id: Int, name: String, bytes: ByteArray = "%PDF-1.4".toByteArray()): HttpResponse =
        router.handle(upload(token, key, id, name, ByteArrayInputStream(bytes), bytes.size.toLong()))

    private fun HttpResponse.json(): JSONObject =
        JSONObject(ByteArrayOutputStream().also(::write).toString("UTF-8").substringAfter("\r\n\r\n"))

    private fun HttpResponse.error(): String = json().optString("error")

    /** Un invitado que entró a la juntada: su pase, su clave y su presentación anotada. */
    private class Seat(val pass: String, val key: String, val id: Int)

    private fun seat(name: String, kind: String = "file"): Seat {
        val pass = guest(name)
        val key = call("/api/juntada/join", """{"name":"$name"}""", pass).json().getString("key")
        val state = call("/api/juntada/demo", """{"key":"$key","title":"Demo de $name","kind":"$kind"}""", pass)
        assertEquals(200, state.status)
        val id = state.json().getJSONObject("demos").entries().first { it.getBoolean("mine") }.getInt("id")
        return Seat(pass, key, id)
    }

    @Test
    fun `contrato - un invitado de la juntada se anota y manda su archivo`() {
        val ana = seat("Ana")
        val bytes = ByteArray(5000) { it.toByte() }
        val sent = send(ana.pass, ana.key, ana.id, "Mi demo.pdf", bytes)
        assertEquals(200, sent.status)
        val entry = sent.json().getJSONObject("demos").entry(ana.id)
        assertEquals("pdf", entry.getString("media"))
        assertEquals("Mi demo.pdf", entry.getString("file"))
        assertEquals(5000, entry.getLong("size"))
        assertTrue(bytes.contentEquals(files.file(ana.id, "Mi demo.pdf").readBytes()))
        // No pasa por Cine ni por el dispositivo: queda en la carpeta de su presentación.
        assertTrue(device.calls.isEmpty())
        assertEquals(listOf("Mi demo.pdf"), File(root, ana.id.toString()).list()!!.toList())
    }

    @Test
    fun `contrato - nadie reemplaza el archivo de otro`() {
        val ana = seat("Ana")
        val beto = seat("Beto")
        assertEquals(200, send(ana.pass, ana.key, ana.id, "ana.pdf").status)
        val intruder = send(beto.pass, beto.key, ana.id, "beto.pdf")
        assertEquals(409, intruder.status)
        assertEquals("not_allowed", intruder.error())
        assertEquals(listOf("ana.pdf"), File(root, ana.id.toString()).list()!!.toList())
        // El dueño sí puede cargarle el archivo a quien no logra mandarlo.
        assertEquals(200, send(pairing.token, null, ana.id, "del-dueño.pdf").status)
    }

    @Test
    fun `contrato - la clave de la persona va en una cabecera y nunca en la dirección`() {
        val ana = seat("Ana")
        val request = HttpRequest(
            "POST", "/api/juntada/demo/upload",
            mapOf("id" to ana.id.toString(), "name" to "a.pdf", "key" to ana.key),
            mapOf("host" to "10.0.0.2:8686", "authorization" to "Bearer ${ana.pass}"),
            4, ByteArrayInputStream("%PDF".toByteArray())
        )
        val response = router.handle(request)
        assertEquals(403, response.status)
        assertEquals("join", response.error())
    }

    @Test
    fun `contrato - a la fila solo entran PDF, imágenes y videos que caben`() {
        val ana = seat("Ana")
        for (name in listOf("virus.apk", "notas.txt", "charla.key", "charla.pptx", "sin-extension", "pagina.html")) {
            val response = send(ana.pass, ana.key, ana.id, name)
            assertEquals(name, 415, response.status)
            assertEquals(name, "demo_type", response.error())
        }
        for (name in listOf("a.pdf", "foto.JPG", "captura.png", "video.mp4", "pantalla.MOV", "foto.heic")) {
            assertEquals(name, 200, send(ana.pass, ana.key, ana.id, name).status)
        }
        val big = router.handle(upload(ana.pass, ana.key, ana.id, "enorme.mp4", ByteArrayInputStream(ByteArray(0)), Demos.MAX_BYTES + 1))
        assertEquals(413, big.status)
        assertEquals("demo_big", big.error())
        assertEquals(411, router.handle(upload(ana.pass, ana.key, ana.id, "vacio.pdf", ByteArrayInputStream(ByteArray(0)), 0)).status)
        assertEquals(400, send(ana.pass, ana.key, ana.id, "..").status)
    }

    @Test
    fun `contrato - sin espacio en el disco el archivo no se empieza a escribir`() {
        val tight = DemoFiles(root, margin = Long.MAX_VALUE / 2)
        val small = Router(pairing, device, JuntadaRoutes(house, source, tight), access) { null }
        val ana = seat("Ana")
        val response = small.handle(upload(ana.pass, ana.key, ana.id, "a.pdf", ByteArrayInputStream(ByteArray(10)), 10))
        assertEquals(507, response.status)
        assertFalse(File(root, ana.id.toString()).exists())
    }

    @Test
    fun `contrato - el celular puede preguntar antes de mandar, y recibe el mismo no`() {
        val ana = seat("Ana")
        val beto = seat("Beto")
        fun check(seat: Seat, id: Int, name: String, size: Long) =
            call("/api/juntada/demo/check", """{"key":"${seat.key}","id":$id,"name":"$name","size":$size}""", seat.pass)
        assertEquals(200, check(ana, ana.id, "a.pdf", 1000).status)
        assertEquals("demo_type", check(ana, ana.id, "a.pptx", 1000).error())
        assertEquals("demo_big", check(ana, ana.id, "a.mp4", Demos.MAX_BYTES + 1).error())
        assertEquals("not_allowed", check(beto, ana.id, "a.pdf", 1000).error())
        assertEquals("gone", check(ana, 999, "a.pdf", 1000).error())
        assertFalse("preguntar no escribe nada", File(root, ana.id.toString()).exists())
    }

    @Test
    fun `contrato - dos presentaciones con el mismo nombre de archivo no se pisan`() {
        val ana = seat("Ana")
        val beto = seat("Beto")
        send(ana.pass, ana.key, ana.id, "demo.pdf", "de ana".toByteArray())
        send(beto.pass, beto.key, beto.id, "demo.pdf", "de beto".toByteArray())
        assertEquals("de ana", files.file(ana.id, "demo.pdf").readText())
        assertEquals("de beto", files.file(beto.id, "demo.pdf").readText())
    }

    @Test
    fun `contrato - mandar otro archivo reemplaza al anterior, y una subida cortada no lo pierde`() {
        val ana = seat("Ana")
        send(ana.pass, ana.key, ana.id, "primero.pdf", "uno".toByteArray())
        // Llega menos de lo que anunció: la red se cortó a mitad de camino.
        val cut = router.handle(upload(ana.pass, ana.key, ana.id, "segundo.pdf", ByteArrayInputStream("do".toByteArray()), 3))
        assertEquals(400, cut.status)
        assertEquals("incomplete", cut.error())
        assertEquals(listOf("primero.pdf"), File(root, ana.id.toString()).list()!!.toList())
        assertEquals("primero.pdf", house.demos(owner = true).entry(ana.id).getString("file"))
        send(ana.pass, ana.key, ana.id, "segundo.pdf", "dos".toByteArray())
        assertEquals(listOf("segundo.pdf"), File(root, ana.id.toString()).list()!!.toList())
        assertEquals("segundo.pdf", house.demos(owner = true).entry(ana.id).getString("file"))
    }

    @Test
    fun `contrato - con el turno dado ya no se cambia el archivo`() {
        val ana = seat("Ana")
        send(ana.pass, ana.key, ana.id, "a.pdf", "uno".toByteArray())
        assertEquals(200, call("/api/juntada/demo/start", """{"id":${ana.id}}""", pairing.token).status)
        val late = send(ana.pass, ana.key, ana.id, "b.pdf", "dos".toByteArray())
        assertEquals("demo_live", late.error())
        assertEquals("uno", files.file(ana.id, "a.pdf").readText())
    }

    @Test
    fun `contrato - si le dan el turno mientras entra un archivo nuevo, la pared sigue con el que tenía`() {
        val patient = Router(pairing, device, JuntadaRoutes(house, source, files, waitMs = 5000), access) { null }
        val ana = seat("Ana")
        send(ana.pass, ana.key, ana.id, "a.pdf", "uno".toByteArray())
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        val data = "dos".toByteArray()
        var late: HttpResponse? = null
        val sending = thread { late = patient.handle(upload(ana.pass, ana.key, ana.id, "b.pdf", Slow(started, gate, data), data.size.toLong())) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        // El archivo nuevo todavía está llegando, y el dueño le da el turno con el que ya tenía.
        assertEquals(200, call("/api/juntada/demo/start", """{"id":${ana.id}}""", pairing.token).status)
        gate.countDown()
        sending.join(5000)
        assertEquals(409, late!!.status)
        assertEquals("demo_live", late!!.error())
        assertEquals("lo que la pared está mostrando no se toca", listOf("a.pdf"), File(root, ana.id.toString()).list()!!.toList())
        assertEquals("uno", files.file(ana.id, "a.pdf").readText())
        assertEquals("a.pdf", house.demos(owner = true).entry(ana.id).getString("file"))
    }

    @Test
    fun `contrato - quien se baja de la fila mientras su archivo entra no deja nada en el disco`() {
        val patient = Router(pairing, device, JuntadaRoutes(house, source, files, waitMs = 5000), access) { null }
        val ana = seat("Ana")
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        val data = "tarde".toByteArray()
        var late: HttpResponse? = null
        val sending = thread { late = patient.handle(upload(ana.pass, ana.key, ana.id, "a.pdf", Slow(started, gate, data), data.size.toLong())) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        assertEquals(200, call("/api/juntada/demo/leave", """{"key":"${ana.key}","id":${ana.id}}""", ana.pass).status)
        gate.countDown()
        sending.join(5000)
        assertEquals(409, late!!.status)
        assertEquals("gone", late!!.error())
        assertFalse("no queda ni la carpeta", File(root, ana.id.toString()).exists())
    }

    /** Un archivo que no termina de llegar nunca, hasta que alguien corta la conexión. */
    private class Stuck(private val started: CountDownLatch) : InputStream() {
        private val closed = CountDownLatch(1)
        override fun read(): Int {
            started.countDown()
            closed.await(5, TimeUnit.SECONDS)
            throw java.io.IOException("se cortó")
        }

        override fun close() {
            closed.countDown()
        }
    }

    @Test
    fun `contrato - sacar de la fila a quien está mandando corta su archivo, y el que esperaba pasa`() {
        // Como en el equipo: una presentación que se va de la fila se lleva sus archivos.
        house.onDemosGone = { ids -> ids.forEach(files::drop) }
        val patient = Router(pairing, device, JuntadaRoutes(house, source, files, waitMs = 5000), access) { null }
        val ana = seat("Ana")
        val beto = seat("Beto")
        val started = CountDownLatch(1)
        var cut: HttpResponse? = null
        var next: HttpResponse? = null
        val one = thread { cut = patient.handle(upload(ana.pass, ana.key, ana.id, "eterno.mp4", Stuck(started), 1000)) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        val two = thread { next = patient.handle(upload(beto.pass, beto.key, beto.id, "rapido.pdf", ByteArrayInputStream("ya".toByteArray()), 2)) }
        awaitQueued(two)
        // El dueño la saca de la fila: no hay que esperar a que termine de llegar.
        assertEquals(200, call("/api/juntada/demo/leave", """{"id":${ana.id}}""", pairing.token).status)
        one.join(3000)
        two.join(3000)
        assertFalse("la subida cortada no puede seguir ocupando el turno", one.isAlive)
        assertEquals(400, cut!!.status)
        assertEquals(200, next!!.status)
        assertEquals("ya", files.file(beto.id, "rapido.pdf").readText())
        assertFalse(File(root, ana.id.toString()).exists())
        assertTrue(house.demos().isNull("receiving"))
    }

    /** Un archivo que avisa si alguien llegó a leerlo. */
    private class Watched(data: ByteArray) : ByteArrayInputStream(data) {
        @Volatile var touched = false
        override fun read(): Int = super.read().also { touched = true }
        override fun read(b: ByteArray, off: Int, len: Int): Int = super.read(b, off, len).also { touched = true }
    }

    @Test
    fun `contrato - lo que cambió mientras esperaba el turno se vuelve a mirar antes de recibir nada`() {
        val patient = Router(pairing, device, JuntadaRoutes(house, source, files, waitMs = 5000), access) { null }
        val ana = seat("Ana")
        val beto = seat("Beto")
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        val data = "lento".toByteArray()
        val one = thread { patient.handle(upload(ana.pass, ana.key, ana.id, "lento.pdf", Slow(started, gate, data), data.size.toLong())) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        val body = Watched("ya".toByteArray())
        var second: HttpResponse? = null
        val two = thread { second = patient.handle(upload(beto.pass, beto.key, beto.id, "rapido.pdf", body, 2)) }
        awaitQueued(two)
        // Mientras espera, Beto se baja de la fila.
        assertEquals(200, call("/api/juntada/demo/leave", """{"key":"${beto.key}","id":${beto.id}}""", beto.pass).status)
        gate.countDown()
        one.join(5000)
        two.join(5000)
        assertEquals(409, second!!.status)
        assertEquals("gone", second!!.error())
        assertFalse("no se gasta la red ni el disco en un archivo que ya no va", body.touched)
        assertFalse(File(root, beto.id.toString()).exists())
    }

    @Test
    fun `contrato - quien muestra su pantalla no manda un archivo`() {
        val ana = seat("Ana", kind = "screen")
        val response = send(ana.pass, ana.key, ana.id, "a.pdf")
        assertEquals(409, response.status)
        assertEquals("invalid", response.error())
        assertFalse(File(root, ana.id.toString()).exists())
        assertTrue(house.demos(owner = true).entry(ana.id).isNull("file"))
    }

    /** Un archivo que tarda: se queda a mitad de camino hasta que la prueba lo deja seguir. */
    private class Slow(private val started: CountDownLatch, private val gate: CountDownLatch, private val data: ByteArray) : InputStream() {
        private var at = 0
        override fun read(): Int {
            if (at == 0) {
                started.countDown()
                gate.await(5, TimeUnit.SECONDS)
            }
            return if (at < data.size) data[at++].toInt() and 0xff else -1
        }
    }

    /** Espera a que ese pedido quede frenado esperando su turno. No duerme un tiempo fijo: mira el hilo. */
    private fun awaitQueued(waiting: Thread) {
        val deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(5)
        while (waiting.state != Thread.State.TIMED_WAITING && waiting.isAlive && System.nanoTime() < deadline) Thread.yield()
        assertEquals("el pedido tenía que quedar esperando su turno", Thread.State.TIMED_WAITING, waiting.state)
    }

    @Test
    fun `contrato - los archivos entran de a uno y en orden, y el segundo espera su turno`() {
        val patient = Router(pairing, device, JuntadaRoutes(house, source, files, waitMs = 5000), access) { null }
        val ana = seat("Ana")
        val beto = seat("Beto")
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        val data = "lento".toByteArray()
        var first: HttpResponse? = null
        var second: HttpResponse? = null
        assertTrue(house.demos().isNull("receiving"))
        val one = thread { first = patient.handle(upload(ana.pass, ana.key, ana.id, "lento.pdf", Slow(started, gate, data), data.size.toLong())) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        val two = thread { second = patient.handle(upload(beto.pass, beto.key, beto.id, "rapido.pdf", ByteArrayInputStream("ya".toByteArray()), 2)) }
        awaitQueued(two)
        assertFalse(files.exists(beto.id, "rapido.pdf"))
        // Todos ven de quién es el archivo que está entrando: el celular de Beto dice que espera su turno.
        assertEquals(ana.id, house.demos().getInt("receiving"))
        gate.countDown()
        one.join(5000)
        two.join(5000)
        assertEquals(200, first!!.status)
        assertEquals(200, second!!.status)
        assertEquals("lento", files.file(ana.id, "lento.pdf").readText())
        assertEquals("ya", files.file(beto.id, "rapido.pdf").readText())
        assertTrue(house.demos().isNull("receiving"))
    }

    @Test
    fun `contrato - con demasiados archivos esperando, el que llega no ocupa otra conexión`() {
        val narrow = Router(pairing, device, JuntadaRoutes(house, source, files, waitMs = 5000, maxWaiting = 1), access) { null }
        val ana = seat("Ana")
        val beto = seat("Beto")
        val caro = seat("Caro")
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        val data = "lento".toByteArray()
        val one = thread { narrow.handle(upload(ana.pass, ana.key, ana.id, "lento.pdf", Slow(started, gate, data), data.size.toLong())) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        var second: HttpResponse? = null
        val two = thread { second = narrow.handle(upload(beto.pass, beto.key, beto.id, "espera.pdf", ByteArrayInputStream("ya".toByteArray()), 2)) }
        awaitQueued(two)
        val third = narrow.handle(upload(caro.pass, caro.key, caro.id, "tarde.pdf", ByteArrayInputStream("no".toByteArray()), 2))
        assertEquals(409, third.status)
        assertEquals("busy", third.error())
        assertTrue("el que ya esperaba sigue en la fila", two.isAlive)
        gate.countDown()
        one.join(5000)
        two.join(5000)
        assertEquals(200, second!!.status)
        assertFalse(File(root, caro.id.toString()).exists())
    }

    @Test
    fun `contrato - si la espera es demasiada, el celular se entera y nada queda a medias`() {
        val ana = seat("Ana")
        val beto = seat("Beto")
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        val data = "lento".toByteArray()
        val one = thread { router.handle(upload(ana.pass, ana.key, ana.id, "lento.pdf", Slow(started, gate, data), data.size.toLong())) }
        assertTrue(started.await(5, TimeUnit.SECONDS))
        val refused = send(beto.pass, beto.key, beto.id, "rapido.pdf")
        assertEquals(409, refused.status)
        assertEquals("busy", refused.error())
        assertEquals("el que se cansó de esperar no le saca el turno al que está entrando", ana.id, house.demos().getInt("receiving"))
        gate.countDown()
        one.join(5000)
        assertFalse(File(root, beto.id.toString()).exists())
        assertEquals(200, send(beto.pass, beto.key, beto.id, "rapido.pdf").status)
    }

    @Test
    fun `contrato - llevar la fila es solo del dueño`() {
        val ana = seat("Ana")
        send(ana.pass, ana.key, ana.id, "a.pdf")
        val owned = listOf(
            "/api/juntada/demo/move" to """{"key":"${ana.key}","id":${ana.id},"up":true}""",
            "/api/juntada/demo/limit" to """{"key":"${ana.key}","minutes":1}""",
            "/api/juntada/demo/open" to """{"key":"${ana.key}","open":false}""",
            "/api/juntada/demo/again" to """{"key":"${ana.key}","id":${ana.id}}""",
            "/api/juntada/demo/start" to """{"key":"${ana.key}","id":${ana.id}}"""
        )
        for ((path, body) in owned) {
            val response = call(path, body, ana.pass)
            assertEquals(path, 403, response.status)
            assertEquals(path, "owner", response.error())
        }
        assertFalse(house.staged)
        // Con el token del dueño pasan todas; volver a la fila una que todavía espera no corresponde.
        for ((path, body) in owned) assertEquals(path, if (path.endsWith("again")) 409 else 200, call(path, body, pairing.token).status)
        assertTrue(house.staged)
    }

    @Test
    fun `contrato - nadie entra a la fila sin permiso del dueño`() {
        val ana = seat("Ana")
        val stranger = "x".repeat(48)
        assertEquals(401, call("/api/juntada/demo", """{"key":"${ana.key}","title":"Colado","kind":"screen"}""", stranger).status)
        assertEquals(401, call("/api/juntada/demo", """{"key":"${ana.key}","title":"Colado","kind":"screen"}""", null).status)
        assertEquals(401, send(stranger, ana.key, ana.id, "a.pdf").status)
        assertEquals(401, send(access.code, ana.key, ana.id, "a.pdf").status)
        assertFalse(File(root, ana.id.toString()).exists())
    }

    @Test
    fun `contrato - con alguien en escena el control prestado no mueve la pared`() {
        val ana = seat("Ana", kind = "screen")
        val borrowed = guest("Beto", Access.Level.CONTROL)
        val moves = listOf(
            "/api/key" to """{"name":"right"}""", "/api/text" to """{"text":"hola"}""", "/api/tap" to """{"x":0.5,"y":0.5}""",
            "/api/swipe" to """{"x1":0.1,"y1":0.1,"x2":0.2,"y2":0.2}""", "/api/pointer" to """{"x":0.5,"y":0.5}""",
            "/api/open" to """{"package":"com.netflix.mediaclient"}""", "/api/cast" to "{}"
        )
        for ((path, body) in moves) assertEquals(path, 200, call(path, body, borrowed).status)
        device.calls.clear()
        assertEquals(200, call("/api/juntada/demo/start", "{}", pairing.token).status)
        for ((path, body) in moves) {
            val response = call(path, body, borrowed)
            assertEquals(path, 403, response.status)
            assertEquals(path, "stage", response.error())
        }
        assertTrue(device.calls.isEmpty())
        // Mirar qué hay sigue permitido, y el dueño nunca pierde el control de su proyector.
        assertEquals(200, call("/api/state", "", borrowed, "GET").status)
        assertEquals(200, call("/api/key", """{"name":"right"}""", pairing.token).status)
        assertEquals(listOf("state", "key:right"), device.calls)
        assertEquals(200, call("/api/juntada/demo/finish", """{"key":"${ana.key}"}""", ana.pass).status)
        assertEquals(200, call("/api/key", """{"name":"right"}""", borrowed).status)
    }

    @Test
    fun `contrato - quien muestra su pantalla elige por dónde entra, y la pared se pone a recibirla`() {
        val ana = seat("Ana", kind = "screen")
        val beto = seat("Beto")
        call("/api/juntada/demo/start", """{"id":${ana.id}}""", pairing.token)
        stage.calls.clear()
        // Solo quien presenta, y el dueño, ven por dónde puede entrar la pantalla en este equipo.
        fun sources(key: String, token: String) = call("/api/juntada/state", """{"key":"$key"}""", token).json()
            .getJSONObject("demos").getJSONObject("live").optJSONArray("sources")?.let { a -> (0 until a.length()).map(a::getString) }
        assertEquals(listOf("cast", "hdmi"), sources(ana.key, ana.pass))
        assertEquals(listOf("cast", "hdmi"), sources("", pairing.token))
        assertNull(sources(beto.key, beto.pass))

        assertEquals(200, call("/api/juntada/demo/source", """{"key":"${ana.key}","name":"cast"}""", ana.pass).status)
        assertEquals(200, call("/api/juntada/demo/source", """{"name":"hdmi"}""", pairing.token).status)
        assertEquals(listOf("source:${ana.id}:cast", "source:${ana.id}:hdmi"), stage.calls)

        // Nadie más, y nada que no sea una de las dos entradas.
        val other = call("/api/juntada/demo/source", """{"key":"${beto.key}","name":"cast"}""", beto.pass)
        assertEquals(409, other.status)
        assertEquals("stage", other.error())
        assertEquals("invalid", call("/api/juntada/demo/source", """{"key":"${ana.key}","name":"netflix"}""", ana.pass).error())
        assertEquals(2, stage.calls.size)

        // Un equipo sin esa entrada lo dice, en vez de dejar a alguien esperando frente a la pared.
        stage.inputs = listOf("hdmi")
        assertEquals(listOf("hdmi"), sources(ana.key, ana.pass))
        val missing = call("/api/juntada/demo/source", """{"key":"${ana.key}","name":"cast"}""", ana.pass)
        assertEquals(409, missing.status)
        assertEquals("no_source", missing.error())
    }

    @Test
    fun `contrato - quien presenta un archivo no cambia la entrada de la pared`() {
        val ana = seat("Ana")
        send(ana.pass, ana.key, ana.id, "a.pdf")
        call("/api/juntada/demo/start", "{}", pairing.token)
        stage.calls.clear()
        val response = call("/api/juntada/demo/source", """{"key":"${ana.key}","name":"hdmi"}""", ana.pass)
        assertEquals(409, response.status)
        assertEquals("invalid", response.error())
        assertTrue(stage.calls.isEmpty())
        assertFalse(call("/api/juntada/state", """{"key":"${ana.key}"}""", ana.pass).json().getJSONObject("demos").getJSONObject("live").has("sources"))
    }

    @Test
    fun `contrato - con un pase entra una sola persona, y quien vuelve a entrar es quien era`() {
        val pass = guest("Ana")
        val first = call("/api/juntada/join", """{"name":"Ana"}""", pass).json()
        val again = call("/api/juntada/join", """{"name":"Ana otra vez"}""", pass).json()
        assertEquals(first.getString("id"), again.getString("id"))
        assertEquals(first.getString("key"), again.getString("key"))
        assertEquals("Ana", again.getString("name"))
        assertEquals(1, house.state(null, false).getJSONArray("people").length())
        // Otro pase es otra persona.
        val beto = call("/api/juntada/join", """{"name":"Beto"}""", guest("Beto")).json()
        assertFalse(first.getString("id") == beto.getString("id"))
        // Y después de apagar y prender, cada pase sigue siendo quien era.
        val restored = juntada(house.export())
        assertEquals(first.getString("key"), restored.join("Otro nombre", access.pass("Bearer $pass")).key)
        assertEquals(2, restored.state(null, false).getJSONArray("people").length())
    }

    @Test
    fun `contrato - el puntero de quien presenta tiene que ser un número`() {
        val ana = seat("Ana")
        send(ana.pass, ana.key, ana.id, "a.pdf")
        call("/api/juntada/demo/start", "{}", pairing.token)
        stage.calls.clear()
        assertEquals(400, call("/api/juntada/demo/pointer", """{"key":"${ana.key}","x":"NaN","y":0.6}""", ana.pass).status)
        assertTrue(stage.calls.isEmpty())
    }

    @Test
    fun `contrato - cómo se llama un archivo lo ven quien lo mandó y el dueño, no los demás`() {
        val ana = seat("Ana")
        val beto = seat("Beto")
        send(ana.pass, ana.key, ana.id, "secreto.pdf")
        fun seen(key: String?, owner: Boolean) = house.state(key, owner).getJSONObject("demos").entry(ana.id)
        assertEquals("secreto.pdf", seen(ana.key, false).getString("file"))
        assertEquals("secreto.pdf", seen(null, true).getString("file"))
        assertTrue(seen(beto.key, false).isNull("file"))
        assertTrue(seen(null, false).isNull("file"))
        // Que el archivo está se sigue viendo: de eso depende saber si esa presentación puede pasar.
        assertEquals("pdf", seen(beto.key, false).getString("media"))
    }

    @Test
    fun `contrato - quien presenta maneja su turno desde la juntada, sin tener el control del proyector`() {
        val ana = seat("Ana")
        val beto = seat("Beto")
        send(ana.pass, ana.key, ana.id, "a.pdf")
        call("/api/juntada/demo/start", "{}", pairing.token)
        stage.calls.clear()
        assertEquals(200, call("/api/juntada/demo/key", """{"key":"${ana.key}","name":"right"}""", ana.pass).status)
        assertEquals(200, call("/api/juntada/demo/pointer", """{"key":"${ana.key}","x":0.4,"y":0.6}""", ana.pass).status)
        assertEquals(listOf("key:${ana.id}:right", "pointer:${ana.id}:true"), stage.calls)
        val other = call("/api/juntada/demo/key", """{"key":"${beto.key}","name":"right"}""", beto.pass)
        assertEquals(409, other.status)
        assertEquals("stage", other.error())
        // El control de siempre sigue cerrado para ella: es invitada de la juntada y nada más.
        assertEquals(403, call("/api/key", """{"name":"right"}""", ana.pass).status)
        stage.keys = false
        val away = call("/api/juntada/demo/key", """{"key":"${ana.key}","name":"right"}""", ana.pass)
        assertEquals(409, away.status)
        assertEquals("stage_away", away.error())
    }

    @Test
    fun `contrato - la subida de una presentación puede tardar solo si la manda alguien con permiso`() {
        val ana = seat("Ana")
        val pending = (access.ask("Sin aprobar", "10.0.0.9") as Access.Asked.Pass).value
        fun long(token: String?) = router.isLong(upload(token, ana.key, ana.id, "a.pdf", ByteArrayInputStream(ByteArray(0)), 10))
        assertTrue(long(ana.pass))
        assertTrue(long(pairing.token))
        assertFalse(long(null))
        assertFalse(long("x".repeat(48)))
        assertFalse(long(access.code))
        assertFalse(long(pending))
    }

    @Test
    fun `contrato - una charla nueva con Claude y el informe del equipo son solo del dueño`() {
        val borrowed = guest("Beto", Access.Level.CONTROL)
        for ((method, path) in listOf("POST" to "/api/claude/new", "GET" to "/api/report")) {
            assertEquals(path, 401, call(path, "{}", null, method).status)
            assertEquals(path, 403, call(path, "{}", borrowed, method).status)
        }
        assertTrue(device.calls.isEmpty())
        assertEquals(200, call("/api/claude/new", "{}", pairing.token).status)
        assertEquals("fake", call("/api/report", "", pairing.token, "GET").json().getString("model"))
        assertEquals(listOf("claude_new", "report"), device.calls)
    }

    // --- Los archivos ---

    @Test
    fun `contrato - al arrancar se va lo que quedó de presentaciones que ya no existen`() {
        files.receive(1, 3, ByteArrayInputStream("uno".toByteArray()))
        files.commit(1, "a.pdf")
        files.receive(2, 3, ByteArrayInputStream("dos".toByteArray()))
        files.commit(2, "b.pdf")
        File(File(root, "1"), DemoFiles.PART).writeText("a medias")
        File(root, "suelto.txt").writeText("x")
        files.sweep(listOf(1))
        assertEquals(listOf("1"), root.list()!!.toList())
        assertEquals(listOf("a.pdf"), File(root, "1").list()!!.toList())
        files.drop(1)
        assertTrue(root.list()!!.isEmpty())
    }

    // --- Votaciones ---

    @Test
    fun `contrato - con voto secreto no sale cuántos votos tiene cada opción hasta que cierra`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.createPoll(ana.key, false, "¿Mejor demo?", listOf("A", "B"), secret = true)
        j.vote(ana.key, 0)
        j.vote(beto.key, 0)
        val open = j.state(beto.key, false).getJSONObject("poll")
        assertTrue(open.getBoolean("secret"))
        assertEquals(2, open.getInt("total"))
        assertEquals(0, open.getInt("mine"))
        for (i in 0..1) assertTrue(open.getJSONArray("options").getJSONObject(i).isNull("votes"))
        assertFalse("el estado entero no trae los votos por opción", j.state(beto.key, true).toString().contains("\"votes\":2"))
        j.closePoll(ana.key, false)
        val closed = j.state(beto.key, false).getJSONObject("poll")
        assertEquals(2, closed.getJSONArray("options").getJSONObject(0).getInt("votes"))
        assertEquals(0, closed.getJSONArray("options").getJSONObject(1).getInt("votes"))
    }

    @Test
    fun `contrato - una votación con tiempo cierra sola`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.createPoll(ana.key, false, "¿Seguimos?", listOf("Sí", "No"), seconds = 30)
        j.vote(ana.key, 0)
        clock += 29_999
        val open = j.state(null, false).getJSONObject("poll")
        assertTrue(open.getBoolean("open"))
        assertEquals(1, open.getLong("left_ms"))
        assertEquals(30_000, open.getLong("of_ms"))
        clock += 1
        assertEquals("closed", code { j.vote(beto.key, 1) })
        assertFalse(j.state(null, false).getJSONObject("poll").getBoolean("open"))
        // Cerrada, otra persona ya puede armar la suya.
        j.createPoll(beto.key, false, "¿Y ahora?", listOf("a", "b"))
        assertEquals("invalid", code { j.createPoll(beto.key, false, "¿?", listOf("a", "b"), seconds = Juntada.MAX_POLL_SECONDS + 1) })
    }

    @Test
    fun `contrato - el desempate elige entre las más votadas, una sola vez y con la votación cerrada`() {
        val j = juntada()
        val people = listOf("Ana", "Beto", "Caro", "Dani", "Edu").map { j.join(it) }
        j.createPoll(people[0].key, false, "¿Qué comemos?", listOf("Asado", "Pizza", "Empanadas"))
        j.vote(people[0].key, 0)
        j.vote(people[1].key, 0)
        j.vote(people[2].key, 2)
        j.vote(people[3].key, 2)
        j.vote(people[4].key, 1)
        assertEquals("closed", code { j.breakTie(people[0].key, false) })
        j.closePoll(people[0].key, false)
        val tied = j.state(null, false).getJSONObject("poll")
        assertEquals("[0,2]", tied.getJSONArray("tied").toString())
        assertTrue(tied.isNull("picked"))
        assertEquals("not_allowed", code { j.breakTie(people[1].key, false) })
        j.breakTie(people[0].key, false)
        val picked = j.state(null, false).getJSONObject("poll").getInt("picked")
        assertTrue(picked == 0 || picked == 2)
        assertEquals("invalid", code { j.breakTie(null, owner = true) })
        assertEquals(picked, j.state(null, false).getJSONObject("poll").getInt("picked"))
    }

    @Test
    fun `contrato - sin empate no hay nada que desempatar`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.createPoll(ana.key, false, "¿?", listOf("a", "b"))
        j.vote(ana.key, 1)
        j.closePoll(ana.key, false)
        assertEquals(0, j.state(null, false).getJSONObject("poll").getJSONArray("tied").length())
        assertEquals("invalid", code { j.breakTie(ana.key, false) })
    }

    @Test
    fun `contrato - una votación que cierra sin votos no tiene empate ni ganador al azar`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.createPoll(ana.key, false, "¿?", listOf("a", "b", "c"), seconds = 10)
        clock += 10_000
        val closed = j.state(null, false).getJSONObject("poll")
        assertFalse(closed.getBoolean("open"))
        assertEquals(0, closed.getJSONArray("tied").length())
        assertEquals("invalid", code { j.breakTie(ana.key, false) })
        assertTrue(j.state(null, false).getJSONObject("poll").isNull("picked"))
    }

    // --- Trivia ---

    private val four = listOf("a", "b", "c", "d")
    private fun quiz(n: Int) = Juntada.Quiz((1..n).map { Juntada.Question("Pregunta $it", four, 2, "dato $it") }, own = false)

    private fun Juntada.play(count: Int, seconds: Int = Juntada.DEFAULT_SECONDS) {
        startTrivia("tema", count, Juntada.Level.NORMAL, seconds) { _, n -> quiz(n) }
        pending.removeAt(0)()
        clock += Juntada.READY_MS
    }

    private fun Juntada.me(key: String) = state(key, false).getJSONObject("me")

    /**
     * Pasa a la pregunta siguiente. Si ya respondieron todos, la pregunta cierra sola; si no, se
     * le cumple el tiempo. Después pasa lo que dura mostrar la correcta.
     */
    private fun Juntada.next() {
        val trivia = state(null, false).getJSONObject("trivia")
        if (trivia.getString("phase") == "question") {
            clock += trivia.getLong("left_ms")
            state(null, false)
        }
        clock += Juntada.REVEAL_MS
        state(null, false)
    }

    @Test
    fun `contrato - acertar seguido suma un extra, y errar o no responder corta la racha`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.play(6)
        val full = Juntada.BASE_POINTS + Juntada.SPEED_POINTS.toInt()
        j.answer(ana.key, 0, 2)
        j.answer(beto.key, 0, 2)
        assertEquals(full, j.me(ana.key).getInt("gained"))
        assertEquals(1, j.me(ana.key).getInt("streak"))
        j.next()
        j.answer(ana.key, 1, 2)
        j.answer(beto.key, 1, 0)
        assertEquals(full + Juntada.STREAK_POINTS, j.me(ana.key).getInt("gained"))
        assertEquals(0, j.me(beto.key).getInt("streak"))
        j.next()
        j.answer(ana.key, 2, 2)
        j.answer(beto.key, 2, 2)
        assertEquals(full + 2 * Juntada.STREAK_POINTS, j.me(ana.key).getInt("gained"))
        assertEquals("la racha de Beto empieza de nuevo", full, j.me(beto.key).getInt("gained"))
        j.next()
        // Ana no llega a responder la cuarta: pierde la racha. Beto sigue la suya.
        j.answer(beto.key, 3, 2)
        j.next()
        assertEquals(0, j.me(ana.key).getInt("streak"))
        j.answer(ana.key, 4, 2)
        j.answer(beto.key, 4, 2)
        assertEquals(full, j.me(ana.key).getInt("gained"))
        assertEquals(full + 2 * Juntada.STREAK_POINTS, j.me(beto.key).getInt("gained"))
    }

    @Test
    fun `contrato - con la pregunta abierta nadie ve si acertó, los puntos aparecen cuando cierra`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.play(3)
        j.answer(ana.key, 0, 2)
        val open = j.me(ana.key)
        assertEquals("question", j.state(null, false).getJSONObject("trivia").getString("phase"))
        assertEquals(2, open.getInt("answer"))
        assertEquals(0, open.getInt("gained"))
        assertEquals(0, open.getInt("score"))
        assertEquals(0, open.getInt("streak"))
        j.answer(beto.key, 0, 0)
        val closed = j.me(ana.key)
        assertEquals("reveal", j.state(null, false).getJSONObject("trivia").getString("phase"))
        assertEquals(Juntada.BASE_POINTS + Juntada.SPEED_POINTS.toInt(), closed.getInt("gained"))
        assertEquals(closed.getInt("gained"), closed.getInt("score"))
        assertEquals(1, closed.getInt("streak"))
        assertEquals(0, j.me(beto.key).getInt("gained"))
    }

    @Test
    fun `contrato - el extra por racha tiene tope`() {
        val j = juntada()
        val ana = j.join("Ana")
        j.play(7)
        val full = Juntada.BASE_POINTS + Juntada.SPEED_POINTS.toInt()
        for (question in 0..5) {
            j.answer(ana.key, question, 2)
            val steps = minOf(question, Juntada.MAX_STREAK_STEPS)
            assertEquals("pregunta $question", full + steps * Juntada.STREAK_POINTS, j.me(ana.key).getInt("gained"))
            j.next()
        }
    }

    @Test
    fun `contrato - la última pregunta vale doble y se avisa antes de responder`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.play(3)
        assertFalse(j.state(null, false).getJSONObject("trivia").getBoolean("double"))
        j.answer(ana.key, 0, 0)
        j.answer(beto.key, 0, 0)
        j.next()
        j.answer(ana.key, 1, 0)
        j.answer(beto.key, 1, 0)
        j.next()
        assertTrue(j.state(null, false).getJSONObject("trivia").getBoolean("double"))
        j.answer(ana.key, 2, 2)
        j.answer(beto.key, 2, 0)
        assertEquals(2 * (Juntada.BASE_POINTS + Juntada.SPEED_POINTS.toInt()), j.me(ana.key).getInt("gained"))
    }

    @Test
    fun `contrato - el tiempo por pregunta se elige, y la rapidez se mide contra ese tiempo`() {
        val j = juntada()
        val ana = j.join("Ana")
        val beto = j.join("Beto")
        j.play(3, seconds = 10)
        val trivia = j.state(null, false).getJSONObject("trivia")
        assertEquals(10_000, trivia.getLong("of_ms"))
        assertEquals(10_000, trivia.getLong("left_ms"))
        clock += 5_000
        j.answer(ana.key, 0, 2)
        clock += 5_000
        assertEquals("closed", code { j.answer(beto.key, 0, 2) })
        // La rapidez es la del momento en que respondió, no la del cierre.
        assertEquals(Juntada.BASE_POINTS + Juntada.SPEED_POINTS.toInt() / 2, j.me(ana.key).getInt("gained"))
        assertEquals("invalid", code { j.startTrivia("tema", 3, Juntada.Level.NORMAL, 4) { _, n -> quiz(n) } })
        assertEquals("invalid", code { j.startTrivia("tema", 3, Juntada.Level.NORMAL, 61) { _, n -> quiz(n) } })
    }

    @Test
    fun `contrato - la dificultad llega a quien arma las preguntas`() {
        val j = juntada()
        val asked = ArrayList<Juntada.Level>()
        val source = object : TriviaSource {
            override fun make(topic: String, count: Int): Juntada.Quiz = error("sin dificultad")
            override fun make(topic: String, count: Int, level: Juntada.Level): Juntada.Quiz = quiz(count).also { asked.add(level) }
        }
        j.startTrivia("tema", 3, Juntada.Level.HARD, 20, source)
        pending.removeAt(0)()
        assertEquals(listOf(Juntada.Level.HARD), asked)
        assertEquals("hard", j.state(null, false).getJSONObject("trivia").getString("level"))
        assertTrue(TriviaMaker.ask("fútbol", 5, Juntada.Level.HARD).contains("Dificultad: difícil"))
        assertTrue(TriviaMaker.ask("fútbol", 5, Juntada.Level.EASY).contains("Dificultad: fácil"))
        // Quien arma preguntas sin saber de dificultad sigue sirviendo: se le pide la trivia de siempre.
        j.startTrivia("tema", 3, Juntada.Level.EASY, 20) { _, n -> quiz(n) }
        pending.removeAt(0)()
        assertEquals(3, j.state(null, false).getJSONObject("trivia").getInt("total"))
        assertNull(Juntada.Level.of("imposible"))
    }

    // --- El equipo ---

    @Test
    fun `contrato - reconoce las apps que reciben la pantalla del celular y no confunde las del sistema`() {
        val receivers = listOf(
            "com.hpplay.happycast" to "HappyCast", "com.ecloud.eshare.server" to "EShare", "com.waxrain.airplaydmr" to "AirPin",
            "com.mediatek.wfd" to "Wireless Display", "com.weenas.castbay" to "CastBay", "com.example.tv" to "Miracast",
            "com.softwinner.miracastReceiver" to "MiraCast", "com.example.dlna" to "Servidor DLNA", "com.example.x" to "iOS Cast"
        )
        for ((pkg, label) in receivers) assertTrue("$pkg · $label", DeviceHints.casts(pkg, label))
        val others = listOf(
            "com.google.android.gms" to "Google Play services", "com.netflix.mediaclient" to "Netflix",
            "com.android.providers.media" to "Media Storage", "ar.vale.projectorlauncher" to "galfredev OS",
            "com.google.android.youtube" to "YouTube", "com.android.settings" to "Settings"
        )
        for ((pkg, label) in others) assertFalse("$pkg · $label", DeviceHints.casts(pkg, label))
        assertTrue(DeviceHints.switchesInput("com.mediatek.tv.source", "Fuente"))
        assertTrue(DeviceHints.switchesInput("com.example.launcher.hdmi", "HDMI"))
        assertFalse(DeviceHints.switchesInput("com.netflix.mediaclient", "Netflix"))
    }
}
