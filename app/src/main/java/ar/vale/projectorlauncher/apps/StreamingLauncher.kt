package ar.vale.projectorlauncher.apps

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.Installed
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.remote.RemoteActivity
import ar.vale.projectorlauncher.store.StoreDetailActivity
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Sheet

/** Abre un servicio si está, y si no, o si no anda, explica cómo conseguirlo. */
object StreamingLauncher {

    private const val AURORA = "com.aurora.store"
    private const val AURORA_ID = "aurora"

    /** Sale de la lista en memoria: preguntarle al sistema por cada servicio trababa el inicio. */
    fun isInstalled(context: Context, pkg: String): Boolean = pkg in Installed.launchable(context)

    /** Un equipo que se presenta como televisor: la tienda le da las apps de TV, y no las de celular. */
    fun tvDevice(context: Context): Boolean = context.packageManager.let {
        it.hasSystemFeature(PackageManager.FEATURE_LEANBACK) || it.hasSystemFeature(PackageManager.FEATURE_LEANBACK_ONLY)
    }

    /** El paquete que se abre de un servicio: la versión que se eligió en este equipo, si sigue instalada. */
    fun current(context: Context, service: Streaming.Service): String? =
        Streaming.installed(service, Prefs(context).serviceApp(service.name)) { isInstalled(context, it) }

    fun open(activity: GdActivity, service: Streaming.Service) {
        val pm = activity.packageManager
        val pkg = current(activity, service)
        val intent = pkg?.let { AppRepository.launchIntent(pm, it) }
        if (intent != null) activity.openExternal(intent, service.name) else options(activity, service)
    }

    /**
     * Las salidas de un servicio: abrirlo, actualizarlo, probar su otra versión. [extra] son las
     * opciones que agrega la pantalla que lo muestra.
     */
    fun options(activity: GdActivity, service: Streaming.Service, extra: List<Sheet.Option> = emptyList()) {
        val hasAurora = isInstalled(activity, AURORA)
        val prefs = Prefs(activity)
        val choices = Streaming.choices(service, tvDevice(activity), prefs.serviceApp(service.name)) { isInstalled(activity, it) }
        val installed = choices.any { it.action == Streaming.Action.OPEN }
        val options = ArrayList<Sheet.Option>()
        choices.forEach { choice ->
            when (choice.action) {
                Streaming.Action.OPEN -> {
                    val intent = AppRepository.launchIntent(activity.packageManager, choice.pkg) ?: return@forEach
                    options.add(Sheet.Option(activity.getString(R.string.streaming_open), R.drawable.ic_play) {
                        activity.openExternal(intent, service.name)
                    })
                }
                Streaming.Action.USE_TV, Streaming.Action.USE_PHONE, Streaming.Action.USE -> {
                    val intent = AppRepository.launchIntent(activity.packageManager, choice.pkg) ?: return@forEach
                    val label = when (choice.action) {
                        Streaming.Action.USE_TV -> R.string.streaming_use_tv
                        Streaming.Action.USE_PHONE -> R.string.streaming_use_phone
                        else -> R.string.streaming_use_other
                    }
                    // Desde acá el servicio abre esa versión: en Cine, desde el celular y con Claude.
                    options.add(Sheet.Option(activity.getString(label), R.drawable.ic_play) {
                        prefs.chooseServiceApp(service.name, choice.pkg)
                        activity.openExternal(intent, service.name)
                    })
                }
                else -> if (hasAurora) {
                    val label = when (choice.action) {
                        Streaming.Action.UPDATE -> R.string.streaming_update
                        Streaming.Action.GET_TV -> R.string.streaming_get_tv
                        Streaming.Action.GET_PHONE -> R.string.streaming_get_phone
                        else -> R.string.streaming_aurora_open
                    }
                    options.add(Sheet.Option(activity.getString(label), R.drawable.ic_store) {
                        // Quien baja otra versión es porque la que tiene no le sirve: en cuanto esté, se abre esa.
                        if (choice.action != Streaming.Action.UPDATE) prefs.chooseServiceApp(service.name, choice.pkg)
                        activity.openExternal(fetchIntent(activity, choice.pkg), null)
                    })
                }
            }
        }
        if (!hasAurora) {
            options.add(Sheet.Option(activity.getString(R.string.streaming_aurora_install), R.drawable.ic_store) {
                activity.openScreen(fetchIntent(activity, service.play), null)
            })
        }
        options.add(Sheet.Option(activity.getString(R.string.streaming_phone), R.drawable.ic_phone) {
            activity.openScreen(Intent(activity, RemoteActivity::class.java), activity.getString(R.string.word_celular))
        })
        options.addAll(extra)
        val body = activity.getString(if (installed) R.string.streaming_body_installed else R.string.streaming_body)
        Sheet.show(activity, service.name, options, body)
    }

    /** La versión de un servicio que conviene buscar en este equipo. */
    fun fetchIntent(context: Context, service: Streaming.Service): Intent =
        fetchIntent(context, Streaming.fetchable(service, tvDevice(context)).first().pkg)

    /** Con Aurora, la ficha de la app en Google Play. Sin Aurora, la ficha de Aurora en la Tienda. */
    fun fetchIntent(context: Context, pkg: String): Intent {
        val aurora = AppRepository.launchIntent(context.packageManager, AURORA)
            ?: return Intent(context, StoreDetailActivity::class.java).putExtra(StoreDetailActivity.EXTRA_ID, AURORA_ID)
        val prefs = Prefs(context)
        if (!prefs.auroraStarted) {
            prefs.auroraStarted = true
            return aurora
        }
        return Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$pkg")).setPackage(AURORA)
    }
}
