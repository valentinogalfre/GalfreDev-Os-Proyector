package ar.vale.projectorlauncher.store

import ar.vale.projectorlauncher.Installed
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.ListView
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.media.CineActivity
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Row
import ar.vale.projectorlauncher.ui.RowAdapter
import ar.vale.projectorlauncher.ui.Sheet
import ar.vale.projectorlauncher.ui.bindRows

/**
 * Tienda: apps que sirven para un proyector, bajadas siempre de su fuente oficial.
 * Primero lo que importa en este equipo; al final, con honestidad, lo que no se puede instalar.
 */
class StoreActivity : GdActivity() {

    private lateinit var catalog: Catalog
    private lateinit var adapter: RowAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_list)
        catalog = Catalog.load(this)
        adapter = RowAdapter(this)
        findViewById<ListView>(R.id.screen_list).bindRows(adapter)
        setHead(getString(R.string.word_tienda), getString(R.string.store_data, catalog.apps.size, catalog.reviewed))
        Thread { Downloader.clean(applicationContext) }.start()
    }

    override fun onResume() {
        super.onResume()
        render()
    }

    private fun installed(pkg: String): String? =
        runCatching { packageManager.getPackageInfo(pkg, 0).versionName ?: "" }.getOrNull()

    private fun render() {
        val everything = Installed.packages(this)
        val present = (catalog.apps.flatMap { it.replaces + it.legacy + it.packageName } +
            catalog.notOffered.flatMap { it.packages }).filter { it in everything }.toSet()
        val rows = ArrayList<Row>()

        val legacy = Recommendations.legacy(catalog, present)
        if (legacy.isNotEmpty()) {
            rows.add(Row.header(getString(R.string.store_security)))
            legacy.forEach { item ->
                rows.add(Row(
                    getString(R.string.store_legacy_title, item.app.name),
                    subtitle = getString(R.string.store_legacy_sub),
                    icon = R.drawable.ic_shield
                ) { showLegacy(item) })
            }
        }

        val upgrades = Recommendations.upgrades(catalog, present)
        if (upgrades.isNotEmpty()) {
            rows.add(Row.header(getString(R.string.store_for_you)))
            upgrades.forEach { rows.add(rowFor(it.app, present, getString(R.string.store_better_than, labelOf(it.instead)))) }
        }

        catalog.categories.forEach { category ->
            val apps = catalog.apps.filter { it.category == category.id && upgrades.none { u -> u.app == it } }
            if (apps.isEmpty()) return@forEach
            rows.add(Row.header(category.name))
            apps.forEach { rows.add(rowFor(it, present, it.summary)) }
        }

        rows.add(Row.header(getString(R.string.store_own)))
        rows.add(Row(getString(R.string.apk_title), subtitle = getString(R.string.store_apk_sub), icon = R.drawable.ic_install) {
            openScreen(Intent(this, CineActivity::class.java).putExtra(CineActivity.EXTRA_APK_ONLY, true), getString(R.string.apk_title))
        })

        rows.add(Row.header(getString(R.string.store_not_offered)))
        catalog.notOffered.forEach { item ->
            val has = item.packages.any { it in present }
            rows.add(Row(
                item.name,
                value = if (has) getString(R.string.store_installed) else null,
                icon = R.drawable.ic_info
            ) { Sheet.show(this, item.name, listOf(Sheet.Option(getString(R.string.back)) {}), item.reason) })
        }
        adapter.submit(rows)
    }

    private fun labelOf(pkg: String): CharSequence =
        runCatching { packageManager.getApplicationLabel(packageManager.getApplicationInfo(pkg, 0)) }.getOrDefault(pkg)

    private fun rowFor(app: CatalogApp, present: Set<String>, subtitle: String): Row {
        val tooOld = Build.VERSION.SDK_INT < app.minSdk
        val value = when {
            app.packageName in present -> getString(R.string.store_installed)
            tooOld -> getString(R.string.store_incompatible)
            else -> null
        }
        return Row(app.name, subtitle = subtitle, value = value, icon = iconOf(app)) {
            openScreen(
                Intent(this, StoreDetailActivity::class.java).putExtra(StoreDetailActivity.EXTRA_ID, app.id),
                app.name
            )
        }
    }

    private fun iconOf(app: CatalogApp): Int = when (app.category) {
        "video", "players" -> R.drawable.ic_video
        "web" -> R.drawable.ic_globe
        "files" -> R.drawable.ic_folder
        "server" -> R.drawable.ic_storage
        "cast" -> R.drawable.ic_projector
        "stores" -> R.drawable.ic_store
        else -> R.drawable.ic_system
    }

    private fun showLegacy(item: Recommendations.Legacy) {
        Sheet.show(this, getString(R.string.store_legacy_title, item.app.name), listOf(
            Sheet.Option(getString(R.string.uninstall), R.drawable.ic_trash) {
                @Suppress("DEPRECATION")
                openExternal(Intent(Intent.ACTION_UNINSTALL_PACKAGE, Uri.parse("package:${item.packageName}")), null)
            },
            Sheet.Option(getString(R.string.back)) {}
        ), item.app.legacyReason)
    }
}
