package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import android.view.animation.AnimationUtils
import ar.vale.projectorlauncher.R

/**
 * Filete que barre de lado a lado mientras algo está en curso y no se sabe cuánto falta.
 * Va en tinta, igual que [LineProgress]: la cinta es una sola y no indica estados.
 * Solo se redibuja mientras [running] es true y la vista está a la vista.
 */
class SweepLine @JvmOverloads constructor(context: Context, attrs: AttributeSet? = null) : View(context, attrs) {

    private val track = Paint().apply { color = context.getColor(R.color.rule) }
    private val line = Paint().apply { color = context.getColor(R.color.ink) }
    private var started = 0L

    var running = false
        set(value) {
            if (field == value) return
            field = value
            started = AnimationUtils.currentAnimationTimeMillis()
            invalidate()
        }

    override fun onDraw(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        canvas.drawRect(0f, 0f, w, h, track)
        if (!running) return
        if (!Motion.full) {
            canvas.drawRect(0f, 0f, w * SEGMENT, h, line)
            return
        }
        val t = ((AnimationUtils.currentAnimationTimeMillis() - started) % PERIOD_MS) / PERIOD_MS.toFloat()
        val eased = Motion.inOut.getInterpolation(t)
        val left = Motion.lerp(-w * SEGMENT, w, eased)
        canvas.drawRect(left.coerceAtLeast(0f), 0f, (left + w * SEGMENT).coerceAtMost(w), h, line)
        postInvalidateOnAnimation()
    }

    private companion object {
        const val PERIOD_MS = 1500L
        const val SEGMENT = 0.22f
    }
}
