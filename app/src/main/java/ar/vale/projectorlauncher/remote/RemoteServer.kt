package ar.vale.projectorlauncher.remote

import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.IOException
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.RejectedExecutionException
import java.util.concurrent.SynchronousQueue
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit

/**
 * Servidor de una conexión por pedido, con topes: nadie en la red, ni siquiera sin token, puede
 * ocupar todas las conexiones y dejar afuera al celular del dueño.
 */
class RemoteServer(
    private val router: Router,
    /** Con un fabricante de sockets cifrados, el mismo servidor atiende por HTTPS. */
    private val sockets: (Int) -> ServerSocket = ::ServerSocket,
    private val secure: Boolean = false,
    private val requestMs: Long = REQUEST_MS,
    private val replyMs: Long = REPLY_MS,
    private val reapMs: Long = REAP_MS
) {

    @Volatile private var socket: ServerSocket? = null
    private val pool = ThreadPoolExecutor(0, MAX_CONNECTIONS, IDLE_SECONDS, TimeUnit.SECONDS, SynchronousQueue())

    /**
     * Cuándo vence cada conexión. El tiempo de espera del socket no alcanza: cuenta por lectura,
     * así que un byte cada tanto lo reinicia, y no cubre las escrituras.
     */
    private val deadlines = ConcurrentHashMap<Socket, Long>()
    private val perAddress = ConcurrentHashMap<String, Int>()
    @Volatile private var reaper: Thread? = null

    /** Devuelve el puerto en uso. */
    @Throws(IOException::class)
    fun start(firstPort: Int = PORT, attempts: Int = PORT_ATTEMPTS): Int {
        var last: IOException? = null
        for (port in firstPort until firstPort + attempts) {
            try {
                val server = sockets(port)
                socket = server
                Thread({ accept(server) }, "gd-remote").start()
                reaper = Thread({ reap() }, "gd-remote-reaper").apply {
                    isDaemon = true
                    start()
                }
                return server.localPort
            } catch (e: IOException) {
                last = e
            }
        }
        throw last ?: IOException("sin puerto")
    }

    fun stop() {
        runCatching { socket?.close() }
        socket = null
        reaper?.interrupt()
        reaper = null
        deadlines.keys.forEach { client -> runCatching { client.close() } }
        pool.shutdownNow()
    }

    private fun accept(server: ServerSocket) {
        while (!server.isClosed) {
            val client = try {
                server.accept()
            } catch (e: IOException) {
                return
            }
            val address = client.inetAddress?.hostAddress.orEmpty()
            if (perAddress.merge(address, 1) { a, b -> a + b } ?: 0 > MAX_PER_ADDRESS) {
                release(address)
                runCatching { client.close() }
                continue
            }
            try {
                pool.execute {
                    try {
                        serve(client, address)
                    } finally {
                        release(address)
                    }
                }
            } catch (e: RejectedExecutionException) {
                release(address)
                runCatching { client.close() }
            }
        }
    }

    private fun release(address: String) {
        perAddress.computeIfPresent(address) { _, count -> if (count <= 1) null else count - 1 }
    }

    private fun reap() {
        while (true) {
            try {
                Thread.sleep(reapMs)
            } catch (e: InterruptedException) {
                return
            }
            val now = now()
            for ((client, deadline) in deadlines) {
                if (now > deadline) runCatching { client.close() }
            }
        }
    }

    private fun serve(client: Socket, address: String) {
        deadlines[client] = now() + requestMs
        try {
            client.use {
                runCatching {
                    it.soTimeout = READ_TIMEOUT_MS
                    val input = BufferedInputStream(it.getInputStream())
                    val response = try {
                        val request = HttpParser.parse(input, address, secure) ?: return
                        if (router.isLong(request)) deadlines[client] = Long.MAX_VALUE
                        router.handle(request)
                    } catch (e: HttpError) {
                        HttpResponse.error(e.status, e.message ?: "error")
                    }
                    deadlines[client] = now() + replyMs
                    BufferedOutputStream(it.getOutputStream()).use(response::write)
                }
            }
        } finally {
            deadlines.remove(client)
        }
    }

    private fun now() = System.nanoTime() / 1_000_000

    companion object {
        const val PORT = 8686
        /** Un navegador abre hasta seis conexiones a la vez para traer una página. */
        const val MAX_PER_ADDRESS = 6
        private const val PORT_ATTEMPTS = 5
        /** En una juntada hay muchos celulares consultando a la vez, cada uno un instante. */
        private const val MAX_CONNECTIONS = 32
        private const val IDLE_SECONDS = 30L
        private const val READ_TIMEOUT_MS = 20_000
        private const val REQUEST_MS = 10_000L
        private const val REPLY_MS = 30_000L
        private const val REAP_MS = 1_000L
    }
}
