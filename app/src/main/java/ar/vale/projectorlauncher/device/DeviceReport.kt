package ar.vale.projectorlauncher.device

import android.app.ActivityManager
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.media.MediaDrm
import android.os.Build
import android.os.Environment
import android.os.StatFs
import ar.vale.projectorlauncher.Installed
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.apps.Streaming
import ar.vale.projectorlauncher.ui.Screen
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar
import java.util.UUID

/**
 * Qué equipo es y qué puede reproducir. Cuando una app de video no anda, la respuesta casi
 * siempre está acá: qué protección de video trae el equipo, qué versión de Android, si se
 * presenta como televisor, y qué apps para recibir la pantalla del celular vienen de fábrica.
 *
 * Solo lee. No lleva nada que identifique a una persona ni a una cuenta.
 */
object DeviceReport {

    private val WIDEVINE = UUID.fromString("edef8ba9-79d6-4ace-a3c8-27dcd51d21ed")
    private const val MB = 1024L * 1024

    fun json(context: Context): JSONObject {
        val pm = context.packageManager
        val size = Screen.realSize(context)
        val memory = ActivityManager.MemoryInfo().also { context.getSystemService(ActivityManager::class.java).getMemoryInfo(it) }
        val disk = runCatching { StatFs(Environment.getDataDirectory().path) }.getOrNull()
        val installed = runCatching { pm.getInstalledApplications(0) }.getOrDefault(emptyList())
        val labels = installed.associate { it.packageName to runCatching { it.loadLabel(pm).toString() }.getOrDefault(it.packageName) }
        return JSONObject()
            .put("model", "${Build.MANUFACTURER} ${Build.MODEL}".trim())
            .put("hardware", listOf(Build.BOARD, Build.HARDWARE).distinct().joinToString(" · "))
            .put("android", Build.VERSION.RELEASE)
            .put("sdk", Build.VERSION.SDK_INT)
            .put("abis", JSONArray(Build.SUPPORTED_ABIS.toList()))
            // Un equipo certificado por Google sale firmado con claves de producción.
            .put("release_keys", Build.TAGS.orEmpty().contains("release-keys"))
            .put("screen", "${size.x} × ${size.y} · ${context.resources.displayMetrics.densityDpi} dpi")
            .put("ram_mb", memory.totalMem / MB)
            .put("free_mb", disk?.let { it.availableBytes / MB } ?: JSONObject.NULL)
            .put("tv", pm.hasSystemFeature(PackageManager.FEATURE_LEANBACK))
            .put("tv_only", pm.hasSystemFeature(PackageManager.FEATURE_LEANBACK_ONLY))
            .put("touch", pm.hasSystemFeature(PackageManager.FEATURE_TOUCHSCREEN))
            .put("widevine", widevine())
            .put("play_services", version(pm, "com.google.android.gms") ?: JSONObject.NULL)
            .put("play_store", version(pm, "com.android.vending") ?: JSONObject.NULL)
            .put("webview", webview(pm) ?: JSONObject.NULL)
            .put("services", JSONArray(Streaming.ALL.map { service -> service(pm, service, labels.keys, Prefs(context).serviceApp(service.name)) }))
            .put("casting", casting(context, labels))
            .put("inputs", found(labels, DeviceHints::switchesInput))
    }

    /**
     * El nivel de Widevine decide la calidad: L1 deja ver en alta definición, L3 solo en estándar,
     * y sin Widevine las apps pagas directamente no reproducen.
     */
    private fun widevine(): JSONObject {
        val out = JSONObject()
        val drm = runCatching { MediaDrm(WIDEVINE) }.getOrNull() ?: return out.put("level", JSONObject.NULL)
        fun read(name: String) = runCatching { drm.getPropertyString(name) }.getOrNull()?.takeIf { it.isNotBlank() }
        out.put("level", read("securityLevel") ?: JSONObject.NULL)
        out.put("hdcp", read("hdcpLevel") ?: JSONObject.NULL)
        out.put("max_hdcp", read("maxHdcpLevel") ?: JSONObject.NULL)
        out.put("version", read(MediaDrm.PROPERTY_VERSION) ?: JSONObject.NULL)
        @Suppress("DEPRECATION")
        runCatching { drm.release() }
        return out
    }

    /**
     * De cada servicio, qué versión hay y de cuándo. Una app de fábrica que nunca se actualizó
     * suele ser el motivo: el servicio la rechaza hasta que se instale una nueva.
     */
    private fun service(pm: PackageManager, service: Streaming.Service, installed: Set<String>, chosen: String?): JSONObject {
        val out = JSONObject().put("name", service.name)
        val pkg = Streaming.installed(service, chosen) { it in installed }
        val info = pkg?.let { runCatching { pm.getPackageInfo(it, 0) }.getOrNull() }
        if (pkg == null || info == null) return out.put("package", JSONObject.NULL).put("version", JSONObject.NULL)
        val flags = info.applicationInfo?.flags ?: 0
        return out
            .put("package", pkg)
            .put("version", info.versionName ?: JSONObject.NULL)
            .put("form", if (pkg in service.tv) "tv" else if (service.tv.isEmpty()) "only" else "phone")
            .put("factory", flags and ApplicationInfo.FLAG_SYSTEM != 0)
            .put("updated", flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP != 0 || flags and ApplicationInfo.FLAG_SYSTEM == 0)
            .put("year", Calendar.getInstance().apply { timeInMillis = info.lastUpdateTime }.get(Calendar.YEAR))
            .put("target_sdk", info.applicationInfo?.targetSdkVersion ?: JSONObject.NULL)
    }

    private fun version(pm: PackageManager, pkg: String): String? =
        runCatching { pm.getPackageInfo(pkg, 0).versionName }.getOrNull()

    private fun webview(pm: PackageManager): String? =
        listOf("com.google.android.webview", "com.android.webview", "com.android.chrome").firstNotNullOfOrNull { pkg ->
            version(pm, pkg)?.let { "$pkg $it" }
        }

    /**
     * Lo que recibe la pantalla de un celular. Primero lo que se puede abrir, que es lo que
     * ofrecen Cine y el celular; después lo que está instalado pero no tiene por dónde entrarle.
     */
    private fun casting(context: Context, labels: Map<String, String>): JSONArray {
        val opens = Installed.receivers(context).map { it.pkg to it.name }
        val known = opens.map { it.first }.toSet()
        val closed = labels.filter { (pkg, label) -> pkg !in known && DeviceHints.casts(pkg, label) }.toSortedMap().toList()
        return JSONArray((opens + closed).map { (pkg, name) ->
            JSONObject().put("name", name).put("package", pkg).put("opens", pkg in known)
        })
    }

    private fun found(labels: Map<String, String>, wanted: (String, String) -> Boolean): JSONArray =
        JSONArray(labels.filter { (pkg, label) -> wanted(pkg, label) }.toSortedMap().map { (pkg, label) ->
            JSONObject().put("name", label).put("package", pkg)
        })
}
