package ar.vale.projectorlauncher

import android.content.Context
import android.content.SharedPreferences

/**
 * Memoria del sistema: app principal, favoritos, uso, tema y ajustes de cada módulo.
 * Todo persiste entre reinicios. Las claves viejas no cambian: un equipo que ya tenía
 * el launcher instalado conserva su app principal y sus favoritos.
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

    // --- Apariencia ---

    /** [THEME_CARBON] por defecto: un proyector trabaja a oscuras. */
    var theme: String
        get() = sp.getString(KEY_THEME, THEME_CARBON) ?: THEME_CARBON
        set(v) = sp.edit().putString(KEY_THEME, v).apply()

    var motion: String
        get() = sp.getString(KEY_MOTION, MOTION_AUTO) ?: MOTION_AUTO
        set(v) = sp.edit().putString(KEY_MOTION, v).apply()

    /** Duración media de un cuadro medida en el último arranque, en milisegundos. 0 = sin medir. */
    var measuredFrameMs: Float
        get() = sp.getFloat(KEY_FRAME_MS, 0f)
        set(v) = sp.edit().putFloat(KEY_FRAME_MS, v).apply()

    var bootAnimation: Boolean
        get() = sp.getBoolean(KEY_BOOT_ANIM, true)
        set(v) = sp.edit().putBoolean(KEY_BOOT_ANIM, v).apply()

    /** Último encendido en el que ya se mostró la animación: se ve una vez por encendido. */
    var lastBootShown: Int
        get() = sp.getInt(KEY_LAST_BOOT, -1)
        set(v) = sp.edit().putInt(KEY_LAST_BOOT, v).apply()

    // --- Pared ---

    var wallMode: Int
        get() = sp.getInt(KEY_WALL_MODE, 0)
        set(v) = sp.edit().putInt(KEY_WALL_MODE, v).apply()

    /** Minutos sin tocar nada antes de mostrar la pared en el inicio. 0 = nunca. */
    var wallIdleMinutes: Int
        get() = sp.getInt(KEY_WALL_IDLE, 10)
        set(v) = sp.edit().putInt(KEY_WALL_IDLE, v).apply()

    // --- Actualizaciones del launcher ---

    /** Cuándo se consultó GitHub por última vez, para no hacerlo en cada vuelta al inicio. */
    var updateCheckedAt: Long
        get() = sp.getLong(KEY_UPDATE_CHECKED, 0L)
        set(v) = sp.edit().putLong(KEY_UPDATE_CHECKED, v).apply()

    /** La última versión publicada que se vio. El inicio la compara con la instalada. */
    var updateLatest: String?
        get() = sp.getString(KEY_UPDATE_LATEST, null)
        set(v) = sp.edit().putString(KEY_UPDATE_LATEST, v).apply()

    // --- Celular ---

    /** Aurora se abre una vez por su portada: entrando directo a una ficha falla hasta configurarla. */
    var auroraStarted: Boolean
        get() = sp.getBoolean(KEY_AURORA_STARTED, false)
        set(v) = sp.edit().putBoolean(KEY_AURORA_STARTED, v).apply()

    /** Servicios que se sacaron de Cine porque en este equipo no andan. Siguen en «Más servicios». */
    var hiddenServices: Set<String>
        get() = sp.getStringSet(KEY_HIDDEN_SERVICES, emptySet()).orEmpty().toSet()
        set(v) = sp.edit().putStringSet(KEY_HIDDEN_SERVICES, v).apply()

    /**
     * La versión de un servicio que se eligió en este equipo, para cuando hay más de una
     * instalada: la que anda. Vale mientras siga instalada.
     */
    fun serviceApp(service: String): String? = sp.getString(KEY_SERVICE_APP + service, null)

    fun chooseServiceApp(service: String, pkg: String) = sp.edit().putString(KEY_SERVICE_APP + service, pkg).apply()

    /** El servidor local solo corre si lo pediste: por defecto el equipo no escucha nada. */
    var remoteEnabled: Boolean
        get() = sp.getBoolean(KEY_REMOTE, false)
        set(v) = sp.edit().putBoolean(KEY_REMOTE, v).apply()

    var remoteToken: String?
        get() = sp.getString(KEY_REMOTE_TOKEN, null)
        set(v) = sp.edit().putString(KEY_REMOTE_TOKEN, v).apply()

    // --- Claude ---

    var claudeModel: String
        get() = sp.getString(KEY_CLAUDE_MODEL, null) ?: DEFAULT_CLAUDE_MODEL
        set(v) = sp.edit().putString(KEY_CLAUDE_MODEL, v).apply()

    var claudeWebSearch: Boolean
        get() = sp.getBoolean(KEY_CLAUDE_WEB, true)
        set(v) = sp.edit().putBoolean(KEY_CLAUDE_WEB, v).apply()

    /** Si Claude puede leer y tocar otras apps. Lo que lee de la pantalla viaja a la API. */
    var claudeHands: Boolean
        get() = sp.getBoolean(KEY_CLAUDE_HANDS, true)
        set(v) = sp.edit().putBoolean(KEY_CLAUDE_HANDS, v).apply()

    companion object {
        const val DEFAULT_CLAUDE_MODEL = "claude-opus-5-5"

        const val THEME_CARBON = "carbon"
        const val THEME_DAY = "hueso"
        const val THEME_AUTO = "auto"

        const val MOTION_AUTO = "auto"
        const val MOTION_FULL = "full"
        const val MOTION_REDUCED = "reduced"

        private const val KEY_PRIMARY = "primary_pkg"
        private const val KEY_BOOT = "auto_launch_boot"
        private const val KEY_SORT_USAGE = "sort_by_usage"
        private const val KEY_FAVS = "favorites"
        private const val KEY_PENDING_BOOT = "pending_boot_launch"
        private const val KEY_THEME = "theme"
        private const val KEY_MOTION = "motion"
        private const val KEY_FRAME_MS = "measured_frame_ms"
        private const val KEY_BOOT_ANIM = "boot_animation"
        private const val KEY_LAST_BOOT = "last_boot_shown"
        private const val KEY_WALL_MODE = "wall_mode"
        private const val KEY_WALL_IDLE = "wall_idle_minutes"
        private const val KEY_AURORA_STARTED = "aurora_started"
        private const val KEY_HIDDEN_SERVICES = "hidden_services"
        private const val KEY_SERVICE_APP = "service_app_"
        private const val KEY_REMOTE = "remote_enabled"
        private const val KEY_UPDATE_CHECKED = "update_checked_at"
        private const val KEY_UPDATE_LATEST = "update_latest"
        private const val KEY_REMOTE_TOKEN = "remote_token"
        private const val KEY_CLAUDE_MODEL = "claude_model"
        private const val KEY_CLAUDE_WEB = "claude_web_search"
        private const val KEY_CLAUDE_HANDS = "claude_hands"
    }
}
