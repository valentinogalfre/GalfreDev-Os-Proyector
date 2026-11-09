package ar.vale.projectorlauncher

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo

/** Lee del sistema las apps lanzables: comunes (LAUNCHER) y de Android TV (LEANBACK_LAUNCHER). */
object AppRepository {

    fun loadApps(ctx: Context): List<AppInfo> {
        val pm = ctx.packageManager
        val apps = ArrayList<AppInfo>()
        for (ri in launchable(ctx)) {
            val pkg = ri.activityInfo.packageName
            val label = runCatching { ri.loadLabel(pm).toString() }.getOrDefault(pkg)
            val icon = runCatching { ri.loadIcon(pm) }.getOrNull() ?: continue
            val banner = runCatching { ri.activityInfo.loadBanner(pm) }.getOrNull()
            apps.add(AppInfo(label, pkg, icon, banner))
        }
        apps.sortBy { it.label.lowercase() }
        return apps
    }

    /** Nombre y paquete, sin cargar íconos: con 1 GB de RAM, la lista del celular no los necesita. */
    fun names(ctx: Context): List<Pair<String, String>> {
        val pm = ctx.packageManager
        return launchable(ctx)
            .map { ri ->
                val pkg = ri.activityInfo.packageName
                runCatching { ri.loadLabel(pm).toString() }.getOrDefault(pkg) to pkg
            }
            .sortedBy { it.first.lowercase() }
    }

    fun launchablePackages(ctx: Context): Set<String> = launchable(ctx).map { it.activityInfo.packageName }.toSet()

    private fun launchable(ctx: Context): List<ResolveInfo> {
        val seen = HashSet<String>()
        val found = ArrayList<ResolveInfo>()
        // En proyectores con Android TV, Netflix/YouTube y otras suelen declarar SOLO la
        // categoría leanback: si no la consultamos, no aparecen en ninguna grilla.
        for (category in listOf(Intent.CATEGORY_LAUNCHER, Intent.CATEGORY_LEANBACK_LAUNCHER)) {
            val intent = Intent(Intent.ACTION_MAIN).addCategory(category)
            for (ri in ctx.packageManager.queryIntentActivities(intent, 0)) {
                val pkg = ri.activityInfo.packageName
                if (pkg == ctx.packageName) continue          // no listarnos a nosotros mismos
                if (seen.add(pkg)) found.add(ri)              // una entrada por paquete
            }
        }
        return found
    }

    /** Orden del sistema: favoritas primero, después por uso (si está activo) y por nombre. */
    fun ordered(apps: List<AppInfo>, prefs: Prefs): List<AppInfo> {
        val favs = prefs.favorites
        val byUsage = prefs.sortByUsage
        return apps.sortedWith(
            compareByDescending<AppInfo> { it.packageName == prefs.primaryPkg }
                .thenByDescending { favs.contains(it.packageName) }
                .thenByDescending { if (byUsage) prefs.usageCount(it.packageName) else 0 }
                .thenBy { it.label.lowercase() }
        )
    }

    /** Intent para abrir una app: el lanzador común y, si no existe, el de TV (leanback). */
    fun launchIntent(pm: PackageManager, pkg: String): Intent? =
        pm.getLaunchIntentForPackage(pkg) ?: pm.getLeanbackLaunchIntentForPackage(pkg)
}
