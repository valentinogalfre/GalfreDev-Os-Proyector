package ar.vale.projectorlauncher.juntada

import ar.vale.projectorlauncher.remote.Uploads
import java.io.File
import java.io.IOException
import java.io.InputStream

/**
 * Los archivos de la fila de presentaciones. Cada presentación tiene su carpeta, con un solo
 * archivo adentro: así el reproductor muestra ese y ningún otro, y dos personas que mandan
 * `demo.pdf` no se pisan.
 *
 * Viven en la carpeta de la app y se van con la presentación. No pasan por Cine.
 */
class DemoFiles(private val root: File, private val margin: Long = SPACE_MARGIN) {

    fun fits(length: Long): Boolean {
        root.mkdirs()
        return Uploads.fits(root.usableSpace, length, margin)
    }

    private fun dir(id: Int) = File(root, id.toString())

    fun file(id: Int, name: String): File = File(dir(id), name)

    fun exists(id: Int, name: String): Boolean = file(id, name).isFile

    /** Lo que está entrando ahora, para poder cortarlo si esa presentación deja de existir. */
    private class Incoming(val id: Int, val body: InputStream)

    @Volatile private var incoming: Incoming? = null

    /**
     * Recibe lo que llega en un archivo aparte, sin tocar el que ya estaba: una subida que se
     * corta no deja a nadie sin el archivo que tenía. Tarda lo que tarde la red.
     */
    fun receive(id: Int, length: Long, body: InputStream) {
        val partial = File(dir(id).apply { mkdirs() }, PART)
        incoming = Incoming(id, body)
        try {
            val copied = partial.outputStream().use { body.copyTo(it) }
            if (copied != length) throw IOException("llegó incompleto")
        } catch (e: IOException) {
            partial.delete()
            throw e
        } finally {
            incoming = null
        }
    }

    /**
     * Lo recibido pasa a ser el archivo de la presentación, y el anterior se va. Es un instante:
     * por eso puede hacerse con la fila quieta, sin que nadie reciba el turno a mitad del cambio.
     */
    fun commit(id: Int, name: String): File {
        val dir = dir(id)
        val partial = File(dir, PART)
        val target = File(dir, name)
        if (!partial.renameTo(target)) {
            partial.delete()
            throw IOException("no se pudo guardar")
        }
        dir.listFiles()?.filter { it != target }?.forEach { it.delete() }
        return target
    }

    /** Lo recibido no se usa: se va, y el archivo que había queda como estaba. */
    fun discard(id: Int) {
        File(dir(id), PART).delete()
    }

    /**
     * La presentación ya no existe. Si su archivo estaba entrando, se corta ahí: nadie espera a
     * que termine de llegar algo que no se va a mostrar.
     */
    fun drop(id: Int) {
        incoming?.takeIf { it.id == id }?.let { runCatching { it.body.close() } }
        dir(id).deleteRecursively()
    }

    /** Borra lo que quedó de presentaciones que ya no existen: una subida cortada por un apagón, por ejemplo. */
    fun sweep(keep: Collection<Int>) {
        val names = keep.map { it.toString() }.toSet()
        root.listFiles()?.filter { it.name !in names }?.forEach { it.deleteRecursively() }
        root.listFiles()?.forEach { File(it, PART).delete() }
    }

    companion object {
        /** Empieza con punto: el reproductor no lo toma por un archivo para mostrar. */
        const val PART = ".subiendo"
        private const val SPACE_MARGIN = 150L * 1024 * 1024
    }
}
