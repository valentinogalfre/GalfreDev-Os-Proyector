package ar.vale.projectorlauncher.device

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings

/**
 * Pantallas del sistema, solo si existen. En estos proyectores es común que `ACTION_SETTINGS` no
 * resuelva y que algunas pantallas no estén, así que nunca se ofrece algo sin comprobarlo.
 * `ACTION_SOUND_SETTINGS` se evita a propósito: en varios firmwares cierra los ajustes de golpe,
 * por eso el volumen se maneja desde el sistema con AudioManager.
 */
object SystemScreens {

    fun wifi(c: Context) = first(c, Intent(Settings.ACTION_WIFI_SETTINGS), tv("com.android.tv.settings.connectivity.NetworkActivity"), tv("com.android.tv.settings.uicustom.func.net.wireless.WifiActivity"))
    fun bluetooth(c: Context) = first(c, Intent(Settings.ACTION_BLUETOOTH_SETTINGS), tv("com.android.tv.settings.accessories.AddAccessoryActivity"))
    fun display(c: Context) = first(c, Intent(Settings.ACTION_DISPLAY_SETTINGS))
    fun date(c: Context) = first(c, Intent(Settings.ACTION_DATE_SETTINGS), tv("com.android.tv.settings.system.DateTimeActivity"))
    fun language(c: Context) = first(c, Intent(Settings.ACTION_LOCALE_SETTINGS), tv("com.android.tv.settings.system.LanguageActivity"))
    fun storage(c: Context) = first(c, Intent(Settings.ACTION_INTERNAL_STORAGE_SETTINGS))
    fun apps(c: Context) = first(c, Intent(Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS), tv("com.android.tv.settings.device.apps.AppsActivity"))
    fun accessibility(c: Context) = first(c, Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS), tv("com.android.tv.settings.accessibility.AccessibilityActivity"))

    /** El inicio de algunos firmwares esconde estas dos, y sin ellas no se puede activar ADB. */
    fun about(c: Context) = first(c, Intent(Settings.ACTION_DEVICE_INFO_SETTINGS), tv("com.android.tv.settings.about.AboutActivity"))
    fun developer(c: Context) = first(c, Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS), tv("com.android.tv.settings.system.development.DevelopmentActivity"))

    /** Los ajustes completos, por la puerta que tenga este equipo. */
    fun all(c: Context): Intent? {
        val pm = c.packageManager
        return first(c, Intent(Settings.ACTION_SETTINGS))
            ?: SETTINGS_APPS.firstNotNullOfOrNull { pkg ->
                pm.getLaunchIntentForPackage(pkg) ?: pm.getLeanbackLaunchIntentForPackage(pkg)
            }
    }

    private fun tv(activity: String) =
        Intent().setComponent(ComponentName("com.android.tv.settings", activity))

    /** La primera que este equipo pueda abrir de verdad. */
    fun first(c: Context, vararg candidates: Intent): Intent? =
        candidates.firstOrNull { intent ->
            c.packageManager.resolveActivity(intent, 0)?.activityInfo?.exported == true
        }

    private val SETTINGS_APPS = listOf("com.android.tv.settings", "com.android.settings", "com.htc.htcsettings")
}
