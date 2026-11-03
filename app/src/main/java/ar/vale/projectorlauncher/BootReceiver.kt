package ar.vale.projectorlauncher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Automatización: marca que, al mostrarse la pantalla de inicio después de
 * encender, hay que abrir la app principal. No lanzamos la actividad desde el
 * receiver: en Android 10+ el arranque de actividades desde segundo plano está
 * restringido y el proceso del receiver puede morir apenas vuelve onReceive().
 * El disparo real lo hace LauncherActivity —ya en primer plano— al crearse.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        val prefs = Prefs(context)
        if (prefs.autoLaunchOnBoot && prefs.primaryPkg != null) {
            prefs.pendingBootLaunch = true
        }
    }
}
