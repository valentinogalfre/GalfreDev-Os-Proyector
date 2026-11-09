package ar.vale.projectorlauncher.ui

import android.content.Context
import android.content.res.Configuration
import android.graphics.Point
import android.hardware.display.DisplayManager
import android.view.Display
import ar.vale.projectorlauncher.Prefs
import java.util.Calendar
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

/**
 * Lienzo fijo de 960 dp de ancho para cualquier panel.
 *
 * Estos proyectores reportan densidades que no tienen relación con su pantalla (un
 * panel de 1280 x 720 puede decir 160, 213 o 240 dpi), así que un layout en dp normales
 * se vería distinto en cada equipo. Forzando la densidad a partir del ancho real, la
 * composición es idéntica en 720p, 1080p o 4K: es la misma pieza, solo cambia la resolución.
 */
object Screen {

    const val CANVAS_DP = 960f

    fun wrap(base: Context): Context {
        val cfg = Configuration(base.resources.configuration)
        val size = realSize(base)
        val longSide = max(size.x, size.y)
        if (longSide > 0) {
            val dpi = (longSide * 160f / CANVAS_DP).roundToInt().coerceAtLeast(120)
            cfg.densityDpi = dpi
            cfg.screenWidthDp = (size.x * 160f / dpi).toInt()
            cfg.screenHeightDp = (size.y * 160f / dpi).toInt()
            cfg.smallestScreenWidthDp = min(cfg.screenWidthDp, cfg.screenHeightDp)
        }
        cfg.fontScale = 1f
        val night = isNight(Prefs(base).theme)
        cfg.uiMode = (cfg.uiMode and Configuration.UI_MODE_NIGHT_MASK.inv()) or
            (if (night) Configuration.UI_MODE_NIGHT_YES else Configuration.UI_MODE_NIGHT_NO)
        return base.createConfigurationContext(cfg)
    }

    /** Resolución real del panel en píxeles (lo que el sistema dice, sin barras). */
    fun realSize(context: Context): Point {
        val point = Point()
        // En attachBaseContext el contexto base apunta a una actividad todavía sin adjuntar y
        // DisplayManager revienta contra ella: hay que pedirlo por el contexto de la aplicación.
        val app = context.applicationContext ?: context
        val dm = app.getSystemService(Context.DISPLAY_SERVICE) as? DisplayManager
        @Suppress("DEPRECATION")
        dm?.getDisplay(Display.DEFAULT_DISPLAY)?.getRealSize(point)
        return point
    }

    /** Si el tema que debería verse ya no es el de esta pantalla, hay que recrearla. */
    fun themeChanged(context: Context): Boolean {
        val shown = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        return (shown == Configuration.UI_MODE_NIGHT_YES) != isNight(Prefs(context).theme)
    }

    private fun isNight(theme: String): Boolean = when (theme) {
        Prefs.THEME_DAY -> false
        Prefs.THEME_AUTO -> Calendar.getInstance().get(Calendar.HOUR_OF_DAY).let { it >= 19 || it < 8 }
        else -> true
    }
}
