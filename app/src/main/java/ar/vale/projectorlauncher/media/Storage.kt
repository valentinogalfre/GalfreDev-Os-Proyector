package ar.vale.projectorlauncher.media

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import ar.vale.projectorlauncher.FileItem
import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.MediaTypes
import ar.vale.projectorlauncher.R
import java.io.File

/**
 * Qué puede leer el sistema. Hay dos niveles a propósito: los ajustes de Android TV no traen la
 * pantalla de «acceso a todos los archivos», así que en esos equipos el permiso común de medios
 * tiene que alcanzar para ver videos y fotos. APK y PDF sí necesitan el acceso completo.
 */
object Storage {

    enum class Access { NONE, MEDIA, FULL }

    /**
     * Lo que llega del celular. Es la carpeta propia de la app: no depende de ningún permiso, así
     * que lo recibido se ve siempre, y dar el acceso completo más tarde no lo deja huérfano.
     */
    fun inbox(context: Context): File =
        File(context.getExternalFilesDir(null) ?: context.filesDir, "recibidos").apply { mkdirs() }

    fun access(context: Context): Access = when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && Environment.isExternalStorageManager() -> Access.FULL
        hasMediaPermission(context) ->
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) Access.FULL else Access.MEDIA
        else -> Access.NONE
    }

    private fun hasMediaPermission(context: Context): Boolean =
        mediaPermissions().all { context.checkSelfPermission(it) == PackageManager.PERMISSION_GRANTED }

    fun mediaPermissions(): Array<String> =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            arrayOf(
                Manifest.permission.READ_MEDIA_VIDEO,
                Manifest.permission.READ_MEDIA_AUDIO,
                Manifest.permission.READ_MEDIA_IMAGES
            )
        } else {
            arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE)
        }

    /** Pantalla del sistema para el acceso completo; null si este equipo no la tiene. */
    fun fullAccessIntent(context: Context): Intent? {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return null
        val pm = context.packageManager
        return listOf(
            Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, Uri.parse("package:${context.packageName}")),
            Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)
        ).firstOrNull { pm.resolveActivity(it, 0) != null }
    }

    /** Memoria interna y lo que esté conectado por USB o tarjeta. */
    fun roots(context: Context): List<FileItem> {
        val roots = ArrayList<FileItem>()
        val internal = Environment.getExternalStorageDirectory()
        if (internal != null && internal.exists()) {
            roots.add(FileItem(internal, FileKind.DIR, context.getString(R.string.files_internal)))
        }
        File("/storage").listFiles()?.forEach { dir ->
            val skip = !dir.isDirectory || dir.name == "emulated" || dir.name == "self" ||
                dir.absolutePath == internal?.absolutePath || !dir.canRead()
            if (!skip) roots.add(FileItem(dir, FileKind.DIR, context.getString(R.string.files_usb, dir.name)))
        }
        return roots
    }

    fun list(dir: File, apkOnly: Boolean): List<FileItem> {
        val items = ArrayList<FileItem>()
        dir.listFiles()?.forEach { file ->
            if (file.isHidden) return@forEach
            val kind = MediaTypes.kindOf(file)
            if (!apkOnly || kind == FileKind.DIR || kind == FileKind.APK) items.add(FileItem(file, kind))
        }
        return items.sortedWith(
            compareByDescending<FileItem> { it.kind == FileKind.DIR }.thenBy { it.name.lowercase() }
        )
    }

    /** Hermanos del archivo del mismo tipo, en orden: son la lista de reproducción. */
    fun siblings(file: File, kind: FileKind): List<File> =
        file.parentFile?.listFiles()
            ?.filter { !it.isHidden && MediaTypes.kindOf(it) == kind }
            ?.sortedBy { it.name.lowercase() }
            ?: listOf(file)

}
