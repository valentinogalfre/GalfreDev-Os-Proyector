package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ApiError
import ar.vale.projectorlauncher.claude.HttpTransport
import ar.vale.projectorlauncher.claude.Models
import ar.vale.projectorlauncher.claude.Session
import ar.vale.projectorlauncher.claude.ToolOutcome
import ar.vale.projectorlauncher.claude.ToolRunner
import ar.vale.projectorlauncher.claude.Transport
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.Timeout
import java.io.ByteArrayOutputStream
import java.net.ServerSocket
import kotlin.concurrent.thread

/** Respuestas guionadas, como las mandaría la API. */
private class Script(private vararg val replies: List<Pair<String, String>>) : Transport {
    val bodies = ArrayList<JSONObject>()
    private var next = 0
    var failFirstWith: ApiError? = null

    override fun stream(body: JSONObject, onEvent: (String, JSONObject) -> Unit) {
        bodies.add(JSONObject(body.toString()))
        failFirstWith?.let {
            failFirstWith = null
            throw it
        }
        replies[next++].forEach { (event, data) -> onEvent(event, JSONObject(data)) }
    }

    override fun cancel() = Unit
}

private fun text(value: String) = listOf(
    "content_block_start" to """{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}""",
    "content_block_delta" to JSONObject().put("type", "content_block_delta").put("index", 0)
        .put("delta", JSONObject().put("type", "text_delta").put("text", value)).toString(),
    "content_block_stop" to """{"type":"content_block_stop","index":0}"""
)

private fun stop(reason: String) =
    listOf("message_delta" to """{"type":"message_delta","delta":{"stop_reason":"$reason"}}""")

private fun tool(index: Int, id: String, name: String, json: String) = listOf(
    "content_block_start" to """{"type":"content_block_start","index":$index,"content_block":{"type":"tool_use","id":"$id","name":"$name","input":{}}}""",
    "content_block_delta" to JSONObject().put("type", "content_block_delta").put("index", index)
        .put("delta", JSONObject().put("type", "input_json_delta").put("partial_json", json)).toString(),
    "content_block_stop" to """{"type":"content_block_stop","index":$index}"""
)

class ClaudeSessionTest {

    /** Hay sockets de verdad: si algo se traba, que falle en vez de colgar la suite. */
    @get:Rule
    val timeout: Timeout = Timeout.seconds(20)

    private class Recorder : Session.Listener {
        val text = StringBuilder()
        var end: Session.End? = null
        var error: Throwable? = null
        val events = ArrayList<String>()
        override fun onStep() { events.add("paso") }
        override fun onActivity(what: String) { events.add("actividad:$what") }
        override fun onText(text: String) { this.text.append(text) }
        override fun onEnd(end: Session.End, error: Throwable?) {
            this.end = end
            this.error = error
        }
    }

    private val ran = ArrayList<String>()
    private val runner = ToolRunner { name, input ->
        ran.add("$name$input")
        ToolOutcome("hecho $name")
    }

    private fun session(transport: Transport, recorder: Recorder, model: String = "claude-opus-5-5") =
        Session(transport, Models.of(model), false, "s", runner, recorder)

    @Test
    fun `contrato - una respuesta simple termina y queda en el historial`() {
        val script = Script(text("hola") + stop("end_turn"))
        val r = Recorder()
        val s = session(script, r)
        s.ask("che")
        assertEquals("hola", r.text.toString())
        assertEquals(Session.End.DONE, r.end)
        assertEquals(2, s.turns)
    }

    @Test
    fun `contrato - todos los resultados van en un mensaje con sus ids y en orden`() {
        val script = Script(
            tool(0, "a", "volumen", """{"porcentaje":10}""") + tool(1, "b", "abrir_calibracion", "{}") + stop("tool_use"),
            text("listo") + stop("end_turn")
        )
        val r = Recorder()
        session(script, r).ask("che")
        assertEquals(Session.End.DONE, r.end)
        assertEquals(2, ran.size)
        val messages = script.bodies[1].getJSONArray("messages")
        val results = messages.getJSONObject(messages.length() - 1)
        assertEquals("user", results.getString("role"))
        val content = results.getJSONArray("content")
        assertEquals(2, content.length())
        assertEquals("a", content.getJSONObject(0).getString("tool_use_id"))
        assertEquals("b", content.getJSONObject(1).getString("tool_use_id"))
    }

