package ar.vale.projectorlauncher.remote

import java.io.File

/** El nombre de un archivo que llega del celular es un dato ajeno: nunca decide una ruta. */
object Uploads {

    private const val MAX_NAME = 120
    private const val FORBIDDEN = "<>:\"|?*"

    /** Se resta del espacio libre: la longitud la declara el cliente, y sumarla puede desbordar. */
    fun fits(usable: Long, length: Long, margin: Long): Boolean = usable - margin > length

    /** Solo queda el nombre: sin carpetas, sin caracteres de control y sin archivos ocultos. */
    fun safeName(raw: String): String? {
        val base = raw.substringAfterLast('/').substringAfterLast('\\')
        val clean = base.filter { !it.isISOControl() && it !in FORBIDDEN }.trim().trimStart('.', ' ')
        if (clean.isEmpty()) return null
        if (clean.length <= MAX_NAME) return clean
        val dot = clean.lastIndexOf('.')
        val ext = if (dot > 0 && clean.length - dot <= 10) clean.substring(dot) else ""
        return clean.take(MAX_NAME - ext.length) + ext
    }

    /** No pisa lo que ya está: `foto.jpg` pasa a `foto (2).jpg`. */
    fun unique(dir: File, name: String): File {
        val first = File(dir, name)
        if (!first.exists()) return first
        val dot = name.lastIndexOf('.')
        val stem = if (dot > 0) name.substring(0, dot) else name
        val ext = if (dot > 0) name.substring(dot) else ""
        var n = 2
        while (true) {
            val candidate = File(dir, "$stem ($n)$ext")
            if (!candidate.exists()) return candidate
            n++
        }
    }
}
