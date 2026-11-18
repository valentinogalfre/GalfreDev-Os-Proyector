package ar.vale.projectorlauncher.update

import android.content.Context
import android.os.Build
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.store.CatalogApp
import ar.vale.projectorlauncher.store.Downloader
import ar.vale.projectorlauncher.store.Net
import ar.vale.projectorlauncher.store.Release
import ar.vale.projectorlauncher.store.Resolver
import ar.vale.projectorlauncher.ui.Device

/**
 * El launcher se actualiza solo desde las releases de su repo, con el mismo camino que la Tienda:
 * baja el APK, comprueba el SHA-256 que publica GitHub y la firma, y abre el instalador del sistema.
 *
 * La firma que se exige es la de la copia instalada. Es la misma regla que aplica Android, pero
 * comprobada antes: un APK firmado por otro se descarta y nunca llega al instalador.
 */
object SelfUpdate {

    /** El repo sale de los recursos: un fork cambia una línea y se actualiza desde sus releases. */
    fun repo(context: Context): String = context.getString(R.string.update_repo)

    fun installedVersion(context: Context): String =
        runCatching { context.packageManager.getPackageInfo(context.packageName, 0).versionName.orEmpty() }.getOrDefault("")

    /** El launcher como si fuera una app más del catálogo, para reusar la descarga comprobada. */
    fun asApp(context: Context): CatalogApp = CatalogApp(
        id = "galfredev-os",
        name = context.getString(R.string.app_name),
        packageName = context.packageName,
        category = "tools",
        tvFirst = true,
        license = "MIT",
        minSdk = 26,
        summary = "",
        details = "",
        caveat = null,
        replaces = emptyList(),
        legacy = emptyList(),
        legacyReason = null,
        signers = installedSigners(context),
        source = UpdatePlan.source(repo(context))
    )

    /** Consulta GitHub. Bloquea: va siempre en otro hilo. */
    fun latest(context: Context): Release =
        Resolver.resolve(asApp(context), Build.SUPPORTED_ABIS.toList(), Net)

    /**
     * La consulta automática del inicio: como mucho cada seis horas y solo con red. Guarda la versión
     * encontrada para que el inicio la muestre sin volver a preguntar. [found] se llama una sola vez
     * por versión nueva, para avisar sin repetir el aviso en cada vuelta al inicio.
     */
    fun checkInBackground(context: Context, found: (String) -> Unit) {
        val app = context.applicationContext
        val prefs = Prefs(app)
        val now = System.currentTimeMillis()
        if (!UpdatePlan.shouldAutoCheck(now, prefs.updateCheckedAt, Device.isOnline(app))) return
        prefs.updateCheckedAt = now
        Thread {
            val latest = runCatching { latest(app).version }.getOrNull() ?: return@Thread
            val previous = prefs.updateLatest
            prefs.updateLatest = latest
            if (latest != previous && UpdatePlan.isNewer(latest, installedVersion(app))) found(latest)
        }.start()
    }

    /** La versión nueva que ya se sabe que existe, o null. No consulta la red. */
    fun known(context: Context): String? =
        Prefs(context).updateLatest?.takeIf { UpdatePlan.isNewer(it, installedVersion(context)) }

    fun download(context: Context, release: Release, progress: (Float?) -> Unit, cancelled: () -> Boolean) =
        Downloader.fetch(context, asApp(context), release, progress, cancelled)

    private fun installedSigners(context: Context): Set<String> {
        val info = context.packageManager.getPackageInfo(context.packageName, Downloader.signatureFlags(Build.VERSION.SDK_INT))
        return Downloader.signers(info).toSet()
    }
}
