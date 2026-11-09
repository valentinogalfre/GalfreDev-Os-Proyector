package ar.vale.projectorlauncher.media

import java.util.Locale

/** Formato de tiempos y tamaños para las columnas de datos. */
object Time {

    /** 1:02:05 o 12:34. */
    fun clock(ms: Long): String {
        val total = (ms / 1000).coerceAtLeast(0)
        val h = total / 3600
        val m = total % 3600 / 60
        val s = total % 60
        return if (h > 0) String.format(Locale.ROOT, "%d:%02d:%02d", h, m, s)
        else String.format(Locale.ROOT, "%d:%02d", m, s)
    }

    /** 1 h 02 min o 12 min. */
    fun short(ms: Long): String {
        val minutes = (ms / 60_000).coerceAtLeast(1)
        return if (minutes >= 60) String.format(Locale.ROOT, "%d h %02d min", minutes / 60, minutes % 60)
        else "$minutes min"
    }

    fun size(bytes: Long): String = when {
        bytes >= 1L shl 30 -> String.format(Locale.ROOT, "%.1f GB", bytes / (1L shl 30).toDouble())
        bytes >= 1L shl 20 -> String.format(Locale.ROOT, "%.1f MB", bytes / (1L shl 20).toDouble())
        bytes >= 1L shl 10 -> "${bytes shr 10} KB"
        else -> "$bytes B"
    }
}
