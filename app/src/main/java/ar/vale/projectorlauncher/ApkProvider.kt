package ar.vale.projectorlauncher

import android.content.ContentProvider
import android.content.ContentResolver
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import android.os.ParcelFileDescriptor
import android.provider.OpenableColumns
import java.io.File
import java.io.FileNotFoundException

/**
 * Sirve archivos .apk al instalador del sistema vía content:// (desde Android 7
 * no se permite file://). Sin AndroidX no hay FileProvider, así que es propio y
 * mínimo: solo lee, solo .apk, no exportado y con permisos de URI por intent.
 */
class ApkProvider : ContentProvider() {

    override fun onCreate(): Boolean = true

    override fun openFile(uri: Uri, mode: String): ParcelFileDescriptor =
        ParcelFileDescriptor.open(fileFor(uri), ParcelFileDescriptor.MODE_READ_ONLY)

    override fun getType(uri: Uri): String = MIME

    override fun query(
        uri: Uri,
        projection: Array<String>?,
        selection: String?,
        selectionArgs: Array<String>?,
        sortOrder: String?
    ): Cursor {
        val file = fileFor(uri)
        val cols = projection ?: arrayOf(OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE)
        val cursor = MatrixCursor(cols, 1)
        val row = cursor.newRow()
        for (c in cols) {
            when (c) {
                OpenableColumns.DISPLAY_NAME -> row.add(file.name)
                OpenableColumns.SIZE -> row.add(file.length())
                else -> row.add(null)
            }
        }
        return cursor
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? = null
    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int = 0
    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<String>?): Int = 0

    private fun fileFor(uri: Uri): File {
        val path = uri.path ?: throw FileNotFoundException("sin ruta")
        val file = File(path)
        if (!file.isFile || !file.name.endsWith(".apk", ignoreCase = true)) {
            throw FileNotFoundException(path)
        }
        return file
    }

    companion object {
        const val MIME = "application/vnd.android.package-archive"

        fun authority(context: Context): String = "${context.packageName}.apk"

        fun uriFor(context: Context, file: File): Uri =
            Uri.Builder()
                .scheme(ContentResolver.SCHEME_CONTENT)
                .authority(authority(context))
                .path(file.absolutePath)
                .build()
    }
}
