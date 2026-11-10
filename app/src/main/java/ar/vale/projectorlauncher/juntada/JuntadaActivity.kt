package ar.vale.projectorlauncher.juntada

import android.content.Context
import android.content.Intent
import android.graphics.RectF
import android.os.Bundle
import android.util.TypedValue
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.remote.AccessPrompt
import ar.vale.projectorlauncher.remote.QrView
import ar.vale.projectorlauncher.remote.RemoteService
import ar.vale.projectorlauncher.remote.RemoteState
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Keyboard
import ar.vale.projectorlauncher.ui.LineProgress
import ar.vale.projectorlauncher.ui.Motion
import ar.vale.projectorlauncher.ui.Sheet
import ar.vale.projectorlauncher.ui.SweepLine
import org.json.JSONArray
import org.json.JSONObject
import java.text.NumberFormat
import java.util.Locale

/**
 * Juntada: la pared como tablero y cada celular como control. A la izquierda, el código para
 * sumarse; a la derecha, lo que esté pasando: una trivia, una votación o las cuentas de la casa.
 *
 * El código sirve para pedir permiso: cada invitado entra recién cuando lo dejan pasar, desde
 * acá con el control o desde el celular del dueño.
 */
class JuntadaActivity : GdActivity(), JuntadaHub.Watcher {

    private enum class Tab { TRIVIA, POLL, ACCOUNTS }

    private lateinit var juntada: Juntada
    private lateinit var qr: QrView
    private lateinit var lead: TextView
    private lateinit var names: TextView
    private lateinit var label: TextView
    private lateinit var title: TextView
    private lateinit var time: LineProgress
    private lateinit var sweep: SweepLine
    private lateinit var lines: LinearLayout
    private lateinit var note: TextView
    private lateinit var actions: LinearLayout

    private var tab = Tab.TRIVIA
    private var shown: String? = null
    private var shownActions: String? = null
    private var shownLink: String? = null
    private var lastPhase = "idle"
    private var lastPoll: String? = null
    private var lastExpenses = -1
    private var marked: TextView? = null
    private val prompt by lazy { AccessPrompt(this) }

    /**
     * En esta pantalla se contesta quién entra, se arma la trivia (que usa la clave del dueño) y se
     * borra todo. Un invitado con el control prestado juega desde su celular: acá no aprieta nada,
     * o podría dejar pasar a otro por su cuenta.
     */
    override val ownerOnly: Boolean get() = true

    private val money = NumberFormat.getIntegerInstance(Locale.forLanguageTag("es-AR"))

    /** El tiempo de la trivia avanza cuando alguien mira: la pared mira varias veces por segundo. */
    private val tick = object : Runnable {
        override fun run() {
            render()
            lines.postDelayed(this, TICK_MS)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_juntada)
        setHead(getString(R.string.word_juntada))
        juntada = JuntadaHub.get(this)
        qr = findViewById(R.id.juntada_qr)
        lead = findViewById(R.id.juntada_lead)
        names = findViewById(R.id.juntada_names)
        label = findViewById(R.id.juntada_label)
        title = findViewById(R.id.juntada_title)
        time = findViewById(R.id.juntada_time)
        time.useTheme()
        sweep = findViewById(R.id.juntada_sweep)
        lines = findViewById(R.id.juntada_lines)
        note = findViewById(R.id.juntada_note)
        actions = findViewById(R.id.juntada_actions)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        // Cuántas filas entran depende del alto que tenga la tabla, y ese alto se conoce recién después
        // de armar la pantalla (o cuando una pregunta larga le saca lugar): al cambiar se dibuja de nuevo.
        lines.addOnLayoutChangeListener { _, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom ->
            if (bottom - top != oldBottom - oldTop || right - left != oldRight - oldLeft) {
                // Fuera de la pasada de diseño: dibujar filas o acciones desde acá las dejaría sin medir.
                lines.post {
                    shown = null
                    render()
                }
            }
        }
        intent.getStringExtra(EXTRA_TAB)?.let { name -> Tab.values().firstOrNull { it.name == name }?.let { tab = it } }
    }

    override fun onResume() {
        super.onResume()
        JuntadaHub.watch(this)
        lines.post(tick)
    }

