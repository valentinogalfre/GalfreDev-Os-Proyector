package ar.vale.projectorlauncher.ui

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.provider.Settings
import ar.vale.projectorlauncher.R

/** Datos reales del equipo que muestra el sistema. */
object Device {

    /** Identifica este encendido; -1 si el sistema no lleva la cuenta. */
    fun bootCount(context: Context): Int =
        Settings.Global.getInt(context.contentResolver, Settings.Global.BOOT_COUNT, -1)

    private fun caps(context: Context): NetworkCapabilities? {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return null
        return cm.getNetworkCapabilities(cm.activeNetwork)
    }

    fun isOnline(context: Context): Boolean =
        caps(context)?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true

    /** Nombre corto de la conexión actual. */
    fun networkLabel(context: Context): String {
        val c = caps(context) ?: return context.getString(R.string.net_off)
        return when {
            !c.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) -> context.getString(R.string.net_off)
            c.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> context.getString(R.string.net_ethernet)
            c.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> context.getString(R.string.net_wifi)
            c.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> context.getString(R.string.net_data)
            else -> context.getString(R.string.net_other)
        }
    }
}
