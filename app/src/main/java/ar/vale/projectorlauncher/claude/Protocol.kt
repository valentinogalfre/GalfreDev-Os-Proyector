package ar.vale.projectorlauncher.claude

import org.json.JSONArray
import org.json.JSONObject
import org.json.JSONTokener

/** Modelos que se pueden elegir. Las capacidades cambian por modelo, por eso están acá y no en el pedido. */
object Models {

    data class Model(val id: String, val label: String, val fallbacks: Boolean, val searchTool: String)

    val ALL = listOf(
        Model("claude-opus-5-5", "Opus 5.5", fallbacks = true, searchTool = "web_search_20260209"),
        Model("claude-sonnet-5-5", "Sonnet 5.5", fallbacks = true, searchTool = "web_search_20260209"),
        Model("claude-haiku-5-5", "Haiku 5.5", fallbacks = false, searchTool = "web_search_20250305")
    )

    fun of(id: String): Model = ALL.firstOrNull { it.id == id } ?: ALL.first()
}

/**
 * El cuerpo del pedido a la API de mensajes.
 *
 * Se usa HTTP directo y no el SDK oficial a propósito: `anthropic-java-core` pesa 39 MB más
 * Jackson y OkHttp, y este APK pesa uno, sin dependencias, para equipos de 1 GB de RAM.
 */
object Request {

    /** Con streaming no hay riesgo de que el pedido venza, y la respuesta real es mucho menor. */
    private const val MAX_TOKENS = 64000
    private const val MAX_SEARCHES = 3
    private const val STRUCTURED_TOKENS = 16000

    fun body(
        model: Models.Model,
        system: String,
        tools: JSONArray,
        messages: List<JSONObject>,
        webSearch: Boolean,
        useFallbacks: Boolean
    ): JSONObject {
        val allTools = JSONArray()
        for (i in 0 until tools.length()) allTools.put(tools.get(i))
        if (webSearch) {
            allTools.put(JSONObject().put("type", model.searchTool).put("name", "web_search").put("max_uses", MAX_SEARCHES))
        }
        val body = JSONObject()
            .put("model", model.id)
            .put("max_tokens", MAX_TOKENS)
            .put("stream", true)
            .put("system", system)
            .put("tools", allTools)
            .put("messages", JSONArray(messages))
            // Respuestas cortas para leer en una pared: pensar de más solo agrega demora y costo.
            .put("output_config", JSONObject().put("effort", "low"))
            .put("cache_control", JSONObject().put("type", "ephemeral"))
        if (useFallbacks && model.fallbacks) body.put("fallbacks", "default")
        return body
    }

    /**
     * Un pedido sin herramientas cuya respuesta tiene que cumplir un esquema: la API garantiza
     * que el texto que devuelve es un JSON válido con esa forma.
     */
    fun structured(model: Models.Model, system: String, user: String, schema: JSONObject): JSONObject = JSONObject()
        .put("model", model.id)
        .put("max_tokens", STRUCTURED_TOKENS)
        .put("stream", true)
        .put("system", system)
        .put("messages", JSONArray().put(userText(user)))
        .put(
            "output_config",
            JSONObject().put("effort", "low").put("format", JSONObject().put("type", "json_schema").put("schema", schema))
        )

    fun userText(text: String): JSONObject = JSONObject()
        .put("role", "user")
        .put("content", JSONArray().put(JSONObject().put("type", "text").put("text", text)))

    fun assistant(content: JSONArray): JSONObject =
        JSONObject().put("role", "assistant").put("content", content)

    fun toolResults(results: List<JSONObject>): JSONObject =
        JSONObject().put("role", "user").put("content", JSONArray(results))

    fun toolResult(id: String, content: String, isError: Boolean): JSONObject {
        val result = JSONObject().put("type", "tool_result").put("tool_use_id", id).put("content", content)
        if (isError) result.put("is_error", true)
        return result
    }

    /** Lo que pide la API cuando la entrada de una herramienta no se pudo leer. */
    fun invalidInput(id: String, raw: String): JSONObject =
        toolResult(id, JSONObject().put("INVALID_JSON", raw).toString(), isError = true)
}

/** Error de la API o del streaming. [status] es 0 si llegó dentro de un stream ya abierto. */
class ApiError(val status: Int, val type: String?, message: String) : Exception(message) {
    val retriable: Boolean get() = status == 429 || status == 500 || status == 529 || type == "overloaded_error"

    /** Sin saldo, la API puede responder 402 o un 400 que lo dice en el texto. */
    val noCredit: Boolean
        get() = status == 402 || (status == 400 && message.orEmpty().contains("credit balance", ignoreCase = true))

    /** La beta de reintento con otro modelo no está habilitada para esta cuenta. */
    val rejectedFallbacks: Boolean
        get() = status == 400 && (message.orEmpty().contains("anthropic-beta") || message.orEmpty().contains("fallbacks"))
}

/** Lo técnico de una falla, para entenderla en el proyector sin conectarle una computadora. */
object ErrorDetail {

    private const val MAX = 160
    private const val MAX_DEPTH = 8

    fun of(error: Throwable?): String? = when (error) {
        null -> null
        is ApiError -> "HTTP ${error.status}: ${error.message.orEmpty()}".take(MAX)
        else -> deepest(error).let { "${it.javaClass.simpleName}: ${it.message.orEmpty()}" }.take(MAX)
    }

    private fun deepest(error: Throwable): Throwable {
        var current = error
        repeat(MAX_DEPTH) { current = current.cause ?: return current }
        return current
    }
}

