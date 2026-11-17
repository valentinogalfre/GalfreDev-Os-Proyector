package ar.vale.projectorlauncher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import java.util.TimeZone

/**
 * La zona horaria de la casa. El proyector viene de fábrica con otra, y una app no puede cambiar
 * la del sistema: el launcher usa la del celular del dueño, que siempre está bien puesta.
 */
object Zone {
    private const val STORE = "galfre_launcher"
    private const val KEY = "zone"

    /** Al arrancar, y cada vez que el sistema avisa un cambio: Android vuelve a poner la suya. */
    fun install(context: Context) {
        apply(context)
        context.registerReceiver(object : BroadcastReceiver() {
            override fun onReceive(c: Context, intent: Intent) = apply(c)
        }, IntentFilter(Intent.ACTION_TIMEZONE_CHANGED))
    }

    /** False si la zona no existe. */
    fun set(context: Context, id: String): Boolean {
        if (!known(id)) return false
        context.getSharedPreferences(STORE, Context.MODE_PRIVATE).edit().putString(KEY, id).apply()
        TimeZone.setDefault(TimeZone.getTimeZone(id))
        return true
    }

    fun known(id: String): Boolean = id in TimeZone.getAvailableIDs()

    private fun apply(context: Context) {
        val id = context.getSharedPreferences(STORE, Context.MODE_PRIVATE).getString(KEY, null) ?: return
        if (known(id)) TimeZone.setDefault(TimeZone.getTimeZone(id))
    }
}
