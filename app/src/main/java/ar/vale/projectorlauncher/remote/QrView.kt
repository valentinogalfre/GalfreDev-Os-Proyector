package ar.vale.projectorlauncher.remote

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import ar.vale.projectorlauncher.R
import kotlin.math.floor
import kotlin.math.min

/** El QR va siempre en carbón sobre hueso, con su margen: invertido, muchos celulares no lo leen. */
class QrView @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null) : View(context, attrs) {

    private val paper = context.getColor(R.color.hueso)
    private val ink = Paint().apply { color = context.getColor(R.color.carbon) }
    private var matrix: Qr.Matrix? = null

    fun show(text: String?) {
        matrix = text?.let(Qr::encode)
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        val m = matrix ?: return
        canvas.drawColor(paper)
        val cells = m.size + QUIET * 2
        val cell = floor(min(width, height).toFloat() / cells)
        val offset = (min(width, height) - cell * m.size) / 2
        for (y in 0 until m.size) {
            for (x in 0 until m.size) {
                if (m[x, y]) {
                    val left = offset + x * cell
                    val top = offset + y * cell
                    canvas.drawRect(left, top, left + cell, top + cell, ink)
                }
            }
        }
    }

    private companion object {
        const val QUIET = 4
    }
}
