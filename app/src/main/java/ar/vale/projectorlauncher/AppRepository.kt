package ar.vale.projectorlauncher

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

/** Lee del sistema las apps que tienen ícono de lanzador. */
object AppRepository {

    fun loadApps(ctx: Context): List<AppInfo> {
        val pm = ctx.packageManager
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val resolved = pm.queryIntentActivities(intent, 0)
        val seen = HashSet<String>()
        val apps = ArrayList<AppInfo>()
        for (ri in resolved) {
            val pkg = ri.activityInfo.packageName
            if (pkg == ctx.packageName) continue          // no listarnos a nosotros mismos
            if (!seen.add(pkg)) continue                  // una entrada por paquete
            val label = runCatching { ri.loadLabel(pm).toString() }.getOrDefault(pkg)
            val icon = runCatching { ri.loadIcon(pm) }.getOrNull() ?: continue
            apps.add(AppInfo(label, pkg, icon))
        }
        apps.sortBy { it.label.lowercase() }
        return apps
    }
}