    @Test
    fun `contrato - lo que la herramienta cuenta mientras corre llega al renglon de estado`() {
        val script = Script(
            tool(0, "a", "tocar", """{"elemento":1}""") + stop("tool_use"),
            text("listo") + stop("end_turn")
        )
        val looking = object : ToolRunner {
            override fun run(name: String, input: JSONObject) = ToolOutcome("hecho $name")
            override fun run(name: String, input: JSONObject, phase: (String) -> Unit): ToolOutcome {
                phase("ver_pantalla")
                return run(name, input)
            }
        }
        val r = Recorder()
        Session(script, Models.of("claude-opus-5-5"), false, "s", looking, r).ask("che")
        // El toque ya está hecho cuando mira: el renglón no puede seguir diciendo «tocando…».
        assertEquals(listOf("paso", "actividad:tocar", "actividad:ver_pantalla", "paso"), r.events)
    }

    @Test
    fun `contrato - el pedido siguiente repite el turno anterior sin cambios`() {
        val thinking = listOf(
            "content_block_start" to """{"type":"content_block_start","index":0,"content_block":{"type":"thinking","thinking":"","signature":""}}""",
            "content_block_delta" to """{"type":"content_block_delta","index":0,"delta":{"type":"signature_delta","signature":"firma"}}""",
            "content_block_stop" to """{"type":"content_block_stop","index":0}"""
        )
        val script = Script(
            thinking + tool(1, "a", "listar_apps", "{}") + stop("tool_use"),
            text("listo") + stop("end_turn")
        )
        session(script, Recorder()).ask("che")
        val assistant = script.bodies[1].getJSONArray("messages").getJSONObject(1)
        assertEquals("firma", assistant.getJSONArray("content").getJSONObject(0).getString("signature"))
    }

    @Test
    fun `contrato - una entrada invalida vuelve como error y no toca el equipo`() {
        val script = Script(
            tool(0, "a", "volumen", """{"porcentaje":10""") + stop("tool_use"),
            text("perdón") + stop("end_turn")
        )
        session(script, Recorder()).ask("che")
        assertTrue(ran.isEmpty())
        val messages = script.bodies[1].getJSONArray("messages")
        val result = messages.getJSONObject(messages.length() - 1).getJSONArray("content").getJSONObject(0)
        assertTrue(result.getBoolean("is_error"))
        assertTrue(result.getString("content").contains("INVALID_JSON"))
    }

    @Test
    fun `contrato - una entrada fuera de rango vuelve como error y no toca el equipo`() {
        val script = Script(
            tool(0, "a", "volumen", """{"porcentaje":900}""") + stop("tool_use"),
            text("perdón") + stop("end_turn")
        )
        session(script, Recorder()).ask("che")
        assertTrue(ran.isEmpty())
    }

    @Test
    fun `contrato - con max_tokens no se ejecuta ninguna herramienta`() {
        val script = Script(tool(0, "a", "volumen", """{"porcentaje":10}""") + stop("max_tokens"))
        val r = Recorder()
        val s = session(script, r)
        s.ask("che")
        assertTrue(ran.isEmpty())
        assertEquals(Session.End.TRUNCATED, r.end)
        assertEquals(0, s.turns)
    }

    @Test
    fun `contrato - un rechazo no ejecuta herramientas y deja el historial como estaba`() {
        val script = Script(tool(0, "a", "volumen", """{"porcentaje":10}""") + stop("refusal"))
        val r = Recorder()
        val s = session(script, r)
        s.ask("che")
        assertTrue(ran.isEmpty())
        assertEquals(Session.End.REFUSED, r.end)
        assertEquals(0, s.turns)
    }

    @Test
    fun `contrato - las herramientas del modelo que declino no se ejecutan`() {
        val fallback = listOf(
            "content_block_start" to """{"type":"content_block_start","index":1,"content_block":{"type":"fallback","from":{"model":"a"},"to":{"model":"b"}}}""",
            "content_block_stop" to """{"type":"content_block_stop","index":1}"""
        )
        val script = Script(
            tool(0, "viejo", "volumen", """{"porcentaje":10}""") + fallback +
                tool(2, "nuevo", "abrir_calibracion", "{}") + stop("tool_use"),
            text("listo") + stop("end_turn")
        )
        session(script, Recorder()).ask("che")
        assertEquals(1, ran.size)
        assertTrue(ran[0].startsWith("abrir_calibracion"))
    }

    @Test
    fun `contrato - pause_turn sigue sin agregar un mensaje del usuario`() {
        val script = Script(text("a") + stop("pause_turn"), text("b") + stop("end_turn"))
        val r = Recorder()
        session(script, r).ask("che")
        assertEquals(Session.End.DONE, r.end)
        val messages = script.bodies[1].getJSONArray("messages")
        assertEquals(2, messages.length())
        assertEquals("assistant", messages.getJSONObject(1).getString("role"))
    }

