package ar.vale.projectorlauncher.claude

import org.json.JSONObject
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

/** Cómo llega un pedido a la API. Es una interfaz para poder probar la conversación sin red. */
interface Transport {
    /** Bloquea hasta que termina el stream. Lanza [ApiError] o [IOException]. */
    fun stream(body: JSONObject, onEvent: (String, JSONObject) -> Unit)
    fun cancel()

    /** Empieza una pregunta nueva: la cancelación de la anterior ya no cuenta. */
    fun reset() = Unit
}

/** Lector de Server-Sent Events: junta `event:` y `data:` hasta la línea en blanco. */
object Sse {
    fun read(reader: BufferedReader, onEvent: (String, String) -> Unit) {
        var event = ""
        val data = StringBuilder()
        while (true) {
            val line = reader.readLine() ?: break
            when {
                line.isEmpty() -> {
                    if (data.isNotEmpty()) onEvent(event, data.toString())
                    event = ""
                    data.setLength(0)
                }
                line.startsWith("event:") -> event = line.substring(6).trim()
                line.startsWith("data:") -> {
                    if (data.isNotEmpty()) data.append('\n')
                    data.append(line.substring(5).trim())
                }
            }
        }
    }
}

class HttpTransport(
    private val apiKey: String,
    private val endpoint: String = ENDPOINT,
    private val backoffMs: Long = 1500L
) : Transport {

    @Volatile private var connection: HttpURLConnection? = null
    @Volatile private var cancelled = false

    override fun cancel() {
        cancelled = true
        connection?.disconnect()
    }

    override fun reset() {
        cancelled = false
    }

    override fun stream(body: JSONObject, onEvent: (String, JSONObject) -> Unit) {
        var attempt = 0
        while (true) {
            var received = false
            try {
                once(body) { event, data ->
                    received = true
                    onEvent(event, data)
                }
                return
            } catch (e: ApiError) {
                // Con parte de la respuesta en pantalla ya no se puede repetir el pedido a ciegas.
                if (received || !e.retriable || attempt >= RETRIES) throw e
                Thread.sleep(backoffMs shl attempt)
                attempt++
            }
        }
    }

    private fun once(body: JSONObject, onEvent: (String, JSONObject) -> Unit) {
        // Detener durante la espera de un reintento: no se manda un pedido que después se cobra.
        if (cancelled) throw IOException("cancelado")
        val bytes = body.toString().toByteArray(Charsets.UTF_8)
        val c = URL(endpoint).openConnection() as HttpURLConnection
        connection = c
        try {
            c.requestMethod = "POST"
            c.doOutput = true
            c.connectTimeout = CONNECT_MS
            c.readTimeout = READ_MS
            c.setFixedLengthStreamingMode(bytes.size)
            c.setRequestProperty("content-type", "application/json")
            c.setRequestProperty("x-api-key", apiKey)
            c.setRequestProperty("anthropic-version", API_VERSION)
            if (body.has("fallbacks")) c.setRequestProperty("anthropic-beta", FALLBACK_BETA)
            c.outputStream.use { it.write(bytes) }
            val status = c.responseCode
            if (status !in 200..299) throw errorFrom(status, c)
            BufferedReader(InputStreamReader(c.inputStream, Charsets.UTF_8)).use { reader ->
                Sse.read(reader) { event, data ->
                    if (cancelled) throw IOException("cancelado")
                    onEvent(event, JSONObject(data))
                }
            }
        } finally {
            connection = null
            c.disconnect()
        }
    }

    private fun errorFrom(status: Int, c: HttpURLConnection): ApiError {
        val text = runCatching { c.errorStream?.bufferedReader()?.use { it.readText() } }.getOrNull().orEmpty()
        val error = runCatching { JSONObject(text).optJSONObject("error") }.getOrNull()
        return ApiError(status, error?.optString("type"), error?.optString("message") ?: "HTTP $status")
    }

    companion object {
        const val ENDPOINT = "https://api.anthropic.com/v1/messages"
        const val API_VERSION = "2026-10-21"
        const val FALLBACK_BETA = "server-side-fallback-2026-07-01"
        private const val CONNECT_MS = 15_000
        private const val READ_MS = 120_000
        private const val RETRIES = 2
    }
}
