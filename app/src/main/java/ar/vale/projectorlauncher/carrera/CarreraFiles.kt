package ar.vale.projectorlauncher.carrera

import android.content.Context
import java.io.IOException

/**
 * Los archivos del juego: lo que hay dentro de `assets/carrera`, y nada más. El nombre se acepta
 * solo con letras, números, punto, guion y a lo sumo la carpeta `assets/`, así que no hay cómo
 * salir de ahí. Los usa la pared (desde el APK) y el celular (por el servidor).
 */
class CarreraFiles(private val context: Context) {

    /** [fixed]: lleva su huella en el nombre y no cambia nunca; las páginas sí. */
    class File(val type: String, val bytes: ByteArray, val fixed: Boolean)

    fun open(name: String): File? {
        if (!NAME.matches(name)) return null
        val type = TYPES[name.substringAfterLast('.')] ?: return null
        val bytes = try {
            context.assets.open("carrera/$name").use { it.readBytes() }
        } catch (e: IOException) {
            return null
        }
        return File(type, bytes, name.startsWith("assets/"))
    }

    companion object {
        val NAME = Regex("(?:assets/)?[A-Za-z0-9_-]+(?:\\.[A-Za-z0-9]+)+")
        val TYPES = mapOf(
            "html" to "text/html; charset=utf-8", "js" to "text/javascript; charset=utf-8", "css" to "text/css; charset=utf-8",
            "svg" to "image/svg+xml", "ttf" to "font/ttf", "glb" to "model/gltf-binary",
            "wav" to "audio/wav"
        )
    }
}
