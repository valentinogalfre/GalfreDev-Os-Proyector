package ar.vale.projectorlauncher.claude

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.style.ReplacementSpan
import android.util.TypedValue
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Keyboard
import ar.vale.projectorlauncher.ui.Motion
import ar.vale.projectorlauncher.ui.SweepLine

/**
 * Claude en la pared. La respuesta se escribe grande, a medida que llega, y cuando aparece la
 * palabra que la resume la cinta deja el foco y vuela hasta ella: sigue habiendo una sola.
 */
class ClaudeActivity : GdActivity(), ClaudeRuntime.Observer {

    /** Acá están la clave y los pedidos que se cobran: un invitado con el control prestado no entra. */
    override val ownerOnly: Boolean get() = true

    private lateinit var scroll: ScrollView
    private lateinit var question: TextView
    private lateinit var answer: TextView
    private lateinit var data: TextView
    private lateinit var suggestions: LinearLayout
    private lateinit var actions: LinearLayout
    private lateinit var steps: LinearLayout
    private lateinit var sweep: SweepLine
    private var mark: Markup.Parsed? = null
    private var shownBusy: Boolean? = null
    private var shownQuestion: String? = null
    private var shownSteps: List<String> = emptyList()
    private var shownStepsBusy = false
    private var caretOn = true

    /** El cursor del final parpadea mientras Claude escribe. Solo repinta: el texto no se rearma. */
    private val blink = object : Runnable {
        override fun run() {
            caretOn = !caretOn
            answer.invalidate()
            answer.postDelayed(this, BLINK_MS)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_claude)
        scroll = findViewById(R.id.claude_scroll)
        // ScrollView se vuelve enfocable en su constructor, después de leer el XML. Si toma el foco,
        // la flecha abajo solo desplaza el texto y el control no llega nunca a los botones.
        scroll.isFocusable = false
        question = findViewById(R.id.claude_question)
        answer = findViewById(R.id.claude_answer)
        data = findViewById(R.id.screen_data)
        suggestions = findViewById(R.id.claude_suggestions)
        actions = findViewById(R.id.claude_actions)
        steps = findViewById(R.id.claude_steps)
        sweep = findViewById(R.id.claude_sweep)
        setHead(getString(R.string.word_claude), ClaudeSettings.modelLabel(this))
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        consumeIntent()
    }

    override fun onNewIntent(intent: android.content.Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        consumeIntent()
    }

    /** Llega desde el celular: la pregunta se escribe allá y la respuesta sale en la pared. */
    private fun consumeIntent() {
        val text = intent.getStringExtra(EXTRA_ASK) ?: return
        intent.removeExtra(EXTRA_ASK)
        ask(text)
    }

    override fun onResume() {
        super.onResume()
        ClaudeRuntime.observe(this)
        shownBusy = null
        onChanged()
    }

    override fun onPause() {
        ClaudeRuntime.observe(null)
        answer.removeCallbacks(blink)
        sweep.running = false
        super.onPause()
    }

    private fun ask(text: String) {
        tape.unpin()
        if (!ClaudeRuntime.ask(this, text)) ClaudeSettings.enterKey(this) { onChanged() }
    }

    private fun openKeyboard() {
        tape.unpin()
        Keyboard.show(this, getString(R.string.claude_ask_title)) { text ->
            if (text.isNotBlank()) ask(text.trim())
        }
    }

