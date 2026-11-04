package ar.vale.projectorlauncher

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

/** Lee del sistema las apps lanzables: comunes (LAUNCHER) y de Android TV (LEANBACK_LAUNCHER). */
object AppRepository {

    fun loadApps(ctx: Context): List<AppInfo> {
        val pm = ctx.packageManager
        val seen = HashSet<String>()
        val apps = ArrayList<AppInfo>()
        // En proyectores con Android TV, Netflix/YouTube y otras suelen declarar SOLO la
        // categoría leanback: si no la consultamos, no aparecen en ninguna grilla.
        for (category in listOf(Intent.CATEGORY_LAUNCHER, Intent.CATEGORY_LEANBACK_LAUNCHER)) {
            val intent = Intent(Intent.ACTION_MAIN).addCategory(category)
            for (ri in pm.queryIntentActivities(intent, 0)) {
                val pkg = ri.activityInfo.packageName
                if (pkg == ctx.packageName) continue          // no listarnos a nosotros mismos
                if (!seen.add(pkg)) continue                  // una entrada por paquete
                val label = runCatching { ri.loadLabel(pm).toString() }.getOrDefault(pkg)
                val icon = runCatching { ri.loadIcon(pm) }.getOrNull() ?: continue
                apps.add(AppInfo(label, pkg, icon))
            }
        }
        apps.sortBy { it.label.lowercase() }
        return apps
    }

    /** Intent para abrir una app: el lanzador común y, si no existe, el de TV (leanback). */
    fun launchIntent(pm: PackageManager, pkg: String): Intent? =
        pm.getLaunchIntentForPackage(pkg) ?: pm.getLeanbackLaunchIntentForPackage(pkg)
}
