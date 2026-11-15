package ar.vale.projectorlauncher.remote

import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.security.MessageDigest
import java.util.Base64
import java.util.concurrent.ArrayBlockingQueue
import kotlin.concurrent.thread

/** Una conexión que queda abierta y lleva mensajes de texto en los dos sentidos. */
interface Channel {
    /** El próximo mensaje, o null si la conexión terminó. */
    fun read(): String?

    /** False si no se pudo encolar: la conexión está cerrada o el otro lado no lee. */
    fun send(text: String): Boolean

    fun close()

    /** Lo cierra porque el mismo jugador entró desde otro lado: al que queda afuera se le avisa que no insista. */
    fun replace() = close()
}

/** Quien atiende una conexión abierta. Vuelve cuando la conexión termina. */
fun interface SocketHandler {
    fun serve(channel: Channel, remote: String)
}

/**
 * WebSocket (RFC 6455) mínimo, del lado del servidor y con límites duros: solo texto, mensajes
 * chicos y nada de extensiones. Es lo que necesita un volante: mandar el giro treinta veces por
 * segundo por una sola conexión, en lugar de abrir una por pedido.
 */
class WebSocket(private val input: InputStream, private val output: OutputStream, private val maxMessage: Int = MAX_MESSAGE) : Channel {

    /** Lo que falta mandar. Si se llena, el otro lado no está leyendo: se descarta en vez de frenar a todos. */
    private val outbox = ArrayBlockingQueue<ByteArray>(OUTBOX)
    @Volatile private var open = true
    private val writer = thread(name = "gd-socket-out", isDaemon = true) { drain() }

    override fun read(): String? {
        val message = ByteArrayOutputStream()
        var continuing = false
        try {
            while (open) {
                val first = input.read()
                val second = input.read()
                if (first < 0 || second < 0) return end()
                val final = first and 0x80 != 0
                val opcode = first and 0x0f
                // Sin extensiones no hay bits reservados; y un navegador siempre enmascara lo que manda.
                if (first and 0x70 != 0 || second and 0x80 == 0) return fail(PROTOCOL)
                var length = (second and 0x7f).toLong()
                if (length == 126L) length = number(2) else if (length == 127L) length = number(8)
                val control = opcode >= 0x8
                if (length < 0 || length > maxMessage || (control && (length > 125 || !final))) return fail(if (control) PROTOCOL else TOO_BIG)
                val mask = bytes(4)
                val payload = bytes(length.toInt())
                for (i in payload.indices) payload[i] = (payload[i].toInt() xor mask[i and 3].toInt()).toByte()
                when (opcode) {
                    CONTINUATION, TEXT -> {
                        if ((opcode == TEXT) == continuing) return fail(PROTOCOL)
                        if (message.size() + payload.size > maxMessage) return fail(TOO_BIG)
                        message.write(payload)
                        continuing = !final
                        if (final) return message.toString("UTF-8")
                    }
                    PING -> queue(frame(PONG, payload))
                    PONG -> Unit
                    CLOSE -> return fail(NORMAL)
                    else -> return fail(UNSUPPORTED)
                }
            }
        } catch (e: IOException) {
            // Se cortó o venció el tiempo sin que llegara nada: para quien lee es lo mismo que un cierre.
        }
        return end()
    }

    override fun send(text: String): Boolean = queue(frame(TEXT, text.toByteArray(Charsets.UTF_8)))

    override fun close() {
        fail(NORMAL)
    }

    override fun replace() {
        fail(REPLACED)
    }

    private fun queue(frame: ByteArray): Boolean = open && outbox.offer(frame)

    private fun fail(code: Int): String? {
        if (open) {
            outbox.clear()
            outbox.offer(frame(CLOSE, byteArrayOf((code shr 8).toByte(), code.toByte())))
        }
        return end()
    }

    private fun end(): String? {
        open = false
        // Un marco vacío despierta al que escribe para que termine.
        outbox.offer(ByteArray(0))
        return null
    }

    private fun drain() {
        try {
            while (true) {
                val frame = outbox.take()
                if (frame.isEmpty()) break
                output.write(frame)
                if (outbox.isEmpty()) output.flush()
            }
            output.flush()
        } catch (e: IOException) {
            open = false
        } catch (e: InterruptedException) {
            open = false
        }
    }

    private fun number(size: Int): Long {
        var value = 0L
        for (b in bytes(size)) value = (value shl 8) or (b.toLong() and 0xff)
        return value
    }

    private fun bytes(size: Int): ByteArray {
        val out = ByteArray(size)
        var done = 0
        while (done < size) {
            val n = input.read(out, done, size - done)
            if (n < 0) throw IOException("conexión cortada")
            done += n
        }
        return out
    }

    companion object {
        /** Un mensaje del volante entra en cien bytes. Esto deja lugar para un nombre y nada más. */
        const val MAX_MESSAGE = 2048
        private const val OUTBOX = 96
        private const val CONTINUATION = 0x0
        private const val TEXT = 0x1
        private const val CLOSE = 0x8
        private const val PING = 0x9
        private const val PONG = 0xA
        private const val NORMAL = 1000
        private const val PROTOCOL = 1002
        private const val UNSUPPORTED = 1003
        private const val TOO_BIG = 1009

        /** De los códigos que el estándar deja libres. La página del volante lo conoce y no reintenta. */
        const val REPLACED = 4001
        private const val GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

        /** True si el pedido quiere pasar a WebSocket y viene bien formado. */
        fun wanted(r: HttpRequest): Boolean =
            r.method == "GET" && r.header("upgrade").equals("websocket", ignoreCase = true) &&
                r.header("sec-websocket-version") == "13" && key(r) != null

        private fun key(r: HttpRequest): String? = r.header("sec-websocket-key")?.takeIf {
            runCatching { Base64.getDecoder().decode(it).size == 16 }.getOrDefault(false)
        }

        /** La respuesta que cierra el saludo: prueba que del otro lado hay un servidor de WebSocket. */
        fun accept(r: HttpRequest): ByteArray {
            val digest = MessageDigest.getInstance("SHA-1").digest((key(r)!! + GUID).toByteArray(Charsets.ISO_8859_1))
            return ("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n" +
                "Sec-WebSocket-Accept: ${Base64.getEncoder().encodeToString(digest)}\r\n\r\n").toByteArray(Charsets.ISO_8859_1)
        }

        /** Un marco del servidor: entero y sin máscara. */
        fun frame(opcode: Int, payload: ByteArray): ByteArray {
            val out = ByteArrayOutputStream(payload.size + 10)
            out.write(0x80 or opcode)
            when {
                payload.size < 126 -> out.write(payload.size)
                payload.size < 65536 -> {
                    out.write(126)
                    out.write(payload.size shr 8)
                    out.write(payload.size)
                }
                else -> {
                    out.write(127)
                    for (shift in 56 downTo 0 step 8) out.write((payload.size.toLong() shr shift).toInt())
                }
            }
            out.write(payload)
            return out.toByteArray()
        }
    }
}