    override fun onChanged() {
        val r = ClaudeRuntime
        val hasKey = KeyVault.has(this)
        val empty = r.question.isEmpty()
        question.text = r.question
        question.visibility = if (empty) View.GONE else View.VISIBLE

        val parsed = Markup.parse(r.answer)
        val text = when {
            !hasKey -> getString(R.string.claude_intro_no_key)
            empty -> getString(R.string.claude_intro)
            r.end == Session.End.REFUSED -> getString(R.string.claude_refused)
            r.end == Session.End.TOO_LONG -> getString(R.string.claude_too_long)
            r.end == Session.End.FAILED -> ClaudeSettings.message(this, r.error)
            r.end == Session.End.TRUNCATED -> parsed.plain + "…"
            else -> parsed.plain
        }
        // Lo corto se lee de lejos en grande; lo largo necesita entrar en la pantalla.
        answer.setTextSize(TypedValue.COMPLEX_UNIT_SP, if (text.length > LONG_ANSWER) LONG_SIZE else BIG_SIZE)
        val writing = r.busy && r.answer.isNotEmpty() && Motion.full
        answer.text = if (writing) withCaret(text) else text
        answer.removeCallbacks(blink)
        if (writing) answer.postDelayed(blink, BLINK_MS) else caretOn = true

        data.text = if (r.busy) ClaudeSettings.activityLabel(this, r.activity) else ClaudeSettings.modelLabel(this)
        sweep.visibility = if (r.busy) View.VISIBLE else View.INVISIBLE
        sweep.running = r.busy
        showSteps(r.steps, r.busy)

        // Una pregunta nueva entra de a bloques, como el resto del sistema.
        if (r.question != shownQuestion) {
            val first = shownQuestion == null
            shownQuestion = r.question
            if (!first && !empty) Motion.reveal(listOf(question, answer), stagger = 60L, rise = 12f)
        }

        val showMark = parsed.hasMark && text.startsWith(parsed.plain)
        mark = parsed.takeIf { showMark }
        if (showMark && !tape.isPinned) answer.post { tape.pin { markRect() } }
        if (!showMark) tape.unpin()

        if (shownBusy != r.busy || suggestions.childCount > 0 != (empty && hasKey)) {
            shownBusy = r.busy
            buildActions(hasKey, empty)
        }
    }

    /**
     * El paso a paso de lo que hizo: una línea por herramienta, en la letra de los datos. Lo que
     * está corriendo va en tinta y lo anterior se apaga. Con muchos pasos quedan los últimos.
     */
    private fun showSteps(all: List<String>, busy: Boolean) {
        if (all == shownSteps && busy == shownStepsBusy) return
        val grew = all.size > shownSteps.size
        shownSteps = all
        shownStepsBusy = busy
        val visible = all.takeLast(MAX_STEPS)
        while (steps.childCount > visible.size) steps.removeViewAt(0)
        while (steps.childCount < visible.size) {
            steps.addView(TextView(this).apply { setTextAppearance(R.style.Gd_Data) })
        }
        val ink = getColor(R.color.ink)
        val muted = getColor(R.color.ink_2)
        visible.forEachIndexed { i, line ->
            val view = steps.getChildAt(i) as TextView
            val current = busy && i == visible.lastIndex
            view.text = getString(R.string.claude_step, line)
            view.setTextColor(if (current) ink else muted)
            view.alpha = if (current || !busy) 1f else PAST_ALPHA
        }
        steps.visibility = if (visible.isEmpty()) View.GONE else View.VISIBLE
        if (grew && visible.isNotEmpty()) Motion.reveal(listOf(steps.getChildAt(visible.lastIndex)), rise = 8f)
    }

