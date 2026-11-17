package ar.vale.projectorlauncher.wall

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.os.SystemClock
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import android.view.View
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.media.Time
import ar.vale.projectorlauncher.ui.Motion
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import kotlin.math.abs
import kotlin.random.Random

/**
 * La pared: lo que muestra el proyector cuando nadie lo está usando.
 *
 * Tiene tres modos y una cuenta regresiva. En todos hay un solo bloque de cinta: la palabra de la
 * hora, o la celda que se mueve por la retícula. Solo se redibuja cuando algo cambia.
 */
class WallView(context: Context) : View(context) {

    enum class Mode(val label: Int) {
        WORDS(R.string.wall_words),
        CLOCK(R.string.wall_clock),
        GRID(R.string.wall_grid)
    }

    var mode: Mode = Mode.WORDS
        set(value) {
            field = value
            phrase = null
            start = 0L
            invalidate()
        }

    /** Momento (elapsedRealtime) en que termina la cuenta regresiva; 0 si no hay ninguna. */
    var countdownEnd: Long = 0L
        set(value) {
            field = value
            invalidate()
        }

    private val dp = resources.displayMetrics.density
    private val page = context.getColor(R.color.page)
    private val ink = context.getColor(R.color.ink)
    private val ink2 = context.getColor(R.color.ink_2)
    private val rule = context.getColor(R.color.rule)
    private val carbon = context.getColor(R.color.carbon)
    private val tape = Paint().apply { color = context.getColor(R.color.cinta) }
    private val line = Paint().apply {
        color = rule
        strokeWidth = dp
    }