    override fun onPause() {
        JuntadaHub.watch(null)
        prompt.close()
        lines.removeCallbacks(tick)
        sweep.running = false
        super.onPause()
    }

    override fun onJuntadaChanged() = render()

    // --- Dibujo ---

    private fun render() {
        val state = juntada.state(null, owner = true)
        val people = state.getJSONArray("people")
        val trivia = state.getJSONObject("trivia")
        val poll = state.optJSONObject("poll")
        val phase = trivia.getString("phase")
        follow(phase, poll, state.getJSONArray("expenses").length())

        val running = prefs.remoteEnabled && RemoteState.running
        val link = if (running) RemoteState.askUrl(this) else null
        if (link != shownLink) {
            shownLink = link
            qr.show(link)
            qr.visibility = if (link == null) View.INVISIBLE else View.VISIBLE
        }
        lead.setText(
            when {
                !prefs.remoteEnabled -> R.string.juntada_off
                link == null -> R.string.remote_no_network
                else -> R.string.juntada_lead
            }
        )
        names.text = (0 until people.length()).joinToString(" · ") { people.getJSONObject(it).getString("name") }
        findViewById<TextView>(R.id.screen_data).text =
            resources.getQuantityString(R.plurals.juntada_people, people.length(), people.length())

        val board = when {
            phase != "idle" || tab == Tab.TRIVIA -> triviaBoard(trivia, people.length())
            tab == Tab.POLL -> pollBoard(poll)
            else -> accountsBoard(state)
        }
        // La barra de tiempo se mueve en cada vuelta; el resto solo se arma de nuevo si cambió.
        time.visibility = if (board.progress == null) View.INVISIBLE else View.VISIBLE
        board.progress?.let { time.value = it }
        // Mientras Claude escribe las preguntas no se sabe cuánto falta: el filete barre.
        sweep.visibility = if (phase == "loading") View.VISIBLE else View.INVISIBLE
        sweep.running = phase == "loading"
        val signature = board.signature()
        if (signature != shown) {
            shown = signature
            draw(board)
        }
        buildActions(running, phase, poll)
        if (running) prompt.check()
    }

    /** La pared muestra sola lo último que pasó: una trivia que arranca, una votación nueva, un gasto. */
    private fun follow(phase: String, poll: JSONObject?, expenses: Int) {
        if (phase != lastPhase && phase != "idle") tab = Tab.TRIVIA
        val question = poll?.optString("question")
        if (question != lastPoll && question != null) tab = Tab.POLL
        if (lastExpenses in 0 until expenses) tab = Tab.ACCOUNTS
        lastPhase = phase
        lastPoll = question
        lastExpenses = expenses
    }

    private class Line(val lead: String, val text: String, val value: String?, val bar: Float?)

    private class Board(
        val label: String,
        val title: String,
        val lines: List<Line>,
        val note: String?,
        val progress: Float? = null,
        val mark: Int? = null
    ) {
        fun signature(): String =
            listOf(label, title, note, mark, lines.joinToString("|") { "${it.lead}·${it.text}·${it.value}·${it.bar}" }).joinToString("§")
    }

    private fun triviaBoard(trivia: JSONObject, people: Int): Board {
        val topic = trivia.optString("topic")
        val total = trivia.optInt("total")
        val number = trivia.optInt("index") + 1
        val left = trivia.optLong("left_ms")
        return when (trivia.getString("phase")) {
            "loading" -> Board(getString(R.string.juntada_trivia), getString(R.string.juntada_trivia_loading), emptyList(), topic)
            "ready" -> Board(
                getString(R.string.juntada_trivia),
                getString(R.string.juntada_trivia_ready),
                emptyList(),
                getString(if (trivia.optBoolean("own")) R.string.juntada_trivia_own else R.string.juntada_trivia_topic, topic),
                progress = left / Juntada.READY_MS.toFloat()
            )
            "question" -> Board(
                getString(R.string.juntada_trivia_number, number, total),
                trivia.getString("question"),
                options(trivia.getJSONArray("options"), null),
                getString(R.string.juntada_trivia_answered, trivia.optInt("answered"), people),
                progress = left / trivia.optLong("of_ms", Juntada.QUESTION_MS).toFloat()
            )
            "reveal" -> Board(
                getString(R.string.juntada_trivia_number, number, total),
                trivia.getString("question"),
                options(trivia.getJSONArray("options"), trivia.optJSONArray("picks")),
                trivia.optString("fact").ifEmpty { null },
                mark = trivia.getInt("correct")
            )
            "final" -> {
                val ranking = trivia.optJSONArray("ranking") ?: JSONArray()
                val rows = (0 until ranking.length()).map { i ->
                    val r = ranking.getJSONObject(i)
                    Line((i + 1).toString(), r.getString("name"), money.format(r.getInt("score")), null)
                }
                val winner = ranking.optJSONObject(0)?.optString("name")
                Board(
                    getString(R.string.juntada_trivia_result),
                    if (winner == null) getString(R.string.juntada_trivia_nobody) else getString(R.string.juntada_trivia_winner, winner),
                    rows,
                    topic,
                    mark = if (winner == null) null else 0
                )
            }
            else -> Board(
                getString(R.string.juntada_trivia),
                getString(if (trivia.optBoolean("failed")) R.string.juntada_trivia_failed else R.string.juntada_trivia_idle),
                emptyList(),
                getString(R.string.juntada_trivia_idle_note)
            )
        }
    }

