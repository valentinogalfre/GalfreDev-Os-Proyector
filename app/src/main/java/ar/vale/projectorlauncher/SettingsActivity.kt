package ar.vale.projectorlauncher

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Switch
import android.widget.TextView

/** Ajustes del launcher: app principal, arranque automático, orden y pantalla de inicio. */
class SettingsActivity : Activity() {

    private lateinit var prefs: Prefs

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = Prefs(this)
        setContentView(R.layout.activity_settings)

        val boot = findViewById<Switch>(R.id.sw_boot)
        val usage = findViewById<Switch>(R.id.sw_usage)
        boot.isChecked = prefs.autoLaunchOnBoot
        usage.isChecked = prefs.sortByUsage
        boot.setOnCheckedChangeListener { _, c -> prefs.autoLaunchOnBoot = c }
        usage.setOnCheckedChangeListener { _, c -> prefs.sortByUsage = c }

        findViewById<View>(R.id.row_primary).setOnClickListener { pickPrimary() }
        findViewById<View>(R.id.row_default).setOnClickListener { openHomeSettings() }
        findViewById<View>(R.id.btn_back).setOnClickListener { finish() }

        refreshPrimaryLabel()
    }

    private fun refreshPrimaryLabel() {
        findViewById<TextView>(R.id.primary_value).text =
            prefs.primaryPkg?.let { labelFor(it) } ?: getString(R.string.none)
    }

    private fun labelFor(pkg: String): String = runCatching {
        packageManager.getApplicationLabel(packageManager.getApplicationInfo(pkg, 0)).toString()
    }.getOrDefault(pkg)

    private fun pickPrimary() {
        val apps = AppRepository.loadApps(this)
        if (apps.isEmpty()) return
        val labels = apps.map { it.label }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle(R.string.pick_primary)
            .setItems(labels) { _, which ->
                prefs.primaryPkg = apps[which].packageName
                refreshPrimaryLabel()
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun openHomeSettings() {
        runCatching { startActivity(Intent(Settings.ACTION_HOME_SETTINGS)) }
            .onFailure { runCatching { startActivity(Intent(Settings.ACTION_SETTINGS)) } }
    }
}
