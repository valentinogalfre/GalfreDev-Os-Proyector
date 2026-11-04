package ar.vale.projectorlauncher

import java.io.File
import java.util.Locale

enum class FileKind { DIR, VIDEO, AUDIO, IMAGE, APK, OTHER }

/** Clasifica archivos por extensión para elegir ícono y reproductor. */
object MediaTypes {
    private val VIDEO = setOf("mp4", "mkv", "avi", "mov", "webm", "3gp", "m4v", "flv", "ts", "wmv", "mpg", "mpeg")
    private val AUDIO = setOf("mp3", "wav", "flac", "aac", "ogg", "m4a", "wma", "opus", "amr")
    private val IMAGE = setOf("jpg", "jpeg", "png", "gif", "bmp", "webp", "heic", "heif")

    fun kindOf(file: File): FileKind {
        if (file.isDirectory) return FileKind.DIR
        return when (file.extension.lowercase(Locale.ROOT)) {
            "apk" -> FileKind.APK
            in VIDEO -> FileKind.VIDEO
            in AUDIO -> FileKind.AUDIO
            in IMAGE -> FileKind.IMAGE
            else -> FileKind.OTHER
        }
    }
}

/** [label] permite mostrar un nombre amigable (p. ej. "Memoria interna") en vez del nombre del directorio. */
data class FileItem(val file: File, val kind: FileKind, val label: String? = null) {
    val name: String get() = label ?: file.name
}