    private fun options(options: JSONArray, picks: JSONArray?): List<Line> = (0 until options.length()).map { i ->
        Line(LETTERS[i].toString(), options.getString(i), picks?.optInt(i)?.toString(), null)
    }

    private fun pollBoard(poll: JSONObject?): Board {
        if (poll == null) {
            return Board(getString(R.string.juntada_poll), getString(R.string.juntada_poll_idle), emptyList(), getString(R.string.juntada_poll_idle_note))
        }
        val options = poll.getJSONArray("options")
        val total = poll.optInt("total")
        val votes = (0 until options.length()).map { options.getJSONObject(it).optInt("votes") }
        val best = votes.maxOrNull() ?: 0
        val rows = (0 until options.length()).map { i ->
            Line(LETTERS[i].toString(), options.getJSONObject(i).getString("text"), votes[i].toString(), if (total == 0) 0f else votes[i] / total.toFloat())
        }
        val open = poll.optBoolean("open")
        val winner = votes.indexOf(best).takeIf { !open && best > 0 && votes.count { it == best } == 1 }
        return Board(
            getString(if (open) R.string.juntada_poll else R.string.juntada_poll_closed),
            poll.getString("question"),
            rows,
            resources.getQuantityString(R.plurals.juntada_votes, total, total),
            mark = winner
        )
    }

    private fun accountsBoard(state: JSONObject): Board {
        val names = HashMap<String, String>()
        val people = state.getJSONArray("people")
        for (i in 0 until people.length()) people.getJSONObject(i).let { names[it.getString("id")] = it.getString("name") }
        val transfers = state.getJSONArray("transfers")
        val total = state.optLong("total")
        val rows = (0 until transfers.length()).map { i ->
            val t = transfers.getJSONObject(i)
            Line(
                (i + 1).toString(),
                getString(R.string.juntada_pays, names[t.getString("from")].orEmpty(), names[t.getString("to")].orEmpty()),
                pesos(t.getLong("amount")),
                null
            )
        }
        val headline = when {
            total == 0L -> getString(R.string.juntada_accounts_idle)
            rows.isEmpty() -> getString(R.string.juntada_accounts_even)
            else -> getString(R.string.juntada_accounts_title)
        }
        val spent = if (total == 0L) getString(R.string.juntada_accounts_idle_note) else getString(R.string.juntada_accounts_total, pesos(total))
        return Board(getString(R.string.juntada_accounts), headline, rows, spent)
    }

    private fun pesos(amount: Long) = "$ " + money.format(amount)

