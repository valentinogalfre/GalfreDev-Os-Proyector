package ar.vale.projectorlauncher.carrera

import ar.vale.projectorlauncher.remote.Channel
import java.util.concurrent.LinkedBlockingQueue

/**
 * El canal de la pared con la sala. La pared corre en el mismo proceso que la sala, así que no
 * hay red de por medio: la página deja sus mensajes con [push] y se lleva los suyos con [drain],
 * una vez por cuadro. Si la página deja de pasar a buscarlos, el canal se cierra y ella abre otro.
 */
class Pipe(private val limit: Int = LIMIT) : Channel {

    private val incoming = LinkedBlockingQueue<String>(limit)
    private val outgoing = ArrayList<String>()
    @Volatile private var closed = false

    fun push(text: String) {
        if (!closed && !incoming.offer(text)) close()
    }

    /** Lo que la sala dejó para la pared, como una lista JSON. `null` si el canal ya no sirve. */
    fun drain(): String? = synchronized(outgoing) {
        if (closed) return null
        val all = outgoing.joinToString(",", "[", "]")
        outgoing.clear()
        all
    }

    override fun read(): String? {
        if (closed) return null
        val next = incoming.take()
        return if (next === END) null else next
    }

    override fun send(text: String): Boolean = synchronized(outgoing) {
        if (closed) return false
        if (outgoing.size >= limit) {
            close()
            return false
        }
        outgoing.add(text)
        true
    }

    override fun close() {
        closed = true
        incoming.clear()
        incoming.offer(END)
    }

    private companion object {
        const val LIMIT = 512

        /** Marca de fin: se compara por identidad, así que ningún mensaje puede hacerse pasar por ella. */
        val END = String(charArrayOf('f', 'i', 'n'))
    }
}
