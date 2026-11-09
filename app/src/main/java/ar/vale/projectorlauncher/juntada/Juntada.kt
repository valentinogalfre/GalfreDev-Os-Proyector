package ar.vale.projectorlauncher.juntada

import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Random

/** Por qué no se pudo. El código viaja al celular, que lo traduce. */
class JuntadaError(val code: String) : Exception(code)

/** De dónde salen las preguntas: Claude, o el banco propio si no hay clave o red. Bloquea. */
fun interface TriviaSource {
    fun make(topic: String, count: Int): Juntada.Quiz
}

/**
 * La juntada: varias personas en la misma sala, cada una con su celular, y la pared como tablero.
 * Tiene tres cosas: una trivia, una votación y las cuentas de la casa.
 *
 * No conoce Android ni la red, para poder probarla. El tiempo no corre con un reloj propio: el
 * estado avanza cuando alguien lo consulta, y la pared lo consulta varias veces por segundo.
 *
 * Quien entra con el código de invitado solo llega hasta acá: no maneja el proyector.
 */
class Juntada(
    stored: JSONObject? = null,
    private val now: () -> Long = System::currentTimeMillis,
    private val random: Random = SecureRandom(),
    private val runLater: (() -> Unit) -> Unit = { Thread(it, "gd-trivia").start() }
) {

    class Person(val id: String, val key: String, val name: String)
    class Question(val text: String, val options: List<String>, val correct: Int, val fact: String)

    /** [own] avisa que salieron del banco propio y no de Claude. */
    class Quiz(val questions: List<Question>, val own: Boolean)
    class Expense(val id: Int, val payer: String, val amount: Long, val what: String, val among: List<String>, val by: String)
    class Transfer(val from: String, val to: String, val amount: Long)
    private class Poll(val question: String, val options: List<String>, val by: String) {
        val votes = HashMap<String, Int>()
        var open = true
    }

    enum class Phase { IDLE, LOADING, READY, QUESTION, REVEAL, FINAL }

    /** Corre después de cada cambio, fuera del candado: guarda y avisa a la pared. */
    var onChange: () -> Unit = {}

    private val people = ArrayList<Person>()
    private val expenses = ArrayList<Expense>()
    private var nextExpense = 1
    private var poll: Poll? = null

    /** Al empezar de cero también se van los celulares invitados: eso lo lleva quien da los permisos. */
    var onReset: () -> Unit = {}

    private var phase = Phase.IDLE
    private var topic = ""
    private var quiz: Quiz? = null
    private var index = 0
    private var phaseEnds = 0L
    private var failed = false
    private var run = 0
    private val answers = HashMap<String, Int>()
    private val gained = HashMap<String, Int>()
    private val scores = HashMap<String, Int>()

    /** Quienes respondieron al menos una vez en esta trivia. Los demás están para otra cosa. */
    private val players = LinkedHashSet<String>()

    init {
        stored?.let(::restore)
    }

    // --- Quién entra ---

    fun join(rawName: String): Person {
        val person = synchronized(this) {
            val name = cleanName(rawName) ?: throw JuntadaError("name")
            if (people.any { it.name.equals(name, ignoreCase = true) }) throw JuntadaError("name_taken")
            if (people.size >= MAX_PEOPLE) throw JuntadaError("full")
            Person(newSecret(ID_BYTES), newSecret(KEY_BYTES), name).also(people::add)
        }
        onChange()
        return person
    }

    private fun personOf(key: String?): Person? {
        if (key.isNullOrEmpty()) return null
        val given = key.toByteArray(Charsets.UTF_8)
        return people.firstOrNull { MessageDigest.isEqual(given, it.key.toByteArray(Charsets.UTF_8)) }
    }

    private fun need(key: String?): Person = personOf(key) ?: throw JuntadaError("join")

    /** Empieza de cero: se van todos, y los invitados tienen que volver a pedir permiso. */
    fun reset() {
        synchronized(this) {
            people.clear()
            expenses.clear()
            nextExpense = 1
            poll = null
            stopLocked()
        }
        onReset()
        onChange()
    }

    // --- Trivia ---

    fun startTrivia(rawTopic: String, count: Int, source: TriviaSource) {
        val mine = synchronized(this) {
            if (phase == Phase.LOADING) throw JuntadaError("busy")
            if (count !in MIN_QUESTIONS..MAX_QUESTIONS) throw JuntadaError("invalid")
            topic = clean(rawTopic, MAX_TOPIC).ifEmpty { throw JuntadaError("invalid") }
            stopLocked()
            phase = Phase.LOADING
            run
        }
        onChange()
        runLater {
            val made = runCatching { source.make(topic, count) }.getOrNull()
            synchronized(this) {
                // Si mientras tanto la frenaron o armaron otra, lo que llega ya no va.
                if (run != mine || phase != Phase.LOADING) return@runLater
                val usable = made?.takeIf { q -> q.questions.isNotEmpty() && q.questions.all(::valid) }
                if (usable == null) {
                    phase = Phase.IDLE
                    failed = true
                } else {
                    quiz = usable
                    index = 0
                    phase = Phase.READY
                    phaseEnds = now() + READY_MS
                }
            }
            onChange()
        }
    }

    private fun valid(q: Question) =
        q.text.isNotBlank() && q.options.size == OPTIONS && q.options.all { it.isNotBlank() } && q.correct in 0 until OPTIONS

    fun stopTrivia() {
        synchronized(this) { stopLocked() }
        onChange()
    }

    private fun stopLocked() {
        run++
        phase = Phase.IDLE
        quiz = null
        failed = false
        index = 0
        answers.clear()
        gained.clear()
        scores.clear()
        players.clear()
    }

    /** Cuenta la primera respuesta de cada uno. Acertar rápido vale más. */
    fun answer(key: String?, question: Int, option: Int) {
        synchronized(this) {
            val person = need(key)
            advance()
            if (phase != Phase.QUESTION || question != index) throw JuntadaError("closed")
            if (option !in 0 until OPTIONS) throw JuntadaError("invalid")
            if (answers.containsKey(person.id)) throw JuntadaError("closed")
            answers[person.id] = option
            players.add(person.id)
            scores.getOrPut(person.id) { 0 }
            if (option == quiz!!.questions[index].correct) {
                val left = (phaseEnds - now()).coerceIn(0, QUESTION_MS)
                val points = BASE_POINTS + (SPEED_POINTS * left / QUESTION_MS).toInt()
                gained[person.id] = points
                scores[person.id] = (scores[person.id] ?: 0) + points
            }
            advance()
        }
        onChange()
    }

    /** Devuelve true si cambió de etapa. */
    private fun advance(): Boolean {
        var moved = false
        while (true) {
            val due = now() >= phaseEnds
            when (phase) {
                Phase.READY -> if (due) ask() else return moved
                Phase.QUESTION -> {
                    // En la primera se espera a toda la sala. Después, solo a quienes ya están
                    // jugando: alguien que entró a anotar un gasto no le frena la trivia al resto.
                    val expected = if (index == 0) people.map { it.id } else players
                    val everyone = expected.isNotEmpty() && expected.all { answers.containsKey(it) }
                    if (!due && !everyone) return moved
                    phase = Phase.REVEAL
                    phaseEnds = now() + REVEAL_MS
                }
                Phase.REVEAL -> {
                    if (!due) return moved
                    index++
                    if (index >= quiz!!.questions.size) {
                        index = quiz!!.questions.size - 1
                        phase = Phase.FINAL
                    } else {
                        ask()
                    }
                }
                else -> return moved
            }
            moved = true
        }
    }

    private fun ask() {
        phase = Phase.QUESTION
        phaseEnds = now() + QUESTION_MS
        answers.clear()
        gained.clear()
    }

    // --- Votación ---

    fun createPoll(key: String?, owner: Boolean, rawQuestion: String, rawOptions: List<String>) {
        synchronized(this) {
            val person = need(key)
            val current = poll
            if (current != null && current.open && current.by != person.id && !owner) throw JuntadaError("poll_open")
            val question = clean(rawQuestion, MAX_QUESTION).ifEmpty { throw JuntadaError("invalid") }
            val options = rawOptions.map { clean(it, MAX_OPTION) }.filter { it.isNotEmpty() }.distinct()
            if (options.size !in MIN_POLL_OPTIONS..MAX_POLL_OPTIONS) throw JuntadaError("options")
            poll = Poll(question, options, person.id)
        }
        onChange()
    }

    /** Se puede cambiar de idea mientras esté abierta. */
    fun vote(key: String?, option: Int) {
        synchronized(this) {
            val person = need(key)
            val current = poll?.takeIf { it.open } ?: throw JuntadaError("closed")
            if (option !in current.options.indices) throw JuntadaError("invalid")
            current.votes[person.id] = option
        }
        onChange()
    }

    fun closePoll(key: String?, owner: Boolean) {
        synchronized(this) {
            val current = poll ?: throw JuntadaError("closed")
            if (!owner && current.by != need(key).id) throw JuntadaError("not_allowed")
            current.open = false
        }
        onChange()
    }

    // --- Cuentas ---

    fun addExpense(key: String?, payer: String, amount: Long, rawWhat: String, among: List<String>) {
        synchronized(this) {
            val person = need(key)
            val ids = people.map { it.id }.toSet()
            val split = among.distinct()
            if (payer !in ids || split.isEmpty() || !ids.containsAll(split)) throw JuntadaError("invalid")
            if (amount !in 1..MAX_AMOUNT) throw JuntadaError("amount")
            if (expenses.size >= MAX_EXPENSES) throw JuntadaError("full")
            val what = clean(rawWhat, MAX_WHAT).ifEmpty { throw JuntadaError("invalid") }
            expenses.add(Expense(nextExpense++, payer, amount, what, split, person.id))
        }
        onChange()
    }

    /** Lo borra quien lo anotó, quien pagó, o el dueño del proyector. */
    fun deleteExpense(key: String?, owner: Boolean, id: Int) {
        synchronized(this) {
            val expense = expenses.firstOrNull { it.id == id } ?: throw JuntadaError("invalid")
            val person = personOf(key)
            val mine = person != null && (expense.by == person.id || expense.payer == person.id)
            if (!owner && !mine) throw JuntadaError("not_allowed")
            expenses.remove(expense)
        }
        onChange()
    }

    // --- Lo que se ve ---

    /**
     * El estado entero, para la pared y para cada celular. La respuesta correcta no sale hasta
     * que la pregunta cierra: quien mire el tráfico de su celular no la encuentra antes.
     */
    fun state(key: String?, owner: Boolean): JSONObject {
        val moved: Boolean
        val out: JSONObject
        synchronized(this) {
            moved = advance()
            val me = personOf(key)
            out = JSONObject()
                .put("owner", owner)
                .put("people", JSONArray(people.map { JSONObject().put("id", it.id).put("name", it.name) }))
                .put("trivia", triviaJson())
                .put("poll", pollJson(me) ?: JSONObject.NULL)
                .put("expenses", JSONArray(expenses.map(::expenseJson)))
                .put("total", expenses.sumOf { it.amount })
            val balance = Accounts.balance(people.map { it.id }, expenses)
            out.put("balance", JSONArray(people.map { JSONObject().put("id", it.id).put("amount", balance[it.id] ?: 0L) }))
            out.put("transfers", JSONArray(Accounts.settle(balance).map {
                JSONObject().put("from", it.from).put("to", it.to).put("amount", it.amount)
            }))
            if (me != null) {
                out.put(
                    "me",
                    JSONObject()
                        .put("id", me.id)
                        .put("name", me.name)
                        .put("answer", answers[me.id] ?: JSONObject.NULL)
                        .put("gained", gained[me.id] ?: 0)
                        .put("score", scores[me.id] ?: 0)
                )
            }
        }
        if (moved) onChange()
        return out
    }

    private fun triviaJson(): JSONObject {
        val out = JSONObject().put("phase", phase.name.lowercase()).put("topic", topic).put("failed", failed)
        val current = quiz ?: return out
        out.put("total", current.questions.size).put("index", index).put("own", current.own)
        out.put("left_ms", (phaseEnds - now()).coerceAtLeast(0)).put("answered", answers.size)
        if (phase == Phase.QUESTION || phase == Phase.REVEAL) {
            val q = current.questions[index]
            out.put("question", q.text).put("options", JSONArray(q.options)).put("of_ms", QUESTION_MS)
            if (phase == Phase.REVEAL) {
                out.put("correct", q.correct).put("fact", q.fact)
                out.put("picks", JSONArray((0 until OPTIONS).map { option -> answers.values.count { it == option } }))
            }
        }
        if (phase == Phase.REVEAL || phase == Phase.FINAL) {
            val ranking = people.filter { scores.containsKey(it.id) }.sortedByDescending { scores[it.id] }
            out.put("ranking", JSONArray(ranking.map { JSONObject().put("name", it.name).put("score", scores[it.id]) }))
        }
        return out
    }

    private fun pollJson(me: Person?): JSONObject? {
        val current = poll ?: return null
        val counts = current.options.indices.map { option -> current.votes.values.count { it == option } }
        return JSONObject()
            .put("question", current.question)
            .put("options", JSONArray(current.options.mapIndexed { i, text -> JSONObject().put("text", text).put("votes", counts[i]) }))
            .put("open", current.open)
            .put("total", current.votes.size)
            .put("by", current.by)
            .put("mine", me?.let { current.votes[it.id] } ?: JSONObject.NULL)
    }

    private fun expenseJson(e: Expense) = JSONObject()
        .put("id", e.id).put("payer", e.payer).put("amount", e.amount)
        .put("what", e.what).put("among", JSONArray(e.among)).put("by", e.by)

    // --- Lo que se guarda: la gente y las cuentas. Una trivia o una votación a medias no sobreviven a un apagón. ---

    fun export(): JSONObject = synchronized(this) {
        JSONObject()
            .put("next", nextExpense)
            .put("people", JSONArray(people.map { JSONObject().put("id", it.id).put("key", it.key).put("name", it.name) }))
            .put("expenses", JSONArray(expenses.map(::expenseJson)))
    }

    private fun restore(json: JSONObject) {
        val savedPeople = json.optJSONArray("people") ?: JSONArray()
        for (i in 0 until savedPeople.length()) {
            val p = savedPeople.optJSONObject(i) ?: continue
            val name = cleanName(p.optString("name")) ?: continue
            if (p.optString("id").isEmpty() || p.optString("key").isEmpty()) continue
            people.add(Person(p.getString("id"), p.getString("key"), name))
        }
        val ids = people.map { it.id }.toSet()
        val saved = json.optJSONArray("expenses") ?: JSONArray()
        for (i in 0 until saved.length()) {
            val e = saved.optJSONObject(i) ?: continue
            val among = e.optJSONArray("among")?.let { a -> (0 until a.length()).map { a.optString(it) } }.orEmpty()
            val ok = e.optString("payer") in ids && among.isNotEmpty() && ids.containsAll(among) && e.optLong("amount") in 1..MAX_AMOUNT
            if (ok) expenses.add(Expense(e.optInt("id"), e.getString("payer"), e.getLong("amount"), e.optString("what"), among, e.optString("by")))
        }
        nextExpense = maxOf(json.optInt("next", 1), (expenses.maxOfOrNull { it.id } ?: 0) + 1)
    }

    private fun newSecret(bytes: Int): String =
        ByteArray(bytes).also(random::nextBytes).joinToString("") { "%02x".format(it) }

    companion object {
        const val OPTIONS = 4
        const val MIN_QUESTIONS = 3
        const val MAX_QUESTIONS = 15
        const val QUESTION_MS = 20_000L
        const val REVEAL_MS = 7_000L
        const val READY_MS = 5_000L
        const val BASE_POINTS = 500
        const val SPEED_POINTS = 500L
        const val MAX_PEOPLE = 40
        const val MAX_NAME = 18
        const val MAX_AMOUNT = 100_000_000L
        const val MIN_POLL_OPTIONS = 2
        const val MAX_POLL_OPTIONS = 6
        private const val MAX_EXPENSES = 300
        private const val MAX_TOPIC = 80
        private const val MAX_QUESTION = 120
        private const val MAX_OPTION = 60
        private const val MAX_WHAT = 40
        private const val KEY_BYTES = 16
        private const val ID_BYTES = 4
        private val SPACES = Regex("\\s+")

        /** Sin caracteres de control y sin espacios de más. Lo escribe gente desde su celular. */
        fun clean(text: String, max: Int): String =
            text.filter { !it.isISOControl() || it == ' ' }.replace(SPACES, " ").trim().take(max).trim()

        fun cleanName(text: String): String? = clean(text, MAX_NAME).takeIf { it.isNotEmpty() }
    }
}