    private fun draw(board: Board) {
        label.text = board.label
        title.text = board.title
        // Una pregunta larga tiene que entrar entera: se lee de lejos, pero se tiene que leer toda.
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, if (board.title.length > LONG_TITLE) SMALL_TITLE else BIG_TITLE)
        note.text = board.note
        note.visibility = if (board.note.isNullOrEmpty()) View.INVISIBLE else View.VISIBLE
        // La tabla tiene que entrar entera en el alto que hay: las filas se achican hasta un mínimo legible
        // y, si ni así entran (la Juntada admite hasta 40 personas), la última dice cuántas faltan.
        val ready = lines.width > 0 && lines.height > 0
        val natural = if (ready) naturalRowHeight(board.lines.any { it.bar != null }) else 0f
        val plan = if (ready) BoardFit.plan(board.lines.size, lines.height.toFloat(), natural) else BoardFit.Plan(0, 0, 0f)
        val rows = BoardFit.rows(board.lines, plan) { Line("", getString(R.string.juntada_more, it), null, null) }
        val scale = if (natural > 0f) minOf(1f, plan.rowHeight / natural) else 1f
        val changedCount = lines.childCount != rows.size
        if (changedCount) lines.removeAllViews()
        marked = null
        rows.forEachIndexed { i, line ->
            val row = if (changedCount) inflateRow().also(lines::addView) else lines.getChildAt(i)
            fit(row, scale, plan.rowHeight)
            val text = row.findViewById<TextView>(R.id.line_text)
            row.findViewById<TextView>(R.id.line_lead).text = line.lead
            text.text = line.text
            row.findViewById<TextView>(R.id.line_value).text = line.value
            row.findViewById<LineProgress>(R.id.line_bar).apply {
                useTheme()
                visibility = if (line.bar == null) View.GONE else View.VISIBLE
                line.bar?.let { value = it }
            }
            // Lo que no ganó se apaga un poco: la cinta marca una sola cosa por pantalla. Si la fila
            // todavía estaba entrando, esa animación la dejaría encendida: se corta antes.
            if (!changedCount) {
                row.animate().cancel()
                row.translationY = 0f
            }
            val more = plan.hidden > 0 && i == rows.lastIndex
            row.alpha = if (more || (board.mark != null && board.mark != i)) DIM else 1f
            if (board.mark == i && !more) marked = text
        }
        if (changedCount && Motion.full) Motion.reveal((0 until lines.childCount).map(lines::getChildAt), stagger = 40L, rise = 10f)
        if (marked != null) tape.pin { markRect() } else tape.unpin()
    }

    /** Lo que mide una fila de la tabla al natural, con el ancho que tiene: se mide una de prueba. */
    private fun naturalRowHeight(withBar: Boolean): Float {
        val probe = inflateRow()
        probe.findViewById<TextView>(R.id.line_lead).text = "1"
        probe.findViewById<TextView>(R.id.line_text).text = "Wy"
        probe.findViewById<TextView>(R.id.line_value).text = "1"
        probe.findViewById<LineProgress>(R.id.line_bar).visibility = if (withBar) View.VISIBLE else View.GONE
        probe.measure(
            View.MeasureSpec.makeMeasureSpec(lines.width, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
        )
        return probe.measuredHeight.toFloat()
    }

    /** Los tamaños de una fila sin achicar, para poder achicarla (y volver) sin acumular errores. */
    private class RowBase(val lead: Float, val text: Float, val value: Float, val padding: Int, val barTop: Int)

    private fun inflateRow(): View = layoutInflater.inflate(R.layout.item_board_line, lines, false).also { row ->
        row.tag = RowBase(
            row.findViewById<TextView>(R.id.line_lead).textSize,
            row.findViewById<TextView>(R.id.line_text).textSize,
            row.findViewById<TextView>(R.id.line_value).textSize,
            row.paddingTop,
            (row.findViewById<View>(R.id.line_bar).layoutParams as ViewGroup.MarginLayoutParams).topMargin
        )
    }

    /** Achica la fila a [scale] de su tamaño natural y le da su alto exacto; sin achicar, vuelve a lo de siempre. */
    private fun fit(row: View, scale: Float, height: Float) {
        val base = row.tag as RowBase
        row.findViewById<TextView>(R.id.line_lead).setTextSize(TypedValue.COMPLEX_UNIT_PX, base.lead * scale)
        row.findViewById<TextView>(R.id.line_text).setTextSize(TypedValue.COMPLEX_UNIT_PX, base.text * scale)
        row.findViewById<TextView>(R.id.line_value).setTextSize(TypedValue.COMPLEX_UNIT_PX, base.value * scale)
        val padding = Math.round(base.padding * scale)
        row.setPadding(row.paddingLeft, padding, row.paddingRight, padding)
        row.findViewById<View>(R.id.line_bar).let { bar ->
            val params = bar.layoutParams as ViewGroup.MarginLayoutParams
            val top = Math.round(base.barTop * scale)
            if (params.topMargin != top) {
                params.topMargin = top
                bar.layoutParams = params
            }
        }
        val wanted = if (scale >= 1f) ViewGroup.LayoutParams.WRAP_CONTENT else height.toInt()
        if (row.layoutParams.height != wanted) {
            row.layoutParams.height = wanted
            row.requestLayout()
        }
    }

    /** La cinta deja el foco y se apoya en la respuesta correcta, igual que en una respuesta de Claude. */
    private fun markRect(): RectF? {
        val view = marked ?: return null
        val layout = view.layout ?: return null
        if (!view.isShown || view.width == 0) return null
        val em = view.textSize
        val rect = RectF(-em * 0.08f, layout.getLineTop(0) - em * 0.04f, layout.getLineWidth(0) + em * 0.12f, layout.getLineBottom(0) + em * 0.06f)
        return tape.toLocal(view, rect)
    }

    // --- Acciones ---

    private fun buildActions(running: Boolean, phase: String, poll: JSONObject?) {
        val open = poll?.optBoolean("open") == true
        val signature = "$running/${phase != "idle"}/$open/$tab"
        if (signature == shownActions) return
        shownActions = signature
        val keep = actions.focusedChild != null || currentFocus == null
        val index = (0 until actions.childCount).firstOrNull { actions.getChildAt(it).isFocused } ?: 0
        actions.removeAllViews()
        if (!running) {
            action(getString(R.string.remote_turn_on)) {
                prefs.remoteEnabled = true
                RemoteService.start(this)
            }
        } else {
            if (phase == "idle") action(getString(R.string.juntada_trivia_start)) { pickTopic() }
            else action(getString(R.string.juntada_trivia_stop)) { juntada.stopTrivia() }
            if (open) action(getString(R.string.juntada_poll_close)) { runCatching { juntada.closePoll(null, owner = true) } }
            else action(getString(R.string.juntada_poll_show)) { show(Tab.POLL) }
            action(getString(R.string.juntada_accounts)) { show(Tab.ACCOUNTS) }
            action(getString(R.string.juntada_reset)) {
                Sheet.confirm(this, getString(R.string.juntada_reset), getString(R.string.juntada_reset_body), getString(R.string.juntada_reset_yes)) {
                    juntada.reset()
                }
            }
        }
        if (keep) (actions.getChildAt(index) ?: actions.getChildAt(0))?.requestFocus()
    }

    private fun show(value: Tab) {
        tab = value
        render()
    }

    private fun action(text: String, run: () -> Unit) {
        val view = layoutInflater.inflate(R.layout.item_action, actions, false) as TextView
        view.text = text
        view.setTextSize(TypedValue.COMPLEX_UNIT_SP, ACTION_SIZE)
        view.setOnClickListener {
            tape.unpin()
            run()
        }
        actions.addView(view)
    }

    private fun pickTopic() {
        val topics = resources.getStringArray(R.array.juntada_topics)
        val options = topics.map { topic -> Sheet.Option(topic) { start(topic) } } +
            Sheet.Option(getString(R.string.juntada_topic_other), R.drawable.ic_keyboard) {
                Keyboard.show(this, getString(R.string.juntada_topic_title)) { text -> if (text.isNotBlank()) start(text) }
            }
        Sheet.show(this, getString(R.string.juntada_trivia), options, getString(R.string.juntada_topic_body))
    }

    private fun start(topic: String) {
        tab = Tab.TRIVIA
        runCatching { juntada.startTrivia(topic, DEFAULT_QUESTIONS, JuntadaHub.source(this)) }
    }

    companion object {
        const val EXTRA_TAB = "tab"
        const val TAB_TRIVIA = "TRIVIA"
        private const val TICK_MS = 250L
        private const val DEFAULT_QUESTIONS = 8
        private const val LONG_TITLE = 70
        private const val BIG_TITLE = 32f
        private const val SMALL_TITLE = 25f
        private const val ACTION_SIZE = 20f
        private const val DIM = 0.45f
        private const val LETTERS = "ABCDEFGH"

        fun trivia(context: Context): Intent = Intent(context, JuntadaActivity::class.java).putExtra(EXTRA_TAB, TAB_TRIVIA)
    }
}
