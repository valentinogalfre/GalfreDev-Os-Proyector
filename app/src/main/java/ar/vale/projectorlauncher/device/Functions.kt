package ar.vale.projectorlauncher.device

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import ar.vale.projectorlauncher.R

/**
 * Funciones del proyector que vienen en el firmware de cada fabricante: trapecio, foco, HDMI,
 * pantalla inalámbrica. No existe una API de Android para esto, y cada marca las esconde en
 * otra app, así que se buscan en el equipo: primero rutas conocidas y después por nombre.
 *
 * Solo se abre lo que el sistema resuelve y está exportado. Nada de esto escribe en el equipo.
 */
object Functions {

    enum class Kind(val label: Int, val icon: Int) {
        KEYSTONE(R.string.fn_keystone, R.drawable.ic_display),
        FOCUS(R.string.fn_focus, R.drawable.ic_target),
        HDMI(R.string.fn_hdmi, R.drawable.ic_projector),
        MIRROR(R.string.fn_mirror, R.drawable.ic_phone),
        VENDOR_HOME(R.string.fn_vendor_home, R.drawable.ic_home)
    }

    /** Si [broadcast] es true, la función se abre con un aviso al sistema y no con una pantalla. */
    class Found(val kind: Kind, val intent: Intent, val broadcast: Boolean = false)

    private fun component(pkg: String, cls: String) =
        Intent().setComponent(ComponentName(pkg, if (cls.startsWith(".")) pkg + cls else cls))

    /** Rutas relevadas en firmwares reales de HY300, HY310, HY320, Chowa P8 y similares. */
    private val KNOWN: Map<Kind, List<Intent>> = mapOf(
        Kind.KEYSTONE to listOf(
            Intent("action.htcsettings.prjsettings"),
            component("com.htc.htcsettings", "com.htc.activity.ProjectionActivity"),
            component("com.softwinner.tcorrection", ".projection.ProjectionSettingActivity"),
            component("com.android.tv.settings", ".trapezoid.TrapezoidActivity"),
            component("com.example.trapezoid", ".MainActivity")
        ),
        Kind.FOCUS to listOf(component("com.hysd.vafocus", ".VajzActivity")),
        Kind.HDMI to listOf(
            component("com.softwinner.awlivetv", ".MainActivity").putExtra("input_source", "HDMI1"),
            component("com.softwinner.awsource", ".MainActivity"),
            component("com.mediatek.wwtv.tvcenter", ".nav.TurnkeyUiMainActivity")
        ),
        Kind.MIRROR to listOf(component("com.softwinner.miracastReceiver", ".Miracast")),
        Kind.VENDOR_HOME to listOf(
            component("com.htc.htclauncherhighenglishd08", "com.htc.activity.HomeActivity"),
            component("com.htc.luminaos", ".activity.MainActivity"),
            component("com.htc.magcubicos", ".activity.MainActivity")
        )
    )

    /** Apps enteras, para los firmwares que no dicen qué pantalla abrir. */
    internal object KnownApps {
        val BY_KIND: Map<Kind, List<String>> = mapOf(
            Kind.HDMI to listOf("com.mediatek.wwtv.tvcenter"),
            Kind.MIRROR to listOf("com.ionitech.airscreen"),
            Kind.VENDOR_HOME to listOf("com.htc.spectraos", "com.jm.jmlauncher", "com.zeasn.whale.open.launcher.technical")
        )
    }

    /** En los Chowa P8 el foco es una ventana del fabricante: se abre con un aviso y se mueve con las flechas. */
    private const val FOCUS_OWNER = "com.rjpj.function"
    private const val FOCUS_SHOW = "com.rjpj.intent.action.focus.show"

