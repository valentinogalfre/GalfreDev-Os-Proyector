package ar.vale.projectorlauncher.ui

import android.animation.TimeInterpolator
import android.view.View
import android.view.ViewGroup
import android.view.animation.PathInterpolator
import ar.vale.projectorlauncher.Prefs

/**
 * Lenguaje de movimiento de la marca: preciso y decidido. Nada rebota; todo llega y se queda.
 *
 * El nivel se ajusta solo: el arranque mide cuadros reales en este equipo y, si el
 * hardware no llega, pasa a [Level.REDUCED]. Medimos antes de prometer.
 */
object Motion {

    enum class Level { FULL, REDUCED }

    /** Salida decidida: arranca rápido y se apoya. Es la curva por defecto de todo el sistema. */
    val out: TimeInterpolator = PathInterpolator(0.2f, 0f, 0f, 1f)

    /** Para lo que cruza la pantalla entera. */
    val inOut: TimeInterpolator = PathInterpolator(0.7f, 0f, 0.15f, 1f)

    const val FAST = 140L
    const val BASE = 260L
    const val SLOW = 420L

    /** Por debajo de este ritmo (~30 cuadros por segundo) las animaciones pesadas se apagan. */
    private const val MAX_FRAME_MS = 34f

    @Volatile
    var level: Level = Level.FULL
        private set

    val full: Boolean get() = level == Level.FULL

    /**
     * Aplica la preferencia y la última medición. Se llama al crear cada pantalla.
     *
     * No se usa `isLowRamDevice`: los proyectores H713/H726 lo reportan siempre en true (1 GB de
     * RAM), así que dejaría a todos en modo reducido sin haber medido nada.
     */
    fun load(prefs: Prefs) {
        level = when (prefs.motion) {
            Prefs.MOTION_FULL -> Level.FULL
            Prefs.MOTION_REDUCED -> Level.REDUCED
            else -> if (prefs.measuredFrameMs > MAX_FRAME_MS) Level.REDUCED else Level.FULL
        }
    }

    /** Fracción 0..1 de [t] entre [a] y [b]. */
    fun span(t: Float, a: Float, b: Float): Float =
        if (b <= a) (if (t >= b) 1f else 0f) else ((t - a) / (b - a)).coerceIn(0f, 1f)

    fun lerp(a: Float, b: Float, t: Float): Float = a + (b - a) * t

    /** Entrada editorial: cada bloque sube un poco y aparece, uno detrás de otro. */
    fun reveal(views: List<View>, delay: Long = 0L, stagger: Long = 45L, rise: Float = 18f) {
        val density = views.firstOrNull()?.resources?.displayMetrics?.density ?: 1f
        views.forEachIndexed { i, v ->
            v.animate().cancel()
            if (!full) {
                v.alpha = 1f
                v.translationY = 0f
                return@forEachIndexed
            }
            v.alpha = 0f
            v.translationY = rise * density
            val animation = v.animate()
                .alpha(1f)
                .translationY(0f)
                .setStartDelay(delay + i * stagger)
                .setDuration(SLOW)
                .setInterpolator(out)
            // Un contenedor a medio transparentar se vuelve a dibujar entero en cada cuadro. Con su
            // propia capa se dibuja una vez y se mueve la capa. Un texto solo no lo necesita.
            if (v is ViewGroup) animation.withLayer()
            animation.start()
        }
    }
}
