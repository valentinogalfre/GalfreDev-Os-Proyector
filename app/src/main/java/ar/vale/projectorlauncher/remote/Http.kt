package ar.vale.projectorlauncher.remote

import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.FilterInputStream
import java.io.InputStream
import java.io.OutputStream
import java.net.URLDecoder

class HttpError(val status: Int, message: String) : Exception(message)

class HttpRequest(
    val method: String,
    val path: String,
    val query: Map<String, String>,
    private val headers: Map<String, String>,
    val contentLength: Long,
    val body: InputStream,
    /** La dirección del cliente. Los intentos de PIN se cuentan por dirección. */
    val remote: String = "",
    /** Si llegó por la conexión cifrada: cambia el origen que se le acepta al navegador. */
    val secure: Boolean = false
) {
    fun header(name: String): String? = headers[name.lowercase()]

    /** Lee el cuerpo entero, con tope: nadie llena la memoria de un equipo de 1 GB con un JSON. */
    fun text(limit: Int): String {
        if (contentLength > limit) throw HttpError(413, "cuerpo demasiado grande")
        val out = ByteArrayOutputStream()
        val buffer = ByteArray(4096)
        while (true) {
            val n = body.read(buffer)
            if (n < 0) break
            out.write(buffer, 0, n)
        }
        return out.toString("UTF-8")
    }
}

/** Lector de HTTP/1.1 mínimo, con límites duros: acepta solo lo que necesita la página del celular. */
object HttpParser {

    private const val MAX_LINE = 8192
    private const val MAX_HEADERS = 48

    /** Devuelve null si la conexión se cerró sin mandar nada. */
    fun parse(input: InputStream, remote: String = "", secure: Boolean = false): HttpRequest? {
        val first = line(input) ?: return null
        val parts = first.split(' ')
        if (parts.size != 3 || !parts[2].startsWith("HTTP/1.")) throw HttpError(400, "pedido inválido")
        val headers = HashMap<String, String>()
        while (true) {
            val line = line(input) ?: throw HttpError(400, "cabeceras incompletas")
            if (line.isEmpty()) break
            if (headers.size >= MAX_HEADERS) throw HttpError(431, "demasiadas cabeceras")
            val colon = line.indexOf(':')
            if (colon <= 0) throw HttpError(400, "cabecera inválida")
            headers[line.substring(0, colon).trim().lowercase()] = line.substring(colon + 1).trim()
        }
        // Una longitud explícita es lo único que permite poner un tope antes de leer.
        if (headers.containsKey("transfer-encoding")) throw HttpError(411, "hace falta Content-Length")
        val length = headers["content-length"]?.let {
            it.toLongOrNull()?.takeIf { n -> n >= 0 } ?: throw HttpError(400, "Content-Length inválido")
        } ?: 0L
        val target = parts[1]
        if (!target.startsWith("/")) throw HttpError(400, "ruta inválida")
        val path = target.substringBefore('?')
        val query = if ('?' in target) decodeQuery(target.substringAfter('?')) else emptyMap()
        return HttpRequest(parts[0], path, query, headers, length, Limited(input, length), remote, secure)
    }

    private fun decodeQuery(text: String): Map<String, String> = text.split('&').filter { it.isNotEmpty() }.associate { pair ->
        val key = pair.substringBefore('=')
        val value = pair.substringAfter('=', "")
        runCatching { URLDecoder.decode(key, "UTF-8") to URLDecoder.decode(value, "UTF-8") }
            .getOrElse { throw HttpError(400, "consulta inválida") }
    }

    private fun line(input: InputStream): String? {
        val out = StringBuilder()
        while (true) {
            val c = input.read()
            if (c < 0) {
                if (out.isEmpty()) return null
                throw HttpError(400, "línea incompleta")
            }
            if (c == '\n'.code) break
            if (out.length >= MAX_LINE) throw HttpError(431, "línea demasiado larga")
            out.append(c.toChar())
        }
        if (out.endsWith('\r')) out.setLength(out.length - 1)
        return out.toString()
    }

    /** Nunca lee más allá de lo declarado. */
    private class Limited(input: InputStream, private var left: Long) : FilterInputStream(input) {
        override fun read(): Int {
            if (left <= 0) return -1
            val c = super.read()
            if (c >= 0) left--
            return c
        }

        override fun read(b: ByteArray, off: Int, len: Int): Int {
            if (left <= 0) return -1
            val n = super.read(b, off, minOf(len.toLong(), left).toInt())
            if (n > 0) left -= n
            return n
        }
    }
}

class HttpResponse(
    val status: Int,
    private val type: String,
    private val bytes: ByteArray? = null,
    private val stream: InputStream? = null,
    private val length: Long = bytes?.size?.toLong() ?: -1L,
    private val cacheSeconds: Int = 0,
    /** Qué puede cargar la página. La del juego trae sus propios archivos de código; la otra no. */
    private val policy: String = PAGE_POLICY
) {
    fun write(out: OutputStream) {
        val head = StringBuilder("HTTP/1.1 $status ${reason(status)}\r\n")
        head.append("Content-Type: $type\r\n")
        if (length >= 0) head.append("Content-Length: $length\r\n")
        head.append("Connection: close\r\n")
        head.append("Cache-Control: ").append(if (cacheSeconds > 0) "public, max-age=$cacheSeconds" else "no-store").append("\r\n")
        head.append("X-Content-Type-Options: nosniff\r\n")
        head.append("X-Frame-Options: DENY\r\n")
        head.append("Referrer-Policy: no-referrer\r\n")
        head.append("Content-Security-Policy: ").append(policy).append("\r\n")
        head.append("\r\n")
        out.write(head.toString().toByteArray(Charsets.ISO_8859_1))
        if (bytes != null) out.write(bytes)
        stream?.use { it.copyTo(out) }
        out.flush()
    }

    companion object {
        const val PAGE_POLICY =
            "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"

        /**
         * La carrera: código solo de este mismo servidor, y la conexión del volante. `ws:` va
         * explícito porque no todos los navegadores lo cuentan dentro de 'self'. Los modelos y sus
         * texturas se arman en memoria, de ahí `blob:`.
         */
        const val GAME_POLICY =
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; " +
                "connect-src 'self' ws: wss: data: blob:; worker-src 'self' blob:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"

        fun json(status: Int, value: JSONObject) =
            HttpResponse(status, "application/json; charset=utf-8", value.toString().toByteArray(Charsets.UTF_8))

        fun ok(extra: JSONObject = JSONObject()) = json(200, extra.put("ok", true))

        fun error(status: Int, code: String) = json(status, JSONObject().put("error", code))

        private fun reason(status: Int) = when (status) {
            200 -> "OK"
            400 -> "Bad Request"
            401 -> "Unauthorized"
            403 -> "Forbidden"
            404 -> "Not Found"
            405 -> "Method Not Allowed"
            409 -> "Conflict"
            411 -> "Length Required"
            413 -> "Payload Too Large"
            415 -> "Unsupported Media Type"
            423 -> "Locked"
            429 -> "Too Many Requests"
            431 -> "Request Header Fields Too Large"
            503 -> "Service Unavailable"
            507 -> "Insufficient Storage"
            else -> "Error"
        }
    }
}
