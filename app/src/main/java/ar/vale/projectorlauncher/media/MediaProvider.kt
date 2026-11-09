package ar.vale.projectorlauncher.media

import android.content.ContentProvider
import android.content.ContentResolver
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.os.ParcelFileDescriptor
import android.webkit.MimeTypeMap
import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.MediaTypes
import java.io.File
import java.io.FileNotFoundException

/**
 * Le presta un video a otro reproductor (VLC, Just Player) cuando el del sistema no puede con el
 * formato. Solo lectura, solo medios, no exportado: el permiso va en cada intent.
 */
class MediaProvider : ContentProvider() {

    override fun onCreate(): Boolean = true

    override fun openFile(uri: Uri, mode: String): ParcelFileDescriptor =
        ParcelFileDescriptor.open(fileFor(uri), ParcelFileDescriptor.MODE_READ_ONLY)

    override fun getType(uri: Uri): String? = mimeOf(File(uri.path.orEmpty()))
    override fun query(uri: Uri, p: Array<String>?, s: String?, a: Array<String>?, o: String?): Cursor? = null
    override fun insert(uri: Uri, values: ContentValues?): Uri? = null
    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int = 0
    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<String>?): Int = 0

    private fun fileFor(uri: Uri): File {
        val file = File(uri.path ?: throw FileNotFoundException("sin ruta"))
        val kind = MediaTypes.kindOf(file)
        val media = kind == FileKind.VIDEO || kind == FileKind.AUDIO
        if (!file.isFile || !media) throw FileNotFoundException(file.path)
        return file
    }

    companion object {
        fun uriFor(context: Context, file: File): Uri =
            Uri.Builder()
                .scheme(ContentResolver.SCHEME_CONTENT)
                .authority("${context.packageName}.media")
                .path(file.absolutePath)
                .build()

        fun mimeOf(file: File): String =
            MimeTypeMap.getSingleton().getMimeTypeFromExtension(file.extension.lowercase()) ?: "video/*"
    }
}
