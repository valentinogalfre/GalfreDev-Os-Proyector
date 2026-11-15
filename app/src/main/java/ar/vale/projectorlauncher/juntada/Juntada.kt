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

    /** Con dificultad. Quien no la sabe usar arma la trivia de siempre. */
    fun make(topic: String, count: Int, level: Juntada.Level): Juntada.Quiz = make(topic, count)
}

/**
 * La juntada: varias personas en la misma sala, cada una con su celular, y la pared como tablero.
 * Tiene cuatro cosas: una trivia, una votación, las cuentas de la casa y la fila de presentaciones
 * ([Demos]).
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

    /** [pass] es el pase del celular con el que entró, si es de un invitado. */
    class Person(val id: String, val key: String, val name: String, val pass: Int? = null)
    class Question(val text: String, val options: List<String>, val correct: Int, val fact: String)

    /** [own] avisa que salieron del banco propio y no de Claude. */
    class Quiz(val questions: List<Question>, val own: Boolean)
    class Expense(val id: Int, val payer: String, val amount: Long, val what: String, val among: List<String>, val by: String)
    class Transfer(val from: String, val to: String, val amount: Long)
    /**
     * [secret]: mientras está abierta se ve cuántos votaron y no a qué, para que nadie vote por
     * arrastre. [closesAt]: cuándo cierra sola; cero es cuando la cierre alguien.
     */
    private class Poll(val question: String, val options: List<String>, val by: String, val secret: Boolean, val ofMs: Long, val closesAt: Long) {
        val votes = HashMap<String, Int>()
        var open = true

        /** La opción que eligió el azar para desempatar. */
        var picked: Int? = null

        fun counts(): List<Int> = options.indices.map { option -> votes.values.count { it == option } }

        /** Las opciones más votadas. Con una sola no hay empate, y sin ningún voto no hay ninguna. */
        fun top(): List<Int> {
            val counts = counts()
            val best = counts.maxOrNull() ?: 0
            if (best == 0) return emptyList()
            return counts.indices.filter { counts[it] == best }
        }
    }

    enum class Phase { IDLE, LOADING, READY, QUESTION, REVEAL, FINAL }

    enum class Level(val wire: String) {
        EASY("easy"), NORMAL("normal"), HARD("hard");

        companion object {
            fun of(wire: String?): Level? = values().firstOrNull { it.wire == wire }
        }
    }

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
    private var level = Level.NORMAL
    private var questionMs = QUESTION_MS
    private val answers = HashMap<String, Int>()
    private val gained = HashMap<String, Int>()
    private val scores = HashMap<String, Int>()

    /** Aciertos seguidos de cada uno. Errar o no llegar a responder la corta. */
    private val streaks = HashMap<String, Int>()

    /** Cuánto le quedaba a la pregunta cuando respondió cada uno: de ahí sale el extra por rapidez. */
    private val lefts = HashMap<String, Long>()

    /** Quienes respondieron al menos una vez en esta trivia. Los demás están para otra cosa. */
    private val players = LinkedHashSet<String>()

    private val demos = Demos(now)

    /** La pared, para la fila de presentaciones. Sin pared (en las pruebas) la fila funciona igual. */
    var stage: Stage? = null

    /** Presentaciones que ya no están en la fila: quien guarda sus archivos los borra. */
    var onDemosGone: (List<Int>) -> Unit = {}

    init {
        stored?.let(::restore)
    }

    // --- Quién entra ---

    /**
     * [pass] es el pase del celular que entra, si es de un invitado. Con un pase entra una sola
     * persona: quien ya entró vuelve a ser quien era. Así nadie suma nombres para votar o
     * aplaudirse de más, y quien perdió la sesión la recupera.
     */
    fun join(rawName: String, pass: Int? = null): Person {
        var added = false
        val person = synchronized(this) {
            pass?.let { own -> people.firstOrNull { it.pass == own } } ?: run {
                val name = cleanName(rawName) ?: throw JuntadaError("name")
                if (people.any { it.name.equals(name, ignoreCase = true) }) throw JuntadaError("name_taken")
                if (people.size >= MAX_PEOPLE) throw JuntadaError("full")
                added = true
                Person(newSecret(ID_BYTES), newSecret(KEY_BYTES), name, pass).also(people::add)
            }
        }
        if (added) onChange()
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
        val live: Int?
        val gone: List<Int>
        synchronized(this) {
            people.clear()
            expenses.clear()
            nextExpense = 1
            poll = null
            stopLocked()
            live = demos.live?.id
            gone = demos.clear()
        }
        live?.let { stage?.close(it) }
        if (gone.isNotEmpty()) onDemosGone(gone)
        onReset()
        onChange()
    }

    // --- Trivia ---

    fun startTrivia(rawTopic: String, count: Int, source: TriviaSource) =
        startTrivia(rawTopic, count, Level.NORMAL, DEFAULT_SECONDS, source)

    /** [seconds] es el tiempo para responder cada pregunta. */
    fun startTrivia(rawTopic: String, count: Int, wanted: Level, seconds: Int, source: TriviaSource) {
        val mine = synchronized(this) {
            if (phase == Phase.LOADING) throw JuntadaError("busy")
            if (count !in MIN_QUESTIONS..MAX_QUESTIONS) throw JuntadaError("invalid")
            if (seconds !in MIN_SECONDS..MAX_SECONDS) throw JuntadaError("invalid")
            topic = clean(rawTopic, MAX_TOPIC).ifEmpty { throw JuntadaError("invalid") }
            stopLocked()
            level = wanted
            questionMs = seconds * 1000L
            phase = Phase.LOADING
            run
        }
        onChange()
        runLater {
            val made = runCatching { source.make(topic, count, wanted) }.getOrNull()
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
        streaks.clear()
        lefts.clear()
        players.clear()
    }

    /**
     * Cuenta la primera respuesta de cada uno. Acertar rápido vale más, acertar varias seguidas
     * suma un extra, y la última pregunta vale doble: nadie queda afuera hasta el final. Los
     * puntos se cuentan recién cuando la pregunta cierra ([score]).
     */
    fun answer(key: String?, question: Int, option: Int) {
        synchronized(this) {
            val person = need(key)
            advance()
            if (phase != Phase.QUESTION || question != index) throw JuntadaError("closed")
            if (option !in 0 until OPTIONS) throw JuntadaError("invalid")
            if (answers.containsKey(person.id)) throw JuntadaError("closed")
            answers[person.id] = option
            lefts[person.id] = (phaseEnds - now()).coerceIn(0, questionMs)
            players.add(person.id)
            scores.getOrPut(person.id) { 0 }
            advance()
        }
        onChange()
    }

    private fun isLast(): Boolean = quiz?.let { index == it.questions.lastIndex } ?: false

    /** Devuelve true si cambió de etapa. */
    private fun advance(): Boolean {
        var moved = false
        poll?.let {
            if (it.open && it.closesAt > 0 && now() >= it.closesAt) {
                it.open = false
                moved = true
            }
        }
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
                    score()
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
        phaseEnds = now() + questionMs
        answers.clear()
        lefts.clear()
        gained.clear()
    }

    /**
     * Los puntos de la pregunta que cierra. Se cuentan acá y no al responder: mientras la pregunta
     * está abierta nadie ve moverse sus puntos, así que nadie sabe si acertó ni puede cantarlo.
     */
    private fun score() {
        val correct = quiz!!.questions[index].correct
        answers.forEach { (id, option) ->
            if (option != correct) {
                streaks[id] = 0
                return@forEach
            }
            val streak = (streaks[id] ?: 0) + 1
            streaks[id] = streak
            val bonus = STREAK_POINTS * minOf(streak - 1, MAX_STREAK_STEPS)
            val points = (BASE_POINTS + (SPEED_POINTS * (lefts[id] ?: 0L) / questionMs).toInt() + bonus) * if (isLast()) 2 else 1
            gained[id] = points
            scores[id] = (scores[id] ?: 0) + points
        }
        // Quien no llegó a responder corta su racha, igual que quien erró.
        players.filter { !answers.containsKey(it) }.forEach { streaks[it] = 0 }
    }

    // --- Votación ---

    /** [seconds] es en cuánto cierra sola; cero, cuando la cierre quien la armó. */
    fun createPoll(key: String?, owner: Boolean, rawQuestion: String, rawOptions: List<String>, secret: Boolean = false, seconds: Int = 0) {
        synchronized(this) {
            val person = need(key)
            advance()
            val current = poll
            if (current != null && current.open && current.by != person.id && !owner) throw JuntadaError("poll_open")
            val question = clean(rawQuestion, MAX_QUESTION).ifEmpty { throw JuntadaError("invalid") }
            val options = rawOptions.map { clean(it, MAX_OPTION) }.filter { it.isNotEmpty() }.distinct()
            if (options.size !in MIN_POLL_OPTIONS..MAX_POLL_OPTIONS) throw JuntadaError("options")
            if (seconds !in 0..MAX_POLL_SECONDS) throw JuntadaError("invalid")
            val ofMs = seconds * 1000L
            poll = Poll(question, options, person.id, secret, ofMs, if (seconds == 0) 0 else now() + ofMs)
        }
        onChange()
    }

    /** Se puede cambiar de idea mientras esté abierta. */
    fun vote(key: String?, option: Int) {
        synchronized(this) {
            val person = need(key)
            advance()
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

    /** Una votación cerrada con empate la define el azar, a pedido de quien la armó o del dueño. */
    fun breakTie(key: String?, owner: Boolean) {
        synchronized(this) {
            advance()
            val current = poll?.takeIf { !it.open } ?: throw JuntadaError("closed")
            if (!owner && current.by != need(key).id) throw JuntadaError("not_allowed")
            val tied = current.top()
            if (tied.size < 2 || current.picked != null) throw JuntadaError("invalid")
            current.picked = tied[random.nextInt(tied.size)]
        }
        onChange()
    }

    // --- Presentaciones ---

    /** True mientras hay alguien en escena: el control prestado a los invitados queda guardado. */
    val staged: Boolean get() = synchronized(this) { demos.live != null }

    fun signUpDemo(key: String?, owner: Boolean, title: String, kind: String): Int {
        val id = synchronized(this) {
            demos.signUp(need(key), owner, title, Demos.Kind.of(kind) ?: throw JuntadaError("invalid")).id
        }
        onChange()
        return id
    }

    fun withdrawDemo(key: String?, owner: Boolean, id: Int) {
        synchronized(this) { demos.withdraw(personOf(key), owner, id) }
        onDemosGone(listOf(id))
        onChange()
    }

    /** Antes de recibir el archivo: si no le corresponde, no se gasta el disco ni la red. */
    fun checkDemoUpload(key: String?, owner: Boolean, id: Int) {
        synchronized(this) { demos.uploadable(if (owner) personOf(key) else need(key), owner, id) }
    }

    /**
     * El archivo ya llegó entero. [commit] lo pone en el lugar del anterior, y corre con la fila
     * quieta y después de mirar que todavía corresponde: si mientras entraba le dieron el turno,
     * la pared sigue con el archivo que estaba mostrando.
     */
    fun attachDemo(key: String?, owner: Boolean, id: Int, file: String, media: Demos.Media, size: Long, commit: () -> Unit = {}) {
        synchronized(this) {
            val person = personOf(key)
            demos.uploadable(person, owner, id)
            commit()
            demos.attach(person, owner, id, file, media, size)
        }
        onChange()
    }

    /** El archivo de esa presentación está entrando, o (con null) ya no entra ninguno. */
    fun demoReceiving(id: Int?) {
        synchronized(this) { demos.receiving = id }
        onChange()
    }

    /** Al arrancar: las presentaciones cuyo archivo ya no está en el disco quedan sin archivo. */
    fun dropMissingDemoFiles(exists: (Int, String) -> Boolean) {
        synchronized(this) {
            demos.files().filter { (id, file) -> !exists(id, file) }.forEach { (id, _) -> demos.detach(id) }
        }
    }

    /** Los archivos que la fila todavía necesita: lo demás que haya en el disco sobra. */
    fun demoIds(): List<Int> = synchronized(this) { demos.ids }

    /** La pone en escena el dueño. Si la pared no la puede abrir, no empieza. */
    fun startDemo(id: Int?) {
        val shown = synchronized(this) {
            demos.start(id).let { Demos.Shown(it.id, it.name, it.title, it.file, it.media) }
        }
        if (stage?.open(shown) == false) {
            synchronized(this) { demos.unstart(shown.id) }
            onChange()
            throw JuntadaError("stage_fail")
        }
        onChange()
    }

    fun finishDemo(key: String?, owner: Boolean) {
        val id = synchronized(this) { demos.finish(personOf(key), owner).id }
        stage?.close(id)
        onChange()
    }

    /** La pared cerró lo que se estaba mostrando, con Atrás o Inicio: el turno termina ahí. */
    fun demoLeft(id: Int) {
        val ended = synchronized(this) {
            if (demos.live?.id != id) return@synchronized false
            demos.finish(null, owner = true)
            true
        }
        if (ended) onChange()
    }

    fun requeueDemo(id: Int) {
        synchronized(this) { demos.requeue(id) }
        onChange()
    }

    fun moveDemo(id: Int, up: Boolean) {
        synchronized(this) { demos.move(id, up) }
        onChange()
    }

    fun demoLimit(minutes: Int) {
        synchronized(this) { demos.setLimit(minutes) }
        onChange()
    }

    fun demoOpen(open: Boolean) {
        synchronized(this) { demos.setOpen(open) }
        onChange()
    }

    fun clapDemo(key: String?, id: Int, count: Int) {
        synchronized(this) { demos.clap(need(key), id, count) }
        onChange()
    }

    fun rateDemo(key: String?, id: Int, stars: Int) {
        synchronized(this) { demos.rate(need(key), id, stars) }
        onChange()
    }

    /** Una tecla del control de quien presenta. False si la pared está en otra cosa. */
    fun demoKey(key: String?, owner: Boolean, name: String): Boolean {
        if (name !in Demos.KEYS) throw JuntadaError("invalid")
        val id = synchronized(this) { demos.controlled(personOf(key), owner).id }
        return stage?.key(id, name) ?: false
    }

    /**
     * Quien muestra su propia pantalla le pide a la pared que la reciba, sin cable o por HDMI.
     * False si este equipo no tiene esa entrada.
     */
    fun demoSource(key: String?, owner: Boolean, name: String): Boolean {
        if (name !in Demos.SOURCES) throw JuntadaError("invalid")
        val id = synchronized(this) {
            val entry = demos.controlled(personOf(key), owner)
            if (entry.kind != Demos.Kind.SCREEN) throw JuntadaError("invalid")
            entry.id
        }
        return stage?.source(id, name) ?: false
    }

    fun demoPointer(key: String?, owner: Boolean, x: Float, y: Float, visible: Boolean) {
        val id = synchronized(this) { demos.controlled(personOf(key), owner).id }
        stage?.pointer(id, x, y, visible)
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
        val late: String?
        val out: JSONObject
        val ownScreen: Boolean
        synchronized(this) {
            moved = advance()
            late = demos.timeUp()
            val me = personOf(key)
            ownScreen = demos.live?.let { it.kind == Demos.Kind.SCREEN && demos.mine(it, me, owner) } == true
            out = JSONObject()
                .put("owner", owner)
                .put("people", JSONArray(people.map { JSONObject().put("id", it.id).put("name", it.name) }))
                .put("trivia", triviaJson())
                .put("poll", pollJson(me) ?: JSONObject.NULL)
                .put("expenses", JSONArray(expenses.map(::expenseJson)))
                .put("total", expenses.sumOf { it.amount })
                .put("demos", demos.json(me, owner))
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
                        .put("streak", streaks[me.id] ?: 0)
                )
            }
        }
        // Quien muestra su pantalla ve por dónde puede entrar en este equipo. Se le pregunta a la
        // pared fuera del candado, como todo lo que se le pide.
        if (ownScreen) out.getJSONObject("demos").optJSONObject("live")?.put("sources", JSONArray(stage?.sources().orEmpty()))
        late?.let { stage?.timeUp(it) }
        if (moved) onChange()
        return out
    }

    private fun triviaJson(): JSONObject {
        val out = JSONObject().put("phase", phase.name.lowercase()).put("topic", topic).put("failed", failed)
        val current = quiz ?: return out
        out.put("total", current.questions.size).put("index", index).put("own", current.own).put("level", level.wire)
        out.put("left_ms", (phaseEnds - now()).coerceAtLeast(0)).put("answered", answers.size)
        if (phase == Phase.QUESTION || phase == Phase.REVEAL) {
            val q = current.questions[index]
            out.put("question", q.text).put("options", JSONArray(q.options)).put("of_ms", questionMs).put("double", isLast())
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

    /**
     * Con voto secreto, mientras está abierta no sale cuántos votos tiene cada opción: quien mire
     * el tráfico de su celular tampoco los encuentra.
     */
    private fun pollJson(me: Person?): JSONObject? {
        val current = poll ?: return null
        val hidden = current.secret && current.open
        val counts = current.counts()
        val tied = if (current.open) emptyList() else current.top().takeIf { it.size > 1 }.orEmpty()
        return JSONObject()
            .put("question", current.question)
            .put("options", JSONArray(current.options.mapIndexed { i, text ->
                JSONObject().put("text", text).put("votes", if (hidden) JSONObject.NULL else counts[i])
            }))
            .put("open", current.open)
            .put("secret", current.secret)
            .put("total", current.votes.size)
            .put("by", current.by)
            .put("mine", me?.let { current.votes[it.id] } ?: JSONObject.NULL)
            .put("of_ms", current.ofMs)
            .put("left_ms", if (current.open && current.closesAt > 0) (current.closesAt - now()).coerceAtLeast(0) else 0L)
            .put("tied", JSONArray(tied))
            .put("picked", current.picked ?: JSONObject.NULL)
    }

    private fun expenseJson(e: Expense) = JSONObject()
        .put("id", e.id).put("payer", e.payer).put("amount", e.amount)
        .put("what", e.what).put("among", JSONArray(e.among)).put("by", e.by)

    // --- Lo que se guarda: la gente, las cuentas y la fila de presentaciones. Una trivia o una votación a medias no sobreviven a un apagón. ---

    fun export(): JSONObject = synchronized(this) {
        JSONObject()
            .put("next", nextExpense)
            .put("people", JSONArray(people.map {
                JSONObject().put("id", it.id).put("key", it.key).put("name", it.name).put("pass", it.pass ?: JSONObject.NULL)
            }))
            .put("expenses", JSONArray(expenses.map(::expenseJson)))
            .put("demos", demos.export())
    }

    private fun restore(json: JSONObject) {
        val savedPeople = json.optJSONArray("people") ?: JSONArray()
        for (i in 0 until savedPeople.length()) {
            val p = savedPeople.optJSONObject(i) ?: continue
            val name = cleanName(p.optString("name")) ?: continue
            if (p.optString("id").isEmpty() || p.optString("key").isEmpty()) continue
            people.add(Person(p.getString("id"), p.getString("key"), name, if (p.isNull("pass")) null else p.getInt("pass")))
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
        json.optJSONObject("demos")?.let { demos.restore(it, people.associate { p -> p.id to p.name }) }
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
        const val DEFAULT_SECONDS = 20
        const val MIN_SECONDS = 5
        const val MAX_SECONDS = 60
        const val BASE_POINTS = 500
        const val SPEED_POINTS = 500L

        /** Cada acierto seguido suma esto, hasta [MAX_STREAK_STEPS] veces. */
        const val STREAK_POINTS = 100
        const val MAX_STREAK_STEPS = 3
        const val MAX_POLL_SECONDS = 600
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