/** Las cuentas de la casa: cuánto puso cada uno, cuánto le tocaba, y quién le paga a quién. */
object Accounts {

    /**
     * Saldo de cada persona en pesos enteros: positivo si le deben, negativo si debe. Siempre suma
     * cero: lo que no se puede repartir en partes iguales se lo llevan, de a un peso, los primeros.
     */
    fun balance(people: List<String>, expenses: List<Juntada.Expense>): Map<String, Long> {
        val out = LinkedHashMap<String, Long>()
        people.forEach { out[it] = 0L }
        for (e in expenses) {
            out[e.payer] = (out[e.payer] ?: 0L) + e.amount
            val share = e.amount / e.among.size
            var extra = e.amount % e.among.size
            for (id in e.among) {
                val part = share + if (extra > 0) 1 else 0
                if (extra > 0) extra--
                out[id] = (out[id] ?: 0L) - part
            }
        }
        return out
    }

    /** Los pagos para quedar a mano: el que más debe le paga al que más le deben, hasta saldar. */
    fun settle(balance: Map<String, Long>): List<Juntada.Transfer> {
        val owed = balance.filterValues { it > 0 }.toMutableMap()
        val owes = balance.filterValues { it < 0 }.mapValues { -it.value }.toMutableMap()
        val out = ArrayList<Juntada.Transfer>()
        while (owed.isNotEmpty() && owes.isNotEmpty()) {
            val to = owed.maxByOrNull { it.value }!!
            val from = owes.maxByOrNull { it.value }!!
            val amount = minOf(to.value, from.value)
            out.add(Juntada.Transfer(from.key, to.key, amount))
            if (to.value == amount) owed.remove(to.key) else owed[to.key] = to.value - amount
            if (from.value == amount) owes.remove(from.key) else owes[from.key] = from.value - amount
        }
        return out
    }
}