/**
 * Reconstruye la respuesta a partir de los eventos del stream.
 * Los tipos de delta que no conoce se ignoran: la API suma tipos nuevos sin avisar.
 */
class StreamAccumulator {

    private val blocks = java.util.TreeMap<Int, JSONObject>()
    private val fragments = HashMap<Int, StringBuilder>()

    var stopReason: String? = null
        private set
    var stopDetails: JSONObject? = null
        private set

    /** Entrada cruda de las herramientas que no se pudo leer, por id de `tool_use`. */
    val invalidInputs = HashMap<String, String>()

    /** Se llama al abrir un bloque, para mostrar qué está pasando. */
    var onBlockStart: (JSONObject) -> Unit = {}

    /** Procesa un evento. Devuelve el texto nuevo, si lo hay. */
    fun accept(event: String, data: JSONObject): String? {
        when (data.optString("type", event)) {
            "content_block_start" -> {
                val block = data.getJSONObject("content_block")
                blocks[data.getInt("index")] = block
                onBlockStart(block)
            }
            "content_block_delta" -> return delta(data.getInt("index"), data.getJSONObject("delta"))
            "content_block_stop" -> finish(data.getInt("index"))
            "message_delta" -> data.optJSONObject("delta")?.let { d ->
                if (!d.isNull("stop_reason")) stopReason = d.getString("stop_reason")
                stopDetails = d.optJSONObject("stop_details")
            }
            "error" -> {
                val error = data.optJSONObject("error")
                throw ApiError(0, error?.optString("type"), error?.optString("message").orEmpty())
            }
        }
        return null
    }

    private fun delta(index: Int, delta: JSONObject): String? {
        val block = blocks[index] ?: return null
        when (delta.optString("type")) {
            "text_delta" -> {
                val text = delta.getString("text")
                block.put("text", block.optString("text") + text)
                return text
            }
            "input_json_delta" -> fragments.getOrPut(index) { StringBuilder() }.append(delta.getString("partial_json"))
            "thinking_delta" -> block.put("thinking", block.optString("thinking") + delta.getString("thinking"))
            "signature_delta" -> block.put("signature", delta.getString("signature"))
            "citations_delta" -> {
                val citations = block.optJSONArray("citations") ?: JSONArray().also { block.put("citations", it) }
                citations.put(delta.get("citation"))
            }
        }
        return null
    }

    /** La entrada llega sin validar por `eager_input_streaming`: puede venir cortada o mal formada. */
    private fun finish(index: Int) {
        val raw = fragments.remove(index)?.toString() ?: return
        val block = blocks[index] ?: return
        if (raw.isBlank()) return
        val parsed = strictObject(raw)
        if (parsed != null) {
            block.put("input", parsed)
        } else {
            block.put("input", JSONObject())
            invalidInputs[block.optString("id")] = raw
        }
    }

    private fun strictObject(raw: String): JSONObject? = runCatching {
        val tokener = JSONTokener(raw)
        val value = tokener.nextValue() as? JSONObject ?: return null
        if (tokener.nextClean() != 0.toChar()) return null
        value
    }.getOrNull()

    fun content(): JSONArray = JSONArray(blocks.values.toList())
}

/** Qué parte de la respuesta vuelve a la API en el turno siguiente. */
object History {

    /**
     * Normalmente vuelve entera y sin tocar: los bloques de pensamiento se validan por firma.
     * Si otro modelo retomó la respuesta a mitad de camino, lo anterior al último bloque
     * `fallback` era del modelo que declinó: de eso solo se reenvían los textos y los pares
     * completos de herramientas de servidor. Tampoco se ejecutan sus `tool_use`.
     */
    fun echo(content: JSONArray): JSONArray {
        val blocks = (0 until content.length()).map { content.getJSONObject(it) }
        val boundary = blocks.indexOfLast { it.optString("type") == "fallback" }
        val results = blocks.mapNotNull { b -> b.optString("tool_use_id").ifEmpty { null } }.toSet()
        val uses = blocks.filter { it.optString("type") == "server_tool_use" }.map { it.optString("id") }.toSet()
        val out = JSONArray()
        blocks.forEachIndexed { i, block ->
            val type = block.optString("type")
            val keep = when {
                type == "fallback" -> false
                type == "text" -> block.optString("text").isNotEmpty()
                i > boundary -> true
                type == "server_tool_use" -> block.optString("id") in results
                type.endsWith("_tool_result") -> block.optString("tool_use_id") in uses
                else -> false
            }
            if (keep) out.put(block)
        }
        return out
    }
}

/** Separa el texto de la palabra marcada. Claude la marca entre asteriscos: `*así*`. */
object Markup {

    data class Parsed(val plain: String, val markStart: Int, val markEnd: Int) {
        val hasMark: Boolean get() = markEnd > markStart
    }

    /** Solo cuenta la primera marca: hay una cinta por pantalla. Los demás asteriscos se borran. */
    fun parse(text: String): Parsed {
        val plain = StringBuilder(text.length)
        var start = -1
        var end = -1
        var opened = -1
        for (c in text) {
            if (c != '*') {
                plain.append(c)
                continue
            }
            when {
                end >= 0 -> Unit
                opened < 0 -> opened = plain.length
                plain.length > opened -> {
                    start = opened
                    end = plain.length
                }
                else -> opened = -1
            }
        }
        return Parsed(plain.toString(), start.coerceAtLeast(0), end.coerceAtLeast(0))
    }
}
