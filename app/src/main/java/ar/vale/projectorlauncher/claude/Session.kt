package ar.vale.projectorlauncher.claude

import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

/**
 * Una conversación: pregunta, respuesta en streaming y el ciclo de herramientas.
 * No conoce Android, para poder probarla contra un servidor falso.
 *
 * El historial solo crece, y se devuelve tal como llegó: los bloques de pensamiento se validan
 * por firma. Si un turno falla, se vuelve al estado anterior a la pregunta.
 */
class Session(
    private val transport: Transport,
    private val model: Models.Model,
    private val webSearch: Boolean,
    private val system: String,
    private val runner: ToolRunner,
    private val listener: Listener
) {

    enum class End { DONE, REFUSED, TRUNCATED, FAILED, CANCELLED, TOO_LONG }

    interface Listener {
        /** Empieza un paso nuevo de la respuesta: el texto anterior ya se puede reemplazar. */
        fun onStep() {}
        fun onText(text: String)
        fun onActivity(what: String) {}

        /** Una herramienta está por correr, con lo que le pidieron. Sirve para mostrar el paso a paso. */
        fun onTool(name: String, input: JSONObject) {}
        fun onEnd(end: End, error: Throwable?)
    }

    private val history = ArrayList<JSONObject>()
    private var useFallbacks = true
    @Volatile private var cancelled = false

    val turns: Int get() = history.size

    fun cancel() {
        cancelled = true
        transport.cancel()
    }

    /** Bloquea hasta terminar: se llama desde un hilo propio. */
    fun ask(question: String) {
        cancelled = false
        transport.reset()
        val mark = history.size
        history.add(Request.userText(question))
        val end = runCatching { loop() }
        val result = end.getOrNull()
        if (result != End.DONE) {
            while (history.size > mark) history.removeAt(history.size - 1)
        }
        val error = end.exceptionOrNull()
        listener.onEnd(result ?: if (cancelled) End.CANCELLED else End.FAILED, error.takeUnless { cancelled })
    }

    private fun loop(): End {
        var pauses = 0
        var steps = 0
        while (true) {
            if (cancelled) return End.CANCELLED
            if (steps++ >= MAX_STEPS) return End.TOO_LONG
            listener.onStep()
            val acc = send()
            val reply = History.echo(acc.content())
            when (acc.stopReason) {
                "end_turn", "stop_sequence" -> {
                    // Sin contenido no hay turno que guardar: un mensaje vacío rompería el pedido siguiente.
                    if (reply.length() > 0) history.add(Request.assistant(reply))
                    return End.DONE
                }
                "tool_use" -> {
                    history.add(Request.assistant(reply))
                    history.add(Request.toolResults(runTools(reply, acc)))
                }
                "pause_turn" -> {
                    if (++pauses > MAX_PAUSES) return End.TOO_LONG
                    history.add(Request.assistant(reply))
                }
                "refusal" -> return End.REFUSED
                "max_tokens" -> return End.TRUNCATED
                else -> throw IOException("El stream terminó sin motivo: ${acc.stopReason}")
            }
        }
    }

    private fun send(): StreamAccumulator {
        while (true) {
            val acc = StreamAccumulator()
            acc.onBlockStart = { block ->
                when (block.optString("type")) {
                    "server_tool_use" -> {
                        listener.onActivity(block.optString("name"))
                        listener.onTool(block.optString("name"), JSONObject())
                    }
                    "tool_use" -> listener.onActivity(block.optString("name"))
                }
            }
            val body = Request.body(model, system, Tools.schema(), history, webSearch, useFallbacks)
            try {
                transport.stream(body) { event, data ->
                    acc.accept(event, data)?.let(listener::onText)
                }
                return acc
            } catch (e: ApiError) {
                // El reintento con otro modelo es una beta: si la cuenta no la tiene, se sigue sin él.
                if (!useFallbacks || !body.has("fallbacks") || !e.rejectedFallbacks) throw e
                useFallbacks = false
            }
        }
    }

    /** Todos los resultados van en un solo mensaje, cada uno con el id de su pedido. */
    private fun runTools(reply: JSONArray, acc: StreamAccumulator): List<JSONObject> {
        val results = ArrayList<JSONObject>()
        for (i in 0 until reply.length()) {
            val block = reply.getJSONObject(i)
            if (block.optString("type") != "tool_use") continue
            val id = block.getString("id")
            val name = block.getString("name")
            // Detener corta también lo que faltaba hacer en este paso: no se sigue tocando nada.
            if (cancelled) {
                results.add(Request.toolResult(id, "Detenido por la persona.", isError = true))
                continue
            }
            val raw = acc.invalidInputs[id]
            if (raw != null) {
                results.add(Request.invalidInput(id, raw))
                continue
            }
            val input = block.optJSONObject("input") ?: JSONObject()
            val problem = Tools.validate(name, input)
            if (problem != null) {
                results.add(Request.toolResult(id, problem, isError = true))
                continue
            }
            listener.onTool(name, input)
            val outcome = runCatching { runner.run(name, input) }
                .getOrElse { ToolOutcome("No se pudo: ${it.message}", isError = true) }
            results.add(Request.toolResult(id, outcome.text, outcome.isError))
        }
        return results
    }

    private companion object {
        /** Buscar una película y darle reproducir son unos diez pasos: cada toque es un pedido. */
        const val MAX_STEPS = 30
        const val MAX_PAUSES = 5
    }
}
