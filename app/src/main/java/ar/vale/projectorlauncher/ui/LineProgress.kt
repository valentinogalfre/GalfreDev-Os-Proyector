package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import ar.vale.projectorlauncher.R

/**
 * Filete de progreso. Va en tinta y no en cinta: el manual reserva la cinta para un solo
 * elemento por pieza y prohíbe que signifique estado.
 */
class LineProgress @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null) : View(context, attrs) {

    private val track = Paint().apply { color = context.getColor(R.color.borde_control_oscuro) }
    private val line = Paint().apply { color = context.getColor(R.color.hueso) }

    var value: Float = 0f
        set(v) {
            field = v.coerceIn(0f, 1f)
            invalidate()
        }

    /** En el tema de la pantalla en vez de los colores fijos del reproductor. */
    fun useTheme() {
        track.color = context.getColor(R.color.rule)
        line.color = context.getColor(R.color.ink)
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        canvas.drawRect(0f, 0f, w, h, track)
        canvas.drawRect(0f, 0f, w * value, h, line)
    }
}