    private val big = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        typeface = context.resources.getFont(R.font.archivo_extrabold)
        letterSpacing = -0.038f
        color = ink
        textSize = 88 * dp
    }
    private val digits = TextPaint(big).apply {
        letterSpacing = -0.055f
        textSize = 250 * dp
        isSubpixelText = true
    }
    private val data = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        typeface = context.resources.getFont(R.font.geist_mono)
        color = ink2
        textSize = 14 * dp
    }

    private val locale = Locale.forLanguageTag("es-AR")
    private val date = SimpleDateFormat("EEEE d 'de' MMMM", locale)
    private val hour = SimpleDateFormat("HH:mm", locale)

    private var phrase: WordClock.Phrase? = null
    private var layout: StaticLayout? = null
    private val markRect = RectF()
    private val fromRect = RectF()
    private var start = 0L

    // Retícula: la cinta salta de celda en celda con el mismo gesto que el foco.
    private var cell = 0
    private var targetCell = 0
    private val cellRect = RectF()

    override fun onDraw(canvas: Canvas) {
        canvas.drawColor(page)
        when {
            countdownEnd != 0L -> drawCountdown(canvas)
            mode == Mode.WORDS -> drawWords(canvas)
            mode == Mode.CLOCK -> drawClock(canvas)
            else -> drawGrid(canvas)
        }
    }

    private fun margin() = 56 * dp

    private fun drawFooter(canvas: Canvas) {
        date.timeZone = TimeZone.getDefault()
        val text = date.format(Date()).replaceFirstChar { it.titlecase(locale) }
        canvas.drawText(text, margin(), height - 40 * dp, data)
    }

    private fun drawWords(canvas: Canvas) {
        val now = Calendar.getInstance()
        val next = WordClock.phrase(now.get(Calendar.HOUR_OF_DAY), now.get(Calendar.MINUTE))
        if (next != phrase) {
            val hadText = phrase != null
            fromRect.set(markRect)
            phrase = next
            layout = buildLayout(next.text)
            findMark(next)
            start = if (hadText && Motion.full) SystemClock.uptimeMillis() else 0L
        }
        val body = layout ?: return
        val top = (height - body.height) / 2f - 16 * dp
        val t = if (start == 0L) 1f else Motion.span((SystemClock.uptimeMillis() - start).toFloat(), 0f, 720f)
        val e = Motion.inOut.getInterpolation(t)
        val alpha = (255 * Motion.span(t, 0.25f, 1f)).toInt()

        val save = canvas.save()
        canvas.translate(margin(), top)
        big.color = ink
        big.alpha = alpha
        body.draw(canvas)
        val r = RectF(
            Motion.lerp(fromRect.left, markRect.left, e),
            Motion.lerp(fromRect.top, markRect.top, e),
            Motion.lerp(fromRect.right, markRect.right, e),
            Motion.lerp(fromRect.bottom, markRect.bottom, e)
        )
        if (fromRect.isEmpty) r.set(markRect)
        canvas.drawRect(r, tape)
        val clip = canvas.save()
        canvas.clipRect(r)
        big.color = carbon
        big.alpha = alpha
        body.draw(canvas)
        canvas.restoreToCount(clip)
        canvas.restoreToCount(save)
        big.color = ink
        drawFooter(canvas)
        if (t < 1f) postInvalidateOnAnimation() else invalidateAtNextMinute()
    }

    private fun buildLayout(text: String): StaticLayout {
        val width = (this.width - 2 * margin()).toInt().coerceAtLeast(1)
        return StaticLayout.Builder.obtain(text, 0, text.length, big, width)
            .setAlignment(Layout.Alignment.ALIGN_NORMAL)
            .setIncludePad(false)
            .setLineSpacing(0f, 1f)
            .build()
    }

    private fun findMark(next: WordClock.Phrase) {
        val body = layout ?: return
        val at = next.text.indexOf(next.mark)
        val end = at + next.mark.length
        val line = body.getLineForOffset(at)
        val em = big.textSize
        markRect.set(
            body.getPrimaryHorizontal(at) - em * 0.06f,
            body.getLineTop(line).toFloat(),
            body.getPrimaryHorizontal(end) + em * 0.1f,
            body.getLineBottom(line).toFloat()
        )
    }

    private fun drawClock(canvas: Canvas) {
        hour.timeZone = TimeZone.getDefault()
        val text = hour.format(Date())
        digits.color = ink
        val base = height / 2f + digits.textSize * 0.34f
        canvas.drawText(text, margin() - digits.textSize * 0.04f, base, digits)
        drawFooter(canvas)
        invalidateAtNextMinute()
    }

    private fun drawCountdown(canvas: Canvas) {
        val left = countdownEnd - SystemClock.elapsedRealtime()
        val text = if (left <= 0) context.getString(R.string.wall_time_up) else Time.clock(left + 999)
        digits.color = ink
        digits.textSize = if (text.length > 5) 190 * dp else 250 * dp
        val base = height / 2f + digits.textSize * 0.34f
        val width = digits.measureText(text)
        if (left <= 0) {
            // Se acabó: la cinta ocupa la palabra, y eso es lo único que se mueve en la sala.
            big.color = carbon
            val tw = big.measureText(text)
            val y = height / 2f
            canvas.drawRect(margin() - 10 * dp, y - big.textSize * 0.86f, margin() + tw + 14 * dp, y + big.textSize * 0.24f, tape)
            canvas.drawText(text, margin(), y, big)
            big.color = ink
            return
        }
        canvas.drawText(text, margin() - digits.textSize * 0.04f, base, digits)
        if (width > 0) postInvalidateDelayed(COUNTDOWN_MS)
    }

    private fun drawGrid(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        val cols = 12
        val rows = 7
        val cw = w / cols
        val ch = h / rows
        for (i in 1 until cols) canvas.drawLine(cw * i, 0f, cw * i, h, line)
        for (i in 1 until rows) canvas.drawLine(0f, ch * i, w, ch * i, line)
        val now = SystemClock.uptimeMillis()
        if (now - start > GRID_STEP_MS) {
            cell = targetCell
            targetCell = nextCell(cell, cols, rows)
            start = now
        }
        val t = Motion.span((now - start).toFloat(), 0f, 1200f)
        val e = Motion.inOut.getInterpolation(t)
        val x = Motion.lerp((cell % cols).toFloat(), (targetCell % cols).toFloat(), e)
        val y = Motion.lerp((cell / cols).toFloat(), (targetCell / cols).toFloat(), e)
        cellRect.set(cw * x, ch * y, cw * (x + 2), ch * (y + 1))
        canvas.drawRect(cellRect, tape)
        if (t < 1f) postInvalidateOnAnimation() else postInvalidateDelayed(GRID_STEP_MS - 1200L)
    }

    /** Sale a una celda vecina y nunca se pega al borde derecho: el bloque mide dos celdas. */
    private fun nextCell(from: Int, cols: Int, rows: Int): Int {
        var candidate: Int
        do {
            val x = (from % cols + Random.nextInt(-3, 4)).coerceIn(0, cols - 2)
            val y = (from / cols + Random.nextInt(-2, 3)).coerceIn(0, rows - 1)
            candidate = y * cols + x
        } while (abs(candidate - from) == 0)
        return candidate
    }

    private fun invalidateAtNextMinute() {
        val delay = 60_000L - System.currentTimeMillis() % 60_000L
        postInvalidateDelayed(delay)
    }

    private companion object {
        const val COUNTDOWN_MS = 250L
        const val GRID_STEP_MS = 6000L
    }
}
