package ar.vale.projectorlauncher.device

import android.content.Context
import android.content.Intent
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.Installed
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.store.StoreDetailActivity
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Sheet

/**
 * Las apps de este equipo que reciben la pantalla de un celular o de una compu: AirPlay,
 * Miracast, DLNA. Es lo más parecido a un Chromecast que puede tener un equipo sin certificar.
 *
 * No hay nada nuestro que reciba video: se abre la app que ya está. Y ninguna muestra lo
 * protegido: Netflix, Disney+ y compañía se ven en negro al duplicar, por decisión de ellos.
 *
 * Es la única lista de receptores: la usan Cine, el celular, las presentaciones y el informe del
 * equipo. Junta lo que el fabricante dejó ([Functions]) con lo que se reconoce por el nombre
 * ([DeviceHints]).
 */
object Casting {

    class Receiver(val name: String, val pkg: String, private val entry: Intent) {
        /** Uno nuevo cada vez: quien lo abre le agrega lo suyo. */
        val intent: Intent get() = Intent(entry).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }

    /** La que conviene abrir, o null si el equipo no recibe nada. */
    fun best(context: Context): Receiver? = Installed.receivers(context).firstOrNull()

    /** Le pregunta al sistema. Tarda: se pide por [Installed.receivers], que lo guarda. */
    fun detect(context: Context): List<Receiver> {
        val pm = context.packageManager
        val apps = AppRepository.names(context)
        val names = apps.associate { (name, pkg) -> pkg to name }
        // La de fábrica puede ser una pantalla suelta del sistema, que no figura entre las apps.
        val factory = Installed.functions(context)
            .firstOrNull { it.kind == Functions.Kind.MIRROR && !it.broadcast }
            ?.let { fn -> (fn.intent.component?.packageName ?: fn.intent.`package`)?.let { it to fn.intent } }
        return order(factory?.first, apps).mapNotNull { pkg ->
            val entry = if (pkg == factory?.first) factory.second else AppRepository.launchIntent(pm, pkg)
            entry?.let { Receiver(names[pkg] ?: context.getString(R.string.fn_mirror), pkg, it) }
        }
    }

    /**
     * En qué orden se ofrecen. Primero la que trae el equipo de fábrica: es la que el fabricante
     * probó con este hardware. Después las que se reconocen por el nombre, cada una una vez.
     */
    fun order(factory: String?, apps: List<Pair<String, String>>): List<String> =
        (listOfNotNull(factory) + apps.filter { (name, pkg) -> DeviceHints.casts(pkg, name) }.map { it.second }).distinct()

    /**
     * En la pared: explica cómo se manda la pantalla y abre el receptor. Sin ninguno, ofrece el
     * de la Tienda.
     */
    fun offer(activity: GdActivity) {
        val title = activity.getString(R.string.cast_title)
        val receivers = Installed.receivers(activity)
        if (receivers.isEmpty()) {
            Sheet.show(activity, title, listOf(
                Sheet.Option(activity.getString(R.string.cast_install), R.drawable.ic_store) {
                    val store = Intent(activity, StoreDetailActivity::class.java).putExtra(StoreDetailActivity.EXTRA_ID, STORE_ID)
                    activity.openScreen(store, null)
                }
            ), activity.getString(R.string.cast_none))
            return
        }
        Sheet.show(activity, title, receivers.take(MAX_SHOWN).map { receiver ->
            Sheet.Option(activity.getString(R.string.cast_open, receiver.name), R.drawable.ic_phone) {
                activity.openExternal(receiver.intent, receiver.name)
            }
        }, activity.getString(R.string.cast_body))
    }

    private const val STORE_ID = "castbay"
    private const val MAX_SHOWN = 3
}
