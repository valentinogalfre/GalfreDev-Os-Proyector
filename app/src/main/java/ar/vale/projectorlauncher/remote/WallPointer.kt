package ar.vale.projectorlauncher.remote

import android.graphics.RectF
import android.os.Handler
import android.os.Looper
import ar.vale.projectorlauncher.ui.GdActivity

/**
 * El puntero que un celular mueve en la pared. En nuestras pantallas es la cinta: un bloque chico
 * que sigue al dedo, y sigue habiendo una sola. Sobre otra app la cinta no existe, y lo dibuja el
 * control total.
 */
object WallPointer {

    private const val SIZE_DP = 22
    private const val TIMEOUT_MS = 2500L
    private val main = Handler(Looper.getMainLooper())
    private var pointerX = 0f
    private var pointerY = 0f
    private val hide = Runnable {
        GdActivity.current?.tape?.unpin()
        RemoteAccessibility.instance?.hideCursor()
    }

    fun move(x: Float, y: Float, visible: Boolean) {
        main.post {
            main.removeCallbacks(hide)
            if (!visible) {
                hide.run()
                return@post
            }
            val activity = GdActivity.current
            if (activity != null) pin(activity, x, y) else RemoteAccessibility.instance?.showCursor(x, y)
            main.postDelayed(hide, TIMEOUT_MS)
        }
    }

    private fun pin(activity: GdActivity, x: Float, y: Float) {
        pointerX = x
        pointerY = y
        val half = activity.resources.displayMetrics.density * SIZE_DP / 2
        val tape = activity.tape
        tape.pin(knockout = false) {
            val cx = pointerX * tape.width
            val cy = pointerY * tape.height
            RectF(cx - half, cy - half, cx + half, cy + half)
        }
    }
}
