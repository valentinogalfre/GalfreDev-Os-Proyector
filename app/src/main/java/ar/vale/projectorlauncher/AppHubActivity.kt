package ar.vale.projectorlauncher

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.GridView
import android.widget.TextView
import android.widget.Toast

/**
 * Hub de apps: baldosas grandes para ver desde el sillón, con favoritos y lo más
 * usado primero. OK abre; mantener apretado marca/desmarca favorito.
 */
class AppHubActivity : Activity() {

    private lateinit var prefs: Prefs
    private lateinit var grid: GridView
    private lateinit var empty: TextView
    private lateinit var adapter: HubTileAdapter
    private val apps = ArrayList<AppInfo>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = Prefs(this)
        setContentView(R.layout.activity_app_hub)
        grid = findViewById(R.id.hub_apps_grid)
        empty = findViewById(R.id.hub_apps_empty)
        adapter = HubTileAdapter(this)
        grid.adapter = adapter
        grid.setOnItemClickListener { _, _, pos, _ -> launch(apps[pos]) }
        grid.setOnItemLongClickListener { _, _, pos, _ ->
            prefs.toggleFavorite(apps[pos].packageName)
            refresh()
            true
        }
        Thread {
            val loaded = AppRepository.loadApps(this)
            runOnUiThread {
                apps.clear()
                apps.addAll(loaded)
                refresh()
                grid.requestFocus()
            }
        }.start()
    }

    override fun onResume() {
        super.onResume()
        if (apps.isNotEmpty()) refresh()
    }

    private fun refresh() {
        val favs = prefs.favorites
        apps.sortWith(
            compareByDescending<AppInfo> { favs.contains(it.packageName) }
                .thenByDescending { if (prefs.sortByUsage) prefs.usageCount(it.packageName) else 0 }
                .thenBy { it.label.lowercase() }
        )
        adapter.setItems(apps, favs)
        empty.visibility = if (apps.isEmpty()) View.VISIBLE else View.GONE
    }

    private fun launch(app: AppInfo) {
        val i = AppRepository.launchIntent(packageManager, app.packageName)
        if (i == null) {
            Toast.makeText(this, R.string.cant_open, Toast.LENGTH_SHORT).show()
            return
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        prefs.incrementUsage(app.packageName)
        runCatching { startActivity(i) }
            .onFailure { Toast.makeText(this, R.string.cant_open, Toast.LENGTH_SHORT).show() }
    }
}