    /** Palabras que delatan cada función en el nombre de una app del sistema. */
    private val KEYWORDS: Map<Kind, Regex> = mapOf(
        Kind.KEYSTONE to Regex("keystone|trapez|correction|projection", RegexOption.IGNORE_CASE),
        Kind.FOCUS to Regex("focus|enfoque|\\bfoco\\b", RegexOption.IGNORE_CASE),
        Kind.HDMI to Regex("hdmi|livetv|tvinput|\\bsource\\b|entrada", RegexOption.IGNORE_CASE),
        Kind.MIRROR to Regex("miracast|airplay|airscreen|screen ?cast|mirror|espejo", RegexOption.IGNORE_CASE)
    )

    /** Tocar esto apaga el control térmico en algunos modelos: no se abre ni se lista. */
    private val NEVER = setOf("com.htc.closedialog")

    fun detect(context: Context): List<Found> {
        val pm = context.packageManager
        val found = LinkedHashMap<Kind, Found>()
        fromProperties()?.let { if (opens(pm, it)) found[Kind.KEYSTONE] = Found(Kind.KEYSTONE, it) }
        KNOWN.forEach { (kind, intents) ->
            if (kind !in found) intents.firstOrNull { opens(pm, it) }?.let { found[kind] = Found(kind, it) }
        }
        KnownApps.BY_KIND.forEach { (kind, packages) ->
            if (kind !in found) packages.firstNotNullOfOrNull { entry(pm, it) }?.let { found[kind] = Found(kind, it) }
        }
        if (Kind.FOCUS !in found && installed(pm, FOCUS_OWNER)) {
            found[Kind.FOCUS] = Found(Kind.FOCUS, Intent(FOCUS_SHOW), broadcast = true)
        }
        scanLaunchers(context, pm, found)
        return Kind.values().mapNotNull { found[it] }
    }

    /** La puerta de una app. Un inicio de fábrica puede no tener otra que la de inicio. */
    private fun entry(pm: PackageManager, pkg: String): Intent? =
        pm.getLaunchIntentForPackage(pkg)
            ?: pm.getLeanbackLaunchIntentForPackage(pkg)
            ?: Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME).setPackage(pkg).takeIf { opens(pm, it) }

    private fun installed(pm: PackageManager, pkg: String): Boolean =
        runCatching { pm.getApplicationInfo(pkg, 0) }.isSuccess

    private fun opens(pm: PackageManager, intent: Intent): Boolean {
        val info = pm.resolveActivity(intent, 0)?.activityInfo ?: return false
        return info.exported && info.packageName !in NEVER
    }

    /** Algunos firmwares dicen cuál es su pantalla de trapecio en una propiedad del sistema. */
    private fun fromProperties(): Intent? {
        val pkg = property("persist.sys.manualkeystone_package")
        val cls = property("persist.sys.manualkeystone_class")
        if (pkg.isNullOrEmpty() || cls.isNullOrEmpty()) return null
        return component(pkg, cls)
    }

    private fun property(name: String): String? = runCatching {
        Class.forName("android.os.SystemProperties")
            .getMethod("get", String::class.java)
            .invoke(null, name) as? String
    }.getOrNull()

    private fun scanLaunchers(context: Context, pm: PackageManager, found: MutableMap<Kind, Found>) {
        val entries = listOf(Intent.CATEGORY_LAUNCHER, Intent.CATEGORY_LEANBACK_LAUNCHER).flatMap { category ->
            pm.queryIntentActivities(Intent(Intent.ACTION_MAIN).addCategory(category), 0)
        }
        for (entry in entries) {
            val info = entry.activityInfo
            val system = info.applicationInfo.flags and ApplicationInfo.FLAG_SYSTEM != 0
            if (!system || info.packageName == context.packageName || info.packageName in NEVER) continue
            val name = "${info.packageName} ${info.name} ${entry.loadLabel(pm)}"
            for ((kind, regex) in KEYWORDS) {
                if (kind !in found && regex.containsMatchIn(name)) {
                    found[kind] = Found(kind, Intent(Intent.ACTION_MAIN).setClassName(info.packageName, info.name).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                }
            }
        }
    }
}
