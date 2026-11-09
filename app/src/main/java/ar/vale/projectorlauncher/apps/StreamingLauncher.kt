package ar.vale.projectorlauncher.apps

import android.content.Context
import android.content.Intent
import android.net.Uri
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.Installed
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.remote.RemoteActivity
import ar.vale.projectorlauncher.store.StoreDetailActivity
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Sheet

/** Abre un servicio si está, y si no, explica cómo conseguirlo. */
object StreamingLauncher {

    private const val AURORA = "com.aurora.store"
    private const val AURORA_ID = "aurora"

    /** Sale de la lista en memoria: preguntarle al sistema por cada servicio trababa el inicio. */
    fun isInstalled(context: Context, pkg: String): Boolean = pkg in Installed.launchable(context)

    fun open(activity: GdActivity, service: Streaming.Service) {
        val pm = activity.packageManager
        val pkg = Streaming.installed(service) { isInstalled(activity, it) }
        val intent = pkg?.let { AppRepository.launchIntent(pm, it) }
        if (intent != null) activity.openExternal(intent, service.name) else offer(activity, service)
    }

    private fun offer(activity: GdActivity, service: Streaming.Service) {
        val hasAurora = isInstalled(activity, AURORA)
        val fetch = activity.getString(if (hasAurora) R.string.streaming_aurora_open else R.string.streaming_aurora_install)
        Sheet.show(activity, service.name, listOf(
            Sheet.Option(fetch, R.drawable.ic_store) {
                val intent = fetchIntent(activity, service)
                if (hasAurora) activity.openExternal(intent, null) else activity.openScreen(intent, null)
            },
            Sheet.Option(activity.getString(R.string.streaming_phone), R.drawable.ic_phone) {
                activity.openScreen(Intent(activity, RemoteActivity::class.java), activity.getString(R.string.word_celular))
            }
        ), activity.getString(R.string.streaming_body))
    }

    /** Con Aurora, la ficha de la app en Google Play. Sin Aurora, la ficha de Aurora en la Tienda. */
    fun fetchIntent(context: Context, service: Streaming.Service): Intent {
        val aurora = AppRepository.launchIntent(context.packageManager, AURORA)
            ?: return Intent(context, StoreDetailActivity::class.java).putExtra(StoreDetailActivity.EXTRA_ID, AURORA_ID)
        val prefs = Prefs(context)
        if (!prefs.auroraStarted) {
            prefs.auroraStarted = true
            return aurora
        }
        return Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=${service.play}")).setPackage(AURORA)
    }
}
