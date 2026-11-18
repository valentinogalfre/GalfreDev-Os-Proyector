package ar.vale.projectorlauncher.store

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import java.io.File
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

/** Red de la Tienda. GitHub rechaza pedidos sin User-Agent y exige estas cabeceras en su API. */
object Net : Fetch {

    private const val USER_AGENT = "galfredev-os"
    private const val CONNECT_MS = 15_000
    private const val READ_MS = 30_000
    private const val MAX_TEXT_BYTES = 4 * 1024 * 1024

    fun open(url: String): HttpURLConnection {
        val c = URL(url).openConnection() as HttpURLConnection
        c.connectTimeout = CONNECT_MS
        c.readTimeout = READ_MS
        c.instanceFollowRedirects = true
        c.setRequestProperty("User-Agent", USER_AGENT)
        if (url.startsWith("https://api.github.com/")) {
            c.setRequestProperty("Accept", "application/vnd.github+json")
            c.setRequestProperty("X-GitHub-Api-Version", "2022-11-28")
        }
        return c
    }

    override fun text(url: String): String {
        val c = open(url)
        try {
            if (c.responseCode !in 200..299) throw IOException("HTTP ${c.responseCode}")
            return c.inputStream.use { input ->
                val bytes = input.readNBytesCompat(MAX_TEXT_BYTES)
                String(bytes, Charsets.UTF_8)
            }
        } finally {
            c.disconnect()
        }
    }

    private fun java.io.InputStream.readNBytesCompat(limit: Int): ByteArray {
        val out = java.io.ByteArrayOutputStream()
        val buffer = ByteArray(16 * 1024)
        while (out.size() < limit) {
            val n = read(buffer)
            if (n < 0) break
            out.write(buffer, 0, n)
        }
        return out.toByteArray()
    }
}

class StoreFailure(val reason: Reason, detail: String? = null) : Exception(detail) {
    enum class Reason { NETWORK, NO_SPACE, CORRUPT, WRONG_PACKAGE, WRONG_SIGNER, TOO_NEW, UNREADABLE }
}

/** Baja un APK a la caché y lo comprueba antes de ofrecerlo para instalar. */
object Downloader {

    /** Margen para que el proyector no quede sin lugar: tienen 8 GB en total. */
    private const val SPACE_MARGIN = 150L * 1024 * 1024
    private const val DISK_FULL_BYTES = 1024L * 1024
    private const val STALE_MS = 24L * 60 * 60 * 1000

    fun dir(context: Context): File = File(context.cacheDir, "apks").apply { mkdirs() }

    /** Borra lo que quedó de instalaciones anteriores. */
    fun clean(context: Context) {
        val limit = System.currentTimeMillis() - STALE_MS
        dir(context).listFiles()?.filter { it.lastModified() < limit }?.forEach { it.delete() }
    }

    /** Devuelve el archivo ya comprobado. [progress] recibe de 0 a 1, o null si no se sabe el tamaño. */
    fun fetch(context: Context, app: CatalogApp, release: Release, progress: (Float?) -> Unit, cancelled: () -> Boolean): File {
        val target = File(dir(context), "${app.packageName}.apk")
        val partial = File(dir(context), "${app.packageName}.part")
        partial.delete()
        val digest = MessageDigest.getInstance("SHA-256")
        val connection = Net.open(release.url)
        try {
            if (connection.responseCode !in 200..299) throw StoreFailure(StoreFailure.Reason.NETWORK, "HTTP ${connection.responseCode}")
            val total = connection.contentLengthLong
            if (total > 0 && dir(context).usableSpace < total + SPACE_MARGIN) throw StoreFailure(StoreFailure.Reason.NO_SPACE)
            connection.inputStream.use { input ->
                partial.outputStream().use { output ->
                    val buffer = ByteArray(64 * 1024)
                    var done = 0L
                    while (true) {
                        if (cancelled()) throw InterruptedException()
                        val n = input.read(buffer)
                        if (n < 0) break
                        output.write(buffer, 0, n)
                        digest.update(buffer, 0, n)
                        done += n
                        progress(if (total > 0) done.toFloat() / total else null)
                    }
                }
            }
        } catch (e: IOException) {
            // Se mira antes de borrar: con el parcial afuera, el disco ya no parece lleno.
            val full = (partial.parentFile?.usableSpace ?: Long.MAX_VALUE) < DISK_FULL_BYTES
            partial.delete()
            throw StoreFailure(if (full) StoreFailure.Reason.NO_SPACE else StoreFailure.Reason.NETWORK, e.message)
        } catch (e: InterruptedException) {
            partial.delete()
            throw e
        } finally {
            connection.disconnect()
        }
        val hash = digest.digest().joinToString("") { "%02x".format(it) }
        if (release.sha256 != null && !release.sha256.equals(hash, ignoreCase = true)) {
            partial.delete()
            throw StoreFailure(StoreFailure.Reason.CORRUPT)
        }
        target.delete()
        if (!partial.renameTo(target)) throw StoreFailure(StoreFailure.Reason.UNREADABLE)
        try {
            verify(context, target, app)
        } catch (e: StoreFailure) {
            target.delete()
            throw e
        }
        return target
    }

    /** Contrato: solo llega al instalador un APK de la app pedida, firmado por quien corresponde. */
    private fun verify(context: Context, file: File, app: CatalogApp) {
        val pm = context.packageManager
        val info = pm.getPackageArchiveInfo(file.absolutePath, signatureFlags(Build.VERSION.SDK_INT))
            ?: throw StoreFailure(StoreFailure.Reason.UNREADABLE)
        if (info.packageName != app.packageName) throw StoreFailure(StoreFailure.Reason.WRONG_PACKAGE, info.packageName)
        val apkMinSdk = info.applicationInfo?.minSdkVersion ?: 0
        if (apkMinSdk > Build.VERSION.SDK_INT) throw StoreFailure(StoreFailure.Reason.TOO_NEW, apkMinSdk.toString())
        if (app.signers.isNotEmpty() && signers(info).none { it in app.signers }) {
            throw StoreFailure(StoreFailure.Reason.WRONG_SIGNER)
        }
    }

    /**
     * En Android 9, `getPackageArchiveInfo` solo lee las firmas del archivo si se le pide la constante
     * vieja. Con la nueva sola, `signingInfo` vuelve vacío y todo APK parece mal firmado.
     */
    @Suppress("DEPRECATION")
    internal fun signatureFlags(sdk: Int): Int = when {
        sdk < Build.VERSION_CODES.P -> PackageManager.GET_SIGNATURES
        sdk == Build.VERSION_CODES.P -> PackageManager.GET_SIGNATURES or PackageManager.GET_SIGNING_CERTIFICATES
        else -> PackageManager.GET_SIGNING_CERTIFICATES
    }

    /** SHA-256 de cada certificado que firmó el paquete, en hex. */
    internal fun signers(info: PackageInfo): List<String> {
        @Suppress("DEPRECATION")
        val raw = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            info.signingInfo?.apkContentsSigners
        } else {
            info.signatures
        }
        return raw.orEmpty().map { signature ->
            MessageDigest.getInstance("SHA-256").digest(signature.toByteArray()).joinToString("") { "%02x".format(it) }
        }
    }
}
