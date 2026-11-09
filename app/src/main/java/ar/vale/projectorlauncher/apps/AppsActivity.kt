package ar.vale.projectorlauncher.apps

import ar.vale.projectorlauncher.Installed
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import ar.vale.projectorlauncher.AppInfo
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Keyboard
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Sheet
import java.util.Locale

/** Todas las apps, con búsqueda por el teclado en pantalla y opciones por app. */
class AppsActivity : GdActivity() {

    private lateinit var grid: GridView
    private lateinit var search: TextView
    private val adapter = TileAdapter()
    private var all: List<AppInfo> = emptyList()
    private var query = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_grid)
        grid = findViewById(R.id.screen_grid)
        search = findViewById(R.id.search_row)
        grid.adapter = adapter
        grid.setOnItemClickListener { _, _, position, _ -> launch(adapter.getItem(position)) }
        grid.setOnItemLongClickListener { _, _, position, _ ->
            showOptions(adapter.getItem(position))
            true
        }
        search.setOnClickListener {
            Keyboard.show(this, getString(R.string.apps_search), query, onChange = ::filter) { filter(it) }
        }
        setHead(getString(R.string.word_apps))
        renderSearch()
    }

    /**
     * La grilla arranca con la lista que ya cargó el inicio, así la cinta no se destapa sobre una
     * pantalla vacía. Solo se vuelve a leer del sistema si se instaló o se sacó algo.
     */
    override fun onResume() {
        super.onResume()
        val ready = Installed.apps()
        if (ready != null) {
            loaded = Installed.version
            all = AppRepository.ordered(ready, prefs)
            filter(query)
        }
        if (ready == null || loaded != Installed.version) load()
    }

    private var loaded = -1

    private fun load() {
        Thread {
            val version = Installed.version
            val list = AppRepository.ordered(Installed.loadApps(applicationContext), prefs)
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                loaded = version
                all = list
                filter(query)
            }
        }.start()
    }

    private fun filter(text: String) {
        query = text
        val q = text.trim().lowercase(Locale.ROOT)
        adapter.submit(if (q.isEmpty()) all else all.filter { it.label.lowercase(Locale.ROOT).contains(q) })
        setHead(getString(R.string.word_apps), resources.getQuantityString(R.plurals.home_apps_label, adapter.count, adapter.count))
        renderSearch()
    }

    private fun renderSearch() {
        search.text = query.ifBlank { getString(R.string.apps_search) }
    }

    private fun launch(app: AppInfo) {
        val intent = AppRepository.launchIntent(packageManager, app.packageName)
        if (intent == null) {
            Notice.show(this, getString(R.string.cant_open), Notice.Kind.ERROR)
            return
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        prefs.incrementUsage(app.packageName)
        openExternal(intent, app.label) { Notice.show(this, getString(R.string.cant_open), Notice.Kind.ERROR) }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        if (keyCode == KeyEvent.KEYCODE_MENU) {
            val app = grid.selectedItem as? AppInfo
            if (app != null) {
                showOptions(app)
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }

    private fun showOptions(app: AppInfo) = AppOptions.show(this, app) { load() }

    private inner class TileAdapter : BaseAdapter() {
        private var items: List<AppInfo> = emptyList()

        fun submit(apps: List<AppInfo>) {
            items = apps
            notifyDataSetChanged()
        }

        override fun getCount() = items.size
        override fun getItem(position: Int) = items[position]
        override fun getItemId(position: Int) = position.toLong()

        override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
            val view = convertView ?: LayoutInflater.from(parent.context)
                .inflate(R.layout.item_tile, parent, false).apply {
                    // En una grilla el foco lo lleva la grilla, no cada celda.
                    isFocusable = false
                    isClickable = false
                }
            bindTile(view, items[position])
            return view
        }
    }

    companion object {
        /** Carga el arte y el nombre de [app] en una celda. */
        fun bindTile(tile: View, app: AppInfo) {
            val banner = tile.findViewById<ImageView>(R.id.tile_banner)
            val icon = tile.findViewById<ImageView>(R.id.tile_icon)
            if (app.banner != null) {
                banner.setImageDrawable(app.banner)
                banner.visibility = View.VISIBLE
                icon.visibility = View.GONE
            } else {
                banner.visibility = View.GONE
                icon.visibility = View.VISIBLE
                icon.setImageDrawable(app.icon)
            }
            tile.findViewById<TextView>(R.id.tape_anchor).text = app.label
        }
    }
}

/** Opciones de una app: las mismas desde el inicio y desde la lista completa. */
object AppOptions {
    fun show(activity: GdActivity, app: AppInfo, changed: () -> Unit) {
        val prefs = activity.prefs
        val isPrimary = app.packageName == prefs.primaryPkg
        val isFavorite = prefs.isFavorite(app.packageName)
        Sheet.show(activity, app.label, listOf(
            Sheet.Option(activity.getString(if (isPrimary) R.string.unset_primary else R.string.set_primary), R.drawable.ic_home) {
                prefs.primaryPkg = if (isPrimary) null else app.packageName
                changed()
            },
            Sheet.Option(activity.getString(if (isFavorite) R.string.unfavorite else R.string.favorite), R.drawable.ic_star) {
                prefs.toggleFavorite(app.packageName)
                changed()
            },
            Sheet.Option(activity.getString(R.string.app_info), R.drawable.ic_info) {
                activity.openExternal(
                    Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:${app.packageName}")),
                    app.label
                )
            },
            Sheet.Option(activity.getString(R.string.uninstall), R.drawable.ic_trash) {
                @Suppress("DEPRECATION")
                activity.openExternal(Intent(Intent.ACTION_UNINSTALL_PACKAGE, Uri.parse("package:${app.packageName}")), null)
            }
        ))
    }
}
