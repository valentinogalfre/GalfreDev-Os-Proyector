package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.DashPathEffect
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PathMeasure
import android.graphics.RectF
import android.graphics.Typeface
import android.os.SystemClock
import android.text.TextPaint
import android.view.View
import ar.vale.projectorlauncher.R
import kotlin.math.pow

/**
 * El arranque: construye la marca con las medidas del manual y le entrega la cinta al sistema.
 *
 * Es la lámina de construcción de la g puesta en movimiento, con sus números reales: las guías
 * se trazan, el contorno se dibuja sobre ellas, la g se llena, se ubica como primera letra y
 * aparece el resto de la palabra. Después el logo sube al encabezado, entra el lema, la cinta
 * barre «a medida.» y ese mismo bloque viaja hasta el primer elemento del inicio. Nunca hay dos
 * cintas: desde ahí la mueve el control remoto.
 *
 * Mide cuadros reales mientras corre; con ese dato [Motion] decide si este equipo aguanta las
 * animaciones completas.
 */
class BootView(
    context: Context,
    private val mark: Wordmark,
    var status: List<Pair<String, String>>,
    private val logoRect: () -> RectF
) : View(context) {

    /** Se llama cuando la cinta pasa a manos del sistema, con su posición en pantalla. */
    var onHandoff: ((RectF) -> Unit)? = null

    /** Se llama cuando el arranque terminó, con la duración media medida de un cuadro. */
    var onFinished: ((frameMs: Float) -> Unit)? = null

    private val dp = resources.displayMetrics.density
    private val page = context.getColor(R.color.page)
    private val ink = context.getColor(R.color.ink)
    private val ink2 = context.getColor(R.color.ink_2)
    private val guide = context.getColor(R.color.control)
    private val carbon = context.getColor(R.color.carbon)

    private val fill = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL; color = ink }
    private val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        color = ink
        strokeCap = Paint.Cap.ROUND
        strokeJoin = Paint.Join.ROUND
    }
    private val line = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        color = guide
        strokeWidth = dp
    }
    private val dashed = Paint(line).apply {
        pathEffect = DashPathEffect(floatArrayOf(6 * dp, 6 * dp), 0f)
    }
    private val tapePaint = Paint().apply { color = context.getColor(R.color.cinta) }

    private val mono: Typeface = context.resources.getFont(R.font.geist_mono_medium)
    private val labelPaint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        typeface = mono
        textSize = 10.5f * dp
        letterSpacing = 0.06f
        color = ink2
    }
    private val statusPaint = TextPaint(labelPaint).apply { textSize = 11.5f * dp }
    private val headPaint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        typeface = context.resources.getFont(R.font.archivo_extrabold)
        letterSpacing = -0.038f
        color = ink
    }

    private val line1 = context.getString(R.string.lema_line_1)
    private val line2 = context.getString(R.string.lema_line_2)
    private val markWords = context.getString(R.string.lema_mark)
    private val guides = listOf(
        Wordmark.X_HEIGHT_Y to context.getString(R.string.boot_guide_x),
        Wordmark.BASELINE_Y to context.getString(R.string.boot_guide_base),
        Wordmark.FOOT_Y to context.getString(R.string.boot_guide_foot),
        Wordmark.DESCENDER_Y to context.getString(R.string.boot_guide_desc)
    )
    private val stemLabel = context.getString(R.string.boot_stem)
    private val footLabel = context.getString(R.string.boot_foot)

    private val contours = ArrayList<PathMeasure>()
    private val segment = Path()

    private var startAt = 0L
    private var firstFrameAt = 0L
    private var lastFrameAt = 0L
    private var frames = 0
    private var handedOff = false
    private val tapeRect = RectF()

    init {
        val measure = PathMeasure(mark.g.path, false)
        do {
            if (measure.length > 0f) {
                val copy = Path()
                measure.getSegment(0f, measure.length, copy, true)
                contours.add(PathMeasure(copy, false))
            }
        } while (measure.nextContour())
        setLayerType(LAYER_TYPE_NONE, null)
    }

    /** Cualquier tecla corta la animación: sigue directo al final, sin saltos. */
    fun skip() {
        val t = SystemClock.uptimeMillis() - startAt
        if (startAt != 0L && t < T_FADE) startAt -= (T_FADE - t)
    }

    override fun onDraw(canvas: Canvas) {
        val now = SystemClock.uptimeMillis()
        if (startAt == 0L) startAt = now - (if (Motion.full) 0L else T_REDUCED_START)
        val t = (now - startAt).toFloat()
        countFrame(now, t)

        canvas.drawColor(page)
        // Los tres encuadres del logo: g grande, palabra a todo el ancho, encabezado.
        val w = width.toFloat()
        val h = height.toFloat()
        val margin = 56 * dp
        val k1 = h * 0.54f / (Wordmark.DESCENDER_Y - Wordmark.G_TOP_Y)
        val y1 = (h - (Wordmark.DESCENDER_Y + Wordmark.G_TOP_Y) * k1) / 2f
        val k2 = (w - 2 * margin) / mark.width
        val y2 = (h - mark.height * k2) / 2f
        val end = logoRect()
        val k3 = end.height() / mark.height
        val eMove = Motion.inOut.getInterpolation(Motion.span(t, T_MOVE, T_MOVE_END))
        val eUp = Motion.inOut.getInterpolation(Motion.span(t, T_UP, T_UP_END))
        val k = k1 * (k2 / k1).pow(eMove) * (k3 / k2).pow(eUp)
        val x = Motion.lerp(margin, end.left, eUp)
        val y = Motion.lerp(Motion.lerp(y1, y2, eMove), end.top, eUp)

        drawGuides(canvas, t, x, y, k)
        drawMark(canvas, t, x, y, k)
        if (t >= T_UP) drawLema(canvas, t, margin)

        if (t < T_END) {
            postInvalidateOnAnimation()
        } else if (!handedOff) {
            handedOff = true
            onHandoff?.invoke(RectF(tapeRect))
            val frameMs = if (frames > 1) (lastFrameAt - firstFrameAt).toFloat() / (frames - 1) else 0f
            // La salida arranca fuera de este dibujo. Una animación con capa propia arma la capa al
            // empezar, y armarla en medio de un onDraw cierra la app en Android 10 o más.
            post {
                animate().alpha(0f).setDuration(Motion.BASE).setInterpolator(Motion.out).withLayer()
                    .withEndAction { onFinished?.invoke(frameMs) }
                    .start()
            }
        }
    }

    private fun countFrame(now: Long, t: Float) {
        if (t < T_MEASURE_FROM || t > T_MEASURE_TO) return
        if (firstFrameAt == 0L) firstFrameAt = now
        lastFrameAt = now
        frames++
    }

    private fun drawGuides(canvas: Canvas, t: Float, x: Float, y: Float, k: Float) {
        val fade = 1f - Motion.span(t, T_UP, T_UP + 240f)
        if (fade <= 0f) return
        val w = width.toFloat()
        line.alpha = (255 * fade).toInt()
        labelPaint.alpha = line.alpha
        guides.forEachIndexed { i, (gy, label) ->
            val p = Motion.out.getInterpolation(Motion.span(t, 60f + i * 70f, 620f + i * 70f))
            val yy = y + gy * k
            canvas.drawLine(0f, yy, w * p, yy, line)
            val a = Motion.span(t, 420f + i * 70f, 660f + i * 70f) * fade
            if (a > 0f) {
                labelPaint.alpha = (255 * a).toInt()
                val tw = labelPaint.measureText(label)
                canvas.drawText(label, w - 56 * dp - tw, yy - 6 * dp, labelPaint)
            }
        }
        // Las cotas de la g solo tienen sentido mientras la g se está construyendo.
        val cote = (1f - Motion.span(t, T_MOVE, T_MOVE + 220f)) * Motion.span(t, 300f, 700f)
        if (cote <= 0f) return
        dashed.alpha = (255 * cote).toInt()
        labelPaint.alpha = dashed.alpha
        for (gx in floatArrayOf(0f, Wordmark.STEM_LEFT_X, Wordmark.STEM_RIGHT_X)) {
            val xx = x + gx * k
            canvas.drawLine(xx, 0f, xx, height.toFloat(), dashed)
        }
        canvas.drawText(stemLabel, x + Wordmark.STEM_LEFT_X * k + 5 * dp, y + Wordmark.X_HEIGHT_Y * k - 8 * dp, labelPaint)
        canvas.drawText(footLabel, x + 5 * dp, y + Wordmark.DESCENDER_Y * k + 16 * dp, labelPaint)
    }

    private fun drawMark(canvas: Canvas, t: Float, x: Float, y: Float, k: Float) {
        val save = canvas.save()
        canvas.translate(x, y)
        canvas.scale(k, k)

        // Contorno sobre las guías.
        val trace = Motion.inOut.getInterpolation(Motion.span(t, T_TRACE, T_TRACE_END))
        val traceFade = 1f - Motion.span(t, T_FILL_END - 120f, T_FILL_END)
        if (trace > 0f && traceFade > 0f) {
            stroke.strokeWidth = 1.6f * dp / k
            stroke.alpha = (255 * traceFade).toInt()
            for (c in contours) {
                segment.reset()
                c.getSegment(0f, c.length * trace, segment, true)
                canvas.drawPath(segment, stroke)
            }
        }

        // La g se llena de abajo hacia arriba.
        val rise = Motion.inOut.getInterpolation(Motion.span(t, T_FILL, T_FILL_END))
        if (rise > 0f) {
            val top = Motion.lerp(Wordmark.DESCENDER_Y, Wordmark.G_TOP_Y - 2f, rise)
            val s = canvas.save()
            canvas.clipRect(-2f, top, Wordmark.G_WIDTH + 2f, Wordmark.DESCENDER_Y + 2f)
            canvas.drawPath(mark.g.path, fill)
            canvas.restoreToCount(s)
        }

        // El resto de la palabra sube desde debajo de la línea, letra por letra.
        for (i in 1 until mark.letters.size) {
            val letter = mark.letters[i]
            val from = T_LETTERS + (i - 1) * 55f
            val e = Motion.out.getInterpolation(Motion.span(t, from, from + 380f))
            if (e <= 0f) continue
            val s = canvas.save()
            canvas.clipRect(letter.left - 12f, -4f, letter.right + 12f, mark.height + 2f)
            canvas.translate(0f, (1f - e) * mark.height)
            canvas.drawPath(letter.path, fill)
            canvas.restoreToCount(s)
        }
        canvas.restoreToCount(save)
    }

    private fun drawLema(canvas: Canvas, t: Float, left: Float) {
        val size = 84 * dp
        headPaint.textSize = size
        val fade = 1f - Motion.span(t, T_FADE.toFloat(), T_END)
        val base1 = height * 0.52f
        val base2 = base1 + size * 0.98f

        headPaint.color = ink
        headPaint.alpha = (255 * fade).toInt()
        drawRising(canvas, line1, left, base1, size, Motion.out.getInterpolation(Motion.span(t, T_LEMA, T_LEMA + 520f)))
        drawRising(canvas, line2, left, base2, size, Motion.out.getInterpolation(Motion.span(t, T_LEMA + 110f, T_LEMA + 630f)))

        // «a medida.» sobre la cinta, con los márgenes de `.mark` en la hoja de estilos de la marca.
        val head = line2.removeSuffix(markWords)
        val x0 = left + headPaint.measureText(head) - size * 0.06f
        val x1 = left + headPaint.measureText(line2) + size * 0.1f
        val wipe = Motion.inOut.getInterpolation(Motion.span(t, T_WIPE, T_WIPE_END))
        tapeRect.set(x0, base2 - size * 0.8f, Motion.lerp(x0, x1, wipe), base2 + size * 0.2f)
        if (wipe > 0f) {
            canvas.drawRect(tapeRect, tapePaint)
            val s = canvas.save()
            canvas.clipRect(tapeRect)
            headPaint.color = carbon
            headPaint.alpha = (255 * fade).toInt()
            canvas.drawText(line2, left, base2, headPaint)
            canvas.restoreToCount(s)
        }

        // Datos medidos en este equipo, no una frase de relleno.
        var x = left
        val y = height - 40 * dp
        status.forEachIndexed { i, (label, value) ->
            val from = T_WIPE + i * 130f
            val p = Motion.span(t, from, from + 340f)
            val l = label.take((label.length * p * 2f).toInt().coerceAtMost(label.length))
            val v = value.take((value.length * (p * 2f - 1f)).toInt().coerceIn(0, value.length))
            statusPaint.color = ink2
            statusPaint.alpha = (255 * fade).toInt()
            canvas.drawText(l, x, y, statusPaint)
            val lw = statusPaint.measureText(label) + 10 * dp
            statusPaint.color = ink
            statusPaint.alpha = (255 * fade).toInt()
            canvas.drawText(v, x + lw, y, statusPaint)
            x += lw + statusPaint.measureText(value) + 34 * dp
        }
    }

    /** Una línea que sube desde detrás de su propio renglón. */
    private fun drawRising(canvas: Canvas, text: String, x: Float, base: Float, size: Float, e: Float) {
        if (e <= 0f) return
        val s = canvas.save()
        canvas.clipRect(0f, base - size * 0.86f, width.toFloat(), base + size * 0.24f)
        canvas.drawText(text, x, base + (1f - e) * size * 1.1f, headPaint)
        canvas.restoreToCount(s)
    }

    private companion object {
        const val T_TRACE = 260f
        const val T_TRACE_END = 1120f
        const val T_FILL = 980f
        const val T_FILL_END = 1360f
        const val T_MOVE = 1360f
        const val T_MOVE_END = 1960f
        const val T_LETTERS = 1500f
        const val T_UP = 2400f
        const val T_UP_END = 2900f
        const val T_LEMA = 2600f
        const val T_WIPE = 3040f
        const val T_WIPE_END = 3440f
        const val T_FADE = 3660L
        const val T_END = 3860f
        const val T_REDUCED_START = 2400L
        const val T_MEASURE_FROM = 300f
        const val T_MEASURE_TO = 3400f
    }
}
