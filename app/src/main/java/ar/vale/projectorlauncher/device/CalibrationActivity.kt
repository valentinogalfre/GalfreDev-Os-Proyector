package ar.vale.projectorlauncher.device

import ar.vale.projectorlauncher.Installed
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Bundle
import android.text.TextPaint
import android.view.KeyEvent
import android.view.View
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.sin

/**
 * Calibración de la imagen. Los proyectores chicos se ajustan a mano y a ojo: estas tres
 * pantallas muestran qué mirar. Izquierda y derecha cambian de carta; OK abre el trapecio si
 * el equipo lo tiene.
 */
class CalibrationActivity : GdActivity() {

    private lateinit var view: Chart
    private var keystone: Functions.Found? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        view = Chart(this)
        setContentView(view)
        Thread {
            val found = Installed.functions(applicationContext).firstOrNull { it.kind == Functions.Kind.KEYSTONE }
            runOnUiThread { keystone = found }
        }.start()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> view.step(-1)
            KeyEvent.KEYCODE_DPAD_RIGHT -> view.step(1)
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> keystone?.let {
                openExternal(it.intent, getString(R.string.fn_keystone))
            }
            else -> return super.onKeyDown(keyCode, event)
        }
        return true
    }

    private class Chart(context: Context) : View(context) {

        private enum class Card(val title: Int, val hint: Int) {
            FOCUS(R.string.cal_focus, R.string.cal_focus_hint),
            GEOMETRY(R.string.cal_geometry, R.string.cal_geometry_hint),
            LEVELS(R.string.cal_levels, R.string.cal_levels_hint)
        }

        private var card = Card.FOCUS
        private val dp = resources.displayMetrics.density
        private val ink = Color.WHITE
        private val line = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = ink
            style = Paint.Style.STROKE
        }
        private val fill = Paint(Paint.ANTI_ALIAS_FLAG)
        private val label = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            typeface = context.resources.getFont(R.font.geist_mono_medium)
            textSize = 12 * dp
            color = ink
            letterSpacing = 0.06f
        }
        private val hint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
            typeface = context.resources.getFont(R.font.instrument_sans)
            textSize = 16 * dp
            color = ink
        }

        fun step(delta: Int) {
            val cards = Card.values()
            card = cards[(card.ordinal + delta + cards.size) % cards.size]
            invalidate()
        }

        override fun onDraw(canvas: Canvas) {
            canvas.drawColor(Color.BLACK)
            when (card) {
                Card.FOCUS -> focus(canvas)
                Card.GEOMETRY -> geometry(canvas)
                Card.LEVELS -> levels(canvas)
            }
            val cards = Card.values()
            val title = "${context.getString(card.title)} ${card.ordinal + 1}/${cards.size}"
            drawPlate(canvas, title, context.getString(card.hint))
        }

        private fun drawPlate(canvas: Canvas, title: String, text: String) {
            val w = maxOf(label.measureText(title), hint.measureText(text)) + 28 * dp
            val h = 58 * dp
            val x = 56 * dp
            val y = height - 36 * dp - h
            fill.color = Color.BLACK
            canvas.drawRect(x, y, x + w, y + h, fill)
            canvas.drawText(title, x + 14 * dp, y + 22 * dp, label)
            canvas.drawText(text, x + 14 * dp, y + 44 * dp, hint)
        }

        /** Estrella de Siemens: las puntas se ven nítidas solo cuando el foco está bien. */
        private fun star(canvas: Canvas, cx: Float, cy: Float, r: Float) {
            fill.color = ink
            val rays = 36
            val path = android.graphics.Path()
            for (i in 0 until rays) {
                val a0 = (i * 2.0 * Math.PI / rays)
                val a1 = a0 + Math.PI / rays
                path.moveTo(cx, cy)
                path.lineTo(cx + (r * cos(a0)).toFloat(), cy + (r * sin(a0)).toFloat())
                path.lineTo(cx + (r * cos(a1)).toFloat(), cy + (r * sin(a1)).toFloat())
                path.close()
            }
            canvas.drawPath(path, fill)
        }

        private fun focus(canvas: Canvas) {
            val w = width.toFloat()
            val h = height.toFloat()
            star(canvas, w / 2, h / 2, min(w, h) * 0.34f)
            val small = min(w, h) * 0.1f
            val m = small + 20 * dp
            star(canvas, m, m, small)
            star(canvas, w - m, m, small)
            star(canvas, w - m, h - m, small)
        }

        private fun geometry(canvas: Canvas) {
            val w = width.toFloat()
            val h = height.toFloat()
            line.strokeWidth = maxOf(1f, dp * 0.75f)
            val cols = 16
            val rows = 9
            for (i in 0..cols) canvas.drawLine(w * i / cols, 0f, w * i / cols, h, line)
            for (i in 0..rows) canvas.drawLine(0f, h * i / rows, w, h * i / rows, line)
            line.strokeWidth = 3 * dp
            canvas.drawRect(1.5f * dp, 1.5f * dp, w - 1.5f * dp, h - 1.5f * dp, line)
            canvas.drawCircle(w / 2, h / 2, h * 0.44f, line)
            canvas.drawLine(0f, 0f, w, h, line)
            canvas.drawLine(w, 0f, 0f, h, line)
        }

        private fun levels(canvas: Canvas) {
            val w = width.toFloat()
            val h = height.toFloat()
            val colors = intArrayOf(
                Color.WHITE, Color.YELLOW, Color.CYAN, Color.GREEN, Color.MAGENTA, Color.RED, Color.BLUE, Color.BLACK
            )
            val top = h * 0.5f
            colors.forEachIndexed { i, c ->
                fill.color = c
                canvas.drawRect(w * i / colors.size, 0f, w * (i + 1) / colors.size, top, fill)
            }
            // Escalones casi negros y casi blancos: si se ven todos, brillo y contraste están bien.
            val steps = 16
            for (i in 0 until steps) {
                val v = i * 255 / (steps - 1)
                fill.color = Color.rgb(v, v, v)
                canvas.drawRect(w * i / steps, top, w * (i + 1) / steps, h * 0.75f, fill)
            }
            val low = intArrayOf(0, 4, 8, 12, 16, 20, 24, 28)
            low.forEachIndexed { i, v ->
                fill.color = Color.rgb(v, v, v)
                canvas.drawRect(w * i / low.size / 2, h * 0.75f, w * (i + 1) / low.size / 2, h, fill)
                val hi = 255 - v
                fill.color = Color.rgb(hi, hi, hi)
                canvas.drawRect(w / 2 + w * i / low.size / 2, h * 0.75f, w / 2 + w * (i + 1) / low.size / 2, h, fill)
            }
        }
    }
}
