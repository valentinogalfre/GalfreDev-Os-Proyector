package ar.vale.projectorlauncher

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.provider.Settings
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import java.net.Inet4Address

/**
 * Centro de ajustes + red: accesos grandes navegables por control remoto a los
 * ajustes del sistema, y estado de la conexión (tipo + IP) a la vista.
 */
class SettingsHubActivity : Activity() {

    private class Entry(val icon: Int, val label: Int, val open: (SettingsHubActivity) -> Unit)

    private val entries: List<Entry> = listOf(
        Entry(R.drawable.ic_wifi, R.string.q_wifi) { it.openSystem(Settings.ACTION_WIFI_SETTINGS) },
        Entry(R.drawable.ic_bluetooth, R.string.q_bt) { it.openSystem(Settings.ACTION_BLUETOOTH_SETTINGS) },
        Entry(R.drawable.ic_display, R.string.q_display) { it.openSystem(Settings.ACTION_DISPLAY_SETTINGS) },
        Entry(R.drawable.ic_sound, R.string.q_sound) { it.openSystem(Settings.ACTION_SOUND_SETTINGS) },
        Entry(R.drawable.ic_time, R.string.hub_datetime) { it.openSystem(Settings.ACTION_DATE_SETTINGS) },
        Entry(R.drawable.ic_globe, R.string.hub_language) { it.openSystem(Settings.ACTION_LOCALE_SETTINGS) },
        Entry(R.drawable.ic_storage, R.string.hub_storage) { it.openSystem(Settings.ACTION_INTERNAL_STORAGE_SETTINGS) },
        Entry(R.drawable.ic_apps, R.string.hub_apps) { it.openSystem(Settings.ACTION_APPLICATION_SETTINGS) },
        Entry(R.drawable.ic_home, R.string.hub_home) { it.openSystem(Settings.ACTION_HOME_SETTINGS) },
        Entry(R.drawable.ic_launcher_mark, R.string.hub_launcher) {
            it.startActivity(Intent(it, SettingsActivity::class.java))
        },
        Entry(R.drawable.ic_info, R.string.hub_about) { it.openSystem(Settings.ACTION_DEVICE_INFO_SETTINGS) },
        Entry(R.drawable.ic_system, R.string.hub_all) { it.openSystem(Settings.ACTION_SETTINGS) },
    )

    private lateinit var netStatus: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings_hub)
        netStatus = findViewById(R.id.net_status)
        val grid = findViewById<GridView>(R.id.hub_grid)
        grid.adapter = TileAdapter()
        grid.setOnItemClickListener { _, _, pos, _ -> entries[pos].open(this) }
        grid.requestFocus()
    }

    override fun onResume() {
        super.onResume()
        netStatus.text = netSummary()
    }

    private fun openSystem(action: String) {
        runCatching { startActivity(Intent(action)) }
            .onFailure { runCatching { startActivity(Intent(Settings.ACTION_SETTINGS)) } }
    }

    private fun netSummary(): String {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            ?: return getString(R.string.net_off)
        val net = cm.activeNetwork ?: return getString(R.string.net_off)
        val caps = cm.getNetworkCapabilities(net) ?: return getString(R.string.net_off)
        val type = when {
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> getString(R.string.net_wifi)
            caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> getString(R.string.net_ethernet)
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> getString(R.string.net_data)
            else -> getString(R.string.net_other)
        }
        val ip = cm.getLinkProperties(net)?.linkAddresses
            ?.firstOrNull { it.address is Inet4Address }?.address?.hostAddress
        return if (ip != null) "$type   •   IP $ip" else type
    }

    private inner class TileAdapter : BaseAdapter() {
        override fun getCount() = entries.size
        override fun getItem(position: Int) = entries[position]
        override fun getItemId(position: Int) = position.toLong()

        override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
            val v = convertView
                ?: LayoutInflater.from(this@SettingsHubActivity).inflate(R.layout.tile_setting, parent, false)
            val e = entries[position]
            v.findViewById<ImageView>(R.id.tile_icon).setImageResource(e.icon)
            v.findViewById<TextView>(R.id.tile_label).setText(e.label)
            return v
        }
    }
}