    @Test
    fun `contrato - manejar una app lleva muchos pasos y la conversacion los aguanta`() {
        val steps = (1..20).map { tool(0, "t$it", "ver_pantalla", "{}") + stop("tool_use") }
        val script = Script(*(steps + listOf(text("listo") + stop("end_turn"))).toTypedArray())
        val r = Recorder()
        session(script, r).ask("poné una peli")
        assertEquals(Session.End.DONE, r.end)
        assertEquals(20, ran.size)
    }

    @Test
    fun `contrato - una tarea que no termina nunca se corta sola`() {
        val step = tool(0, "t", "ver_pantalla", "{}") + stop("tool_use")
        val script = Script(*Array(60) { step })
        val r = Recorder()
        session(script, r).ask("che")
        assertEquals(Session.End.TOO_LONG, r.end)
        assertTrue("con tope: cada paso se cobra", ran.size <= 30)
    }

    @Test
    fun `contrato - detener corta tambien lo que faltaba tocar en ese paso`() {
        val both = tool(0, "t1", "tocar", """{"elemento":1}""") + tool(1, "t2", "tocar", """{"elemento":2}""") + stop("tool_use")
        val script = Script(both, text("no debería llegar") + stop("end_turn"))
        val r = Recorder()
        lateinit var s: Session
        val stopping = ToolRunner { name, input ->
            ran.add("$name$input")
            s.cancel()
            ToolOutcome("hecho")
        }
        s = Session(script, Models.of("claude-opus-5-5"), false, "s", stopping, r)
        s.ask("tocá dos cosas")
        assertEquals("el segundo toque no ocurre", 1, ran.size)
        assertEquals(Session.End.CANCELLED, r.end)
    }

    @Test
    fun `contrato - pause_turn sin fin se corta`() {
        val turn = text("a") + stop("pause_turn")
        val script = Script(turn, turn, turn, turn, turn, turn, turn, turn)
        val r = Recorder()
        val s = session(script, r)
        s.ask("che")
        assertEquals(Session.End.TOO_LONG, r.end)
        assertEquals(0, s.turns)
    }

    @Test
    fun `contrato - si la cuenta no tiene la beta se sigue sin reintento de modelo`() {
        val script = Script(text("hola") + stop("end_turn"))
        script.failFirstWith = ApiError(400, "invalid_request_error", "Unexpected value(s) for the `anthropic-beta` header.")
        val r = Recorder()
        session(script, r).ask("che")
        assertEquals(Session.End.DONE, r.end)
        assertTrue(script.bodies[0].has("fallbacks"))
        assertFalse(script.bodies[1].has("fallbacks"))
    }

    @Test
    fun `contrato - un 400 cualquiera no se reintenta`() {
        val script = Script(text("hola") + stop("end_turn"))
        script.failFirstWith = ApiError(400, "invalid_request_error", "messages: bad")
        val r = Recorder()
        val s = session(script, r)
        s.ask("che")
        assertEquals(Session.End.FAILED, r.end)
        assertEquals(1, script.bodies.size)
        assertEquals(0, s.turns)
    }

    @Test
    fun `contrato - un stream cortado no deja media conversacion`() {
        val script = Script(text("hola"))
        val r = Recorder()
        val s = session(script, r)
        s.ask("che")
        assertEquals(Session.End.FAILED, r.end)
        assertEquals(0, s.turns)
    }

    @Test
    fun `contrato - un error en una herramienta vuelve a Claude sin cortar la charla`() {
        val failing = ToolRunner { _, _ -> throw IllegalStateException("roto") }
        val script = Script(tool(0, "a", "listar_apps", "{}") + stop("tool_use"), text("no pude") + stop("end_turn"))
        val r = Recorder()
        Session(script, Models.ALL[0], false, "s", failing, r).ask("che")
        assertEquals(Session.End.DONE, r.end)
        val messages = script.bodies[1].getJSONArray("messages")
        assertTrue(messages.getJSONObject(messages.length() - 1).getJSONArray("content").getJSONObject(0).getBoolean("is_error"))
    }

    // --- Contra un servidor de verdad, con sockets ---

    private class Fake(private vararg val responses: String) {
        val requests = ArrayList<String>()
        private val server = ServerSocket(0)
        val url = "http://127.0.0.1:${server.localPort}/v1/messages"

