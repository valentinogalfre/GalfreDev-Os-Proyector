package ar.vale.projectorlauncher

import android.content.Context
import android.content.SharedPreferences

/**
 * Memoria del launcher: app principal, favoritos, conteo de uso y toggles.
 * Todo persiste entre reinicios (es lo que hace que "recuerde las cosas").
 */
class Prefs(ctx: Context) {

    private val sp: SharedPreferences =
        ctx.getSharedPreferences("galfre_launcher", Context.MODE_PRIVATE)
    private val usage: SharedPreferences =
        ctx.getSharedPreferences("galfre_usage", Context.MODE_PRIVATE)

    var primaryPkg: String?
        get() = sp.getString(KEY_PRIMARY, null)
        set(v) = sp.edit().apply { if (v == null) remove(KEY_PRIMARY) else putString(KEY_PRIMARY, v) }.apply()

    var autoLaunchOnBoot: Boolean
        get() = sp.getBoolean(KEY_BOOT, false)
        set(v) = sp.edit().putBoolean(KEY_BOOT, v).apply()

    var sortByUsage: Boolean
        get() = sp.getBoolean(KEY_SORT_USAGE, true)
        set(v) = sp.edit().putBoolean(KEY_SORT_USAGE, v).apply()

    /** Señal de arranque: BootReceiver la activa y LauncherActivity la consume para abrir la app principal al encender. */
    var pendingBootLaunch: Boolean
        get() = sp.getBoolean(KEY_PENDING_BOOT, false)
        set(v) = sp.edit().putBoolean(KEY_PENDING_BOOT, v).apply()

    var favorites: Set<String>
        get() = sp.getStringSet(KEY_FAVS, emptySet()) ?: emptySet()
        set(v) = sp.edit().putStringSet(KEY_FAVS, v).apply()

    fun isFavorite(pkg: String) = favorites.contains(pkg)

    fun toggleFavorite(pkg: String) {
        val cur = favorites.toMutableSet()
        if (!cur.add(pkg)) cur.remove(pkg)
        favorites = cur
    }

    fun usageCount(pkg: String) = usage.getInt(pkg, 0)

    fun incrementUsage(pkg: String) = usage.edit().putInt(pkg, usageCount(pkg) + 1).apply()

    companion object {
        private const val KEY_PRIMARY = "primary_pkg"
        private const val KEY_BOOT = "auto_launch_boot"
        private const val KEY_SORT_USAGE = "sort_by_usage"
        private const val KEY_FAVS = "favorites"
        private const val KEY_PENDING_BOOT = "pending_boot_launch"
    }
}