    private fun withCaret(text: String): CharSequence =
        SpannableStringBuilder(text).append("\u00A0").apply {
            setSpan(Caret(), length - 1, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        }

    /** Un bloque del color del texto al final de lo escrito. */
    private inner class Caret : ReplacementSpan() {
        override fun getSize(paint: Paint, text: CharSequence?, start: Int, end: Int, fm: Paint.FontMetricsInt?): Int =
            (paint.textSize * 0.5f).toInt()

        override fun draw(canvas: Canvas, text: CharSequence?, start: Int, end: Int, x: Float, top: Int, y: Int, bottom: Int, paint: Paint) {
            if (!caretOn) return
            val em = paint.textSize
            canvas.drawRect(x + em * 0.1f, y - em * 0.72f, x + em * 0.46f, y + em * 0.03f, paint)
        }
    }

    /** El lugar de la palabra marcada en pantalla. Si salió de la vista, la cinta vuelve al foco. */
    private fun markRect(): RectF? {
        val m = mark ?: return null
        val layout = answer.layout ?: return null
        if (m.markEnd > answer.text.length) return null
        val line = layout.getLineForOffset(m.markStart)
        val sameLine = layout.getLineForOffset(m.markEnd) == line
        val em = answer.textSize
        val rect = RectF(
            layout.getPrimaryHorizontal(m.markStart) - em * 0.08f,
            layout.getLineTop(line) - em * 0.02f,
            (if (sameLine) layout.getPrimaryHorizontal(m.markEnd) else layout.getLineRight(line)) + em * 0.12f,
            layout.getLineBottom(line) + em * 0.02f
        )
        tape.toLocal(answer, rect)
        val visible = IntArray(2).also(scroll::getLocationInWindow)
        val inside = rect.top >= visible[1] && rect.bottom <= visible[1] + scroll.height
        return rect.takeIf { inside }
    }

    private fun buildActions(hasKey: Boolean, empty: Boolean) {
        val keep = actions.focusedChild != null || suggestions.focusedChild != null || currentFocus == null
        actions.removeAllViews()
        suggestions.removeAllViews()
        when {
            !hasKey -> action(actions, getString(R.string.claude_key_load)) { ClaudeSettings.show(this) { onChanged() } }
            ClaudeRuntime.busy -> action(actions, getString(R.string.claude_stop)) { ClaudeRuntime.cancel() }
            else -> {
                action(actions, getString(R.string.claude_ask)) { openKeyboard() }
                if (!empty) action(actions, getString(R.string.claude_new)) {
                    tape.unpin()
                    ClaudeRuntime.reset()
                }
                action(actions, getString(R.string.word_ajustes)) { ClaudeSettings.show(this) { onChanged() } }
            }
        }
        if (empty && hasKey) {
            resources.getStringArray(R.array.claude_suggestions).forEach { text ->
                action(suggestions, text, SUGGESTION_SIZE) { ask(text) }
            }
            if (Motion.full) Motion.reveal((0 until suggestions.childCount).map(suggestions::getChildAt), stagger = 55L, rise = 10f)
        }
        if (keep) actions.getChildAt(0)?.requestFocus()
    }

    private fun action(host: LinearLayout, label: String, size: Float? = null, run: () -> Unit) {
        val view = layoutInflater.inflate(R.layout.item_action, host, false) as TextView
        view.text = label
        size?.let { view.setTextSize(TypedValue.COMPLEX_UNIT_SP, it) }
        if (host === suggestions) {
            (view.layoutParams as LinearLayout.LayoutParams).bottomMargin = (10 * resources.displayMetrics.density).toInt()
        }
        view.setOnClickListener { run() }
        host.addView(view)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        // Con un teclado o un panel abierto, las flechas son suyas.
        if (hasOverlay) return super.onKeyDown(keyCode, event)
        val step = scroll.height / 2
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_DOWN -> if (suggestions.childCount == 0) {
                scroll.smoothScrollBy(0, step)
                return true
            }
            KeyEvent.KEYCODE_DPAD_UP -> if (suggestions.childCount == 0) {
                scroll.smoothScrollBy(0, -step)
                return true
            }
            // Izquierda y derecha devuelven la cinta al foco y la acción sigue su curso.
            KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_DPAD_RIGHT -> tape.unpin()
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        // Si la cinta está en la palabra, el primer OK solo la trae de vuelta: no se aprieta a ciegas.
        val ok = event.keyCode == KeyEvent.KEYCODE_DPAD_CENTER || event.keyCode == KeyEvent.KEYCODE_ENTER
        if (ok && tape.isOnPin && !hasOverlay) {
            if (event.action == KeyEvent.ACTION_UP) tape.unpin()
            return true
        }
        return super.dispatchKeyEvent(event)
    }

    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (!hasOverlay && ClaudeRuntime.busy) ClaudeRuntime.cancel() else super.onBackPressed()
    }

    companion object {
        const val EXTRA_ASK = "ask"
        private const val LONG_ANSWER = 230
        private const val BIG_SIZE = 34f
        private const val LONG_SIZE = 24f
        private const val SUGGESTION_SIZE = 20f
        private const val MAX_STEPS = 4
        private const val PAST_ALPHA = 0.55f
        private const val BLINK_MS = 520L
    }
}