        init {
            thread(isDaemon = true) {
                for (response in responses) {
                    val client = runCatching { server.accept() }.getOrNull() ?: return@thread
                    client.use { c ->
                        val input = c.getInputStream()
                        val raw = ByteArrayOutputStream()
                        while (!raw.toString("UTF-8").endsWith("\r\n\r\n")) {
                            val next = input.read()
                            if (next < 0) break
                            raw.write(next)
                        }
                        val head = raw.toString("UTF-8")
                        // Content-Length cuenta bytes: con acentos no coincide con los caracteres.
                        val length = head.lines().firstOrNull { it.lowercase().startsWith("content-length:") }
                            ?.substringAfter(':')?.trim()?.toInt() ?: 0
                        val body = input.readNBytes(length)
                        synchronized(requests) { requests.add(head + String(body, Charsets.UTF_8)) }
                        c.getOutputStream().write(response.toByteArray(Charsets.UTF_8))
                        c.getOutputStream().flush()
                    }
                }
            }
        }
    }

    private fun sse(events: List<Pair<String, String>>): String {
        val body = events.joinToString("") { (event, data) -> "event: $event\ndata: $data\n\n" }
        return "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nConnection: close\r\n\r\n$body"
    }

    private fun failure(status: Int, type: String) =
        """{"type":"error","error":{"type":"$type","message":"x"}}""".let {
            "HTTP/1.1 $status Error\r\nContent-Type: application/json\r\nContent-Length: ${it.length}\r\nConnection: close\r\n\r\n$it"
        }

    @Test
    fun `contrato - el pedido real lleva la clave, la version y la beta`() {
        val fake = Fake(sse(text("hola") + stop("end_turn")))
        val r = Recorder()
        Session(HttpTransport("sk-ant-prueba", fake.url), Models.of("claude-opus-5-5"), false, "s", runner, r).ask("che")
        assertEquals("hola", r.text.toString())
        val request = fake.requests[0].lowercase()
        assertTrue(request.startsWith("post /v1/messages"))
        assertTrue(request.contains("x-api-key: sk-ant-prueba"))
        assertTrue(request.contains("anthropic-version: 2026-10-21"))
        assertTrue(request.contains("anthropic-beta: server-side-fallback-2026-07-01"))
    }

    @Test
    fun `contrato - despues de detener, la siguiente pregunta funciona`() {
        val fake = Fake(sse(text("hola") + stop("end_turn")))
        val r = Recorder()
        val s = Session(HttpTransport("k", fake.url), Models.ALL[0], false, "s", runner, r)
        s.cancel()
        s.ask("che")
        assertEquals(Session.End.DONE, r.end)
        assertEquals("hola", r.text.toString())
    }

    @Test
    fun `contrato - Haiku no manda la cabecera beta`() {
        val fake = Fake(sse(text("hola") + stop("end_turn")))
        Session(HttpTransport("sk-ant-prueba", fake.url), Models.of("claude-haiku-5-5"), false, "s", runner, Recorder()).ask("che")
        assertFalse(fake.requests[0].lowercase().contains("anthropic-beta"))
    }

    @Test
    fun `contrato - saturacion antes de empezar se reintenta sola`() {
        val fake = Fake(failure(529, "overloaded_error"), sse(text("hola") + stop("end_turn")))
        val r = Recorder()
        Session(HttpTransport("k", fake.url, backoffMs = 1), Models.ALL[0], false, "s", runner, r).ask("che")
        assertEquals(Session.End.DONE, r.end)
        assertEquals(2, fake.requests.size)
    }

    @Test
    fun `contrato - una clave invalida se informa sin reintentar`() {
        val fake = Fake(failure(401, "authentication_error"))
        val r = Recorder()
        Session(HttpTransport("k", fake.url, backoffMs = 1), Models.ALL[0], false, "s", runner, r).ask("che")
        assertEquals(Session.End.FAILED, r.end)
        assertEquals(401, (r.error as ApiError).status)
        assertEquals(1, fake.requests.size)
    }

    @Test
    fun `contrato - con parte de la respuesta en pantalla no se repite el pedido`() {
        val partial = sse(text("hola") + listOf("error" to """{"type":"error","error":{"type":"overloaded_error","message":"x"}}"""))
        val fake = Fake(partial, sse(text("otra") + stop("end_turn")))
        val r = Recorder()
        Session(HttpTransport("k", fake.url, backoffMs = 1), Models.ALL[0], false, "s", runner, r).ask("che")
        assertEquals(Session.End.FAILED, r.end)
        assertEquals("hola", r.text.toString())
        assertEquals(1, fake.requests.size)
    }
}
