package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ApiError
import ar.vale.projectorlauncher.claude.History
import ar.vale.projectorlauncher.claude.Markup
import ar.vale.projectorlauncher.claude.Models
import ar.vale.projectorlauncher.claude.Request
import ar.vale.projectorlauncher.claude.StreamAccumulator
import ar.vale.projectorlauncher.claude.Tools
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ClaudeProtocolTest {

    private fun start(index: Int, block: String) =
        "content_block_start" to JSONObject("""{"type":"content_block_start","index":$index,"content_block":$block}""")

    private fun delta(index: Int, delta: String) =
        "content_block_delta" to JSONObject("""{"type":"content_block_delta","index":$index,"delta":$delta}""")

    private fun stop(index: Int) =
        "content_block_stop" to JSONObject("""{"type":"content_block_stop","index":$index}""")

    private fun StreamAccumulator.feed(vararg events: Pair<String, JSONObject>) = events.forEach { accept(it.first, it.second) }

    @Test
    fun `contrato - el texto llega en orden y se reconstruye completo`() {
        val acc = StreamAccumulator()
        acc.feed(start(0, """{"type":"text","text":""}"""))
        assertEquals("Ho", acc.accept("content_block_delta", delta(0, """{"type":"text_delta","text":"Ho"}""").second))
        acc.feed(delta(0, """{"type":"text_delta","text":"la"}"""), stop(0))
        assertEquals("Hola", acc.content().getJSONObject(0).getString("text"))
    }

    @Test
    fun `contrato - el pensamiento conserva su firma para volver intacto a la API`() {
        val acc = StreamAccumulator()
        acc.feed(
            start(0, """{"type":"thinking","thinking":"","signature":""}"""),
            delta(0, """{"type":"thinking_delta","thinking":"mmm"}"""),
            delta(0, """{"type":"signature_delta","signature":"firma"}"""),
            stop(0)
        )
        val block = acc.content().getJSONObject(0)
        assertEquals("mmm", block.getString("thinking"))
        assertEquals("firma", block.getString("signature"))
    }

    @Test
    fun `contrato - la entrada de una herramienta se arma con sus fragmentos`() {
        val acc = StreamAccumulator()
        acc.feed(
            start(0, """{"type":"tool_use","id":"t1","name":"abrir_app","input":{}}"""),
            delta(0, """{"type":"input_json_delta","partial_json":"{\"nombre\":"}"""),
            delta(0, """{"type":"input_json_delta","partial_json":"\"VLC\"}"}"""),
            stop(0)
        )
        assertEquals("VLC", acc.content().getJSONObject(0).getJSONObject("input").getString("nombre"))
        assertTrue(acc.invalidInputs.isEmpty())
    }

    @Test
    fun `contrato - una entrada cortada no se ejecuta y queda guardada cruda`() {
        val acc = StreamAccumulator()
        acc.feed(
            start(0, """{"type":"tool_use","id":"t1","name":"abrir_app","input":{}}"""),
            delta(0, """{"type":"input_json_delta","partial_json":"{\"nombre\":\"VL"}"""),
            stop(0)
        )
        assertEquals("{\"nombre\":\"VL", acc.invalidInputs["t1"])
        assertEquals(0, acc.content().getJSONObject(0).getJSONObject("input").length())
    }

    @Test
    fun `contrato - basura despues del objeto cuenta como entrada invalida`() {
        val acc = StreamAccumulator()
        acc.feed(
            start(0, """{"type":"tool_use","id":"t1","name":"abrir_app","input":{}}"""),
            delta(0, """{"type":"input_json_delta","partial_json":"{\"nombre\":\"VLC\"} extra"}"""),
            stop(0)
        )
        assertNotNull(acc.invalidInputs["t1"])
    }

    @Test
    fun `contrato - los deltas desconocidos se ignoran sin romper el stream`() {
        val acc = StreamAccumulator()
        acc.feed(
            start(0, """{"type":"text","text":"a"}"""),
            delta(0, """{"type":"un_delta_del_futuro","x":1}"""),
            stop(0)
        )
        assertEquals("a", acc.content().getJSONObject(0).getString("text"))
    }

    @Test
    fun `contrato - las citas se acumulan en su bloque`() {
        val acc = StreamAccumulator()
        acc.feed(
            start(0, """{"type":"text","text":"x"}"""),
            delta(0, """{"type":"citations_delta","citation":{"url":"https://a"}}"""),
            stop(0)
        )
        assertEquals(1, acc.content().getJSONObject(0).getJSONArray("citations").length())
    }

    @Test
    fun `contrato - el motivo de corte se lee de message_delta`() {
        val acc = StreamAccumulator()
        acc.accept("message_delta", JSONObject("""{"type":"message_delta","delta":{"stop_reason":"refusal","stop_details":{"category":"cyber"}}}"""))
        assertEquals("refusal", acc.stopReason)
        assertEquals("cyber", acc.stopDetails?.getString("category"))
    }

    @Test(expected = ApiError::class)
    fun `contrato - un error dentro del stream corta la respuesta`() {
        StreamAccumulator().accept("error", JSONObject("""{"type":"error","error":{"type":"overloaded_error","message":"x"}}"""))
    }

    @Test
    fun `contrato - sin cambio de modelo la respuesta vuelve entera`() {
        val content = JSONArray(
            """[{"type":"thinking","thinking":"a","signature":"s"},{"type":"text","text":"hola"},
                {"type":"tool_use","id":"t","name":"x","input":{}}]"""
        )
        val echo = History.echo(content)
        assertEquals(3, echo.length())
        assertEquals("s", echo.getJSONObject(0).getString("signature"))
    }

    @Test
    fun `contrato - lo del modelo que declino no vuelve salvo textos y pares de servidor`() {
        val content = JSONArray(
            """[{"type":"thinking","thinking":"a","signature":"s"},
                {"type":"text","text":"parcial"},
                {"type":"tool_use","id":"t0","name":"x","input":{}},
                {"type":"server_tool_use","id":"s1","name":"web_search","input":{}},
                {"type":"web_search_tool_result","tool_use_id":"s1","content":[]},
                {"type":"server_tool_use","id":"s2","name":"web_search","input":{}},
                {"type":"bloque_futuro"},
                {"type":"fallback","from":{"model":"a"},"to":{"model":"b"}},
                {"type":"thinking","thinking":"b","signature":"s2"},
                {"type":"tool_use","id":"t1","name":"y","input":{}}]"""
        )
        val echo = History.echo(content)
        val kept = (0 until echo.length()).map { echo.getJSONObject(it).let { b -> b.getString("type") + ":" + b.optString("id", b.optString("tool_use_id")) } }
        assertEquals(
            listOf("text:", "server_tool_use:s1", "web_search_tool_result:s1", "thinking:", "tool_use:t1"),
            kept
        )
    }

    @Test
    fun `contrato - un texto vacio nunca vuelve porque la API lo rechaza`() {
        val echo = History.echo(JSONArray("""[{"type":"text","text":""},{"type":"text","text":"a"}]"""))
        assertEquals(1, echo.length())
    }

    @Test
    fun `contrato - el pedido lleva streaming y esfuerzo bajo sin parametros prohibidos`() {
        val body = Request.body(Models.of("claude-opus-5-5"), "s", Tools.schema(), listOf(Request.userText("h")), true, true)
        assertTrue(body.getBoolean("stream"))
        assertEquals("low", body.getJSONObject("output_config").getString("effort"))
        assertEquals("default", body.getString("fallbacks"))
        assertEquals("ephemeral", body.getJSONObject("cache_control").getString("type"))
        for (banned in listOf("temperature", "top_p", "top_k", "thinking")) assertFalse(banned, body.has(banned))
    }

    @Test
    fun `contrato - Haiku no pide reintento con otro modelo`() {
        val body = Request.body(Models.of("claude-haiku-5-5"), "s", Tools.schema(), listOf(Request.userText("h")), false, true)
        assertFalse(body.has("fallbacks"))
    }

    @Test
    fun `contrato - la busqueda web es opcional y no lleva el campo de streaming`() {
        val model = Models.of("claude-opus-5-5")
        val with = Request.body(model, "s", Tools.schema(), listOf(Request.userText("h")), true, true).getJSONArray("tools")
        val without = Request.body(model, "s", Tools.schema(), listOf(Request.userText("h")), false, true).getJSONArray("tools")
        assertEquals(without.length() + 1, with.length())
        val search = with.getJSONObject(with.length() - 1)
        assertEquals("web_search_20260209", search.getString("type"))
        assertFalse(search.has("eager_input_streaming"))
    }

    @Test
    fun `contrato - un modelo desconocido cae en el predeterminado`() {
        assertEquals("claude-opus-5-5", Models.of("claude-viejo").id)
    }

    @Test
    fun `contrato - toda herramienta propia pide entrada temprana y tiene esquema`() {
        val tools = Tools.schema()
        for (i in 0 until tools.length()) {
            val tool = tools.getJSONObject(i)
            assertTrue(tool.getBoolean("eager_input_streaming"))
            assertEquals("object", tool.getJSONObject("input_schema").getString("type"))
            assertTrue(tool.getString("description").length > 40)
        }
    }

    @Test
    fun `contrato - la validacion rechaza lo que la API ya no valida`() {
        assertNull(Tools.validate("abrir_app", JSONObject("""{"nombre":"VLC"}""")))
        assertNotNull(Tools.validate("abrir_app", JSONObject("{}")))
        assertNotNull(Tools.validate("abrir_app", JSONObject("""{"nombre":""}""")))
        assertNotNull(Tools.validate("abrir_app", JSONObject("""{"nombre":12}""")))
        assertNotNull(Tools.validate("volumen", JSONObject("""{"porcentaje":101}""")))
        assertNotNull(Tools.validate("volumen", JSONObject("""{"porcentaje":12.5}""")))
        assertNotNull(Tools.validate("volumen", JSONObject("""{"porcentaje":"10"}""")))
        assertNull(Tools.validate("volumen", JSONObject("""{"porcentaje":0}""")))
        assertNotNull(Tools.validate("mostrar_pared", JSONObject("""{"modo":"otro"}""")))
        assertNull(Tools.validate("mostrar_pared", JSONObject("""{"modo":"hora"}""")))
        assertNotNull(Tools.validate("herramienta_inventada", JSONObject("{}")))
    }

    @Test
    fun `contrato - las herramientas de pantalla tambien validan lo que llega`() {
        assertNull(Tools.validate("ver_pantalla", JSONObject("{}")))
        assertNull(Tools.validate("tocar", JSONObject("""{"elemento":3}""")))
        assertNotNull(Tools.validate("tocar", JSONObject("{}")))
        assertNotNull(Tools.validate("tocar", JSONObject("""{"elemento":0}""")))
        assertNotNull(Tools.validate("tocar", JSONObject("""{"elemento":"3"}""")))
        assertNull(Tools.validate("escribir", JSONObject("""{"texto":"matrix"}""")))
        assertNull(Tools.validate("escribir", JSONObject("""{"texto":"matrix","elemento":2}""")))
        assertNotNull(Tools.validate("escribir", JSONObject("""{"elemento":2}""")))
        assertNull(Tools.validate("tecla", JSONObject("""{"nombre":"atras"}""")))
        assertNotNull(Tools.validate("tecla", JSONObject("""{"nombre":"apagar"}""")))
        assertNull(Tools.validate("deslizar", JSONObject("""{"direccion":"abajo"}""")))
        assertNotNull(Tools.validate("deslizar", JSONObject("""{"direccion":"diagonal"}""")))
        assertNotNull(Tools.validate("esperar", JSONObject("""{"segundos":60}""")))
        assertNull(Tools.validate("armar_trivia", JSONObject("""{"tema":"Kotlin"}""")))
        assertNotNull(Tools.validate("armar_trivia", JSONObject("""{"tema":"Kotlin","preguntas":40}""")))
    }

    @Test
    fun `contrato - toda herramienta que lee o toca otra app esta en la lista que avisa de la privacidad`() {
        val names = Tools.ALL.map { it.name }.toSet()
        assertTrue(names.containsAll(Tools.SCREEN))
        assertEquals(setOf("ver_pantalla", "tocar", "escribir", "tecla", "deslizar", "esperar"), Tools.SCREEN)
    }

    @Test
    fun `contrato - Claude solo abre direcciones https`() {
        assertTrue(Tools.isSafeUrl("https://galfredev.com/a?b=1"))
        for (url in listOf("http://a.com", "file:///sdcard/x", "intent://x#Intent;end", "javascript:alert(1)", "content://a/b", "https://", "nada")) {
            assertFalse(url, Tools.isSafeUrl(url))
        }
    }

    @Test
    fun `contrato - el resultado invalido usa la forma que pide la API`() {
        val result = Request.invalidInput("t1", "{\"a\"")
        assertTrue(result.getBoolean("is_error"))
        assertEquals("{\"a\"", JSONObject(result.getString("content")).getString("INVALID_JSON"))
    }

    @Test
    fun `contrato - una sola palabra marcada y sin asteriscos a la vista`() {
        val p = Markup.parse("El *cine* abre a las *nueve*.")
        assertEquals("El cine abre a las nueve.", p.plain)
        assertEquals("cine", p.plain.substring(p.markStart, p.markEnd))
    }

    @Test
    fun `contrato - una marca sin cerrar no se muestra ni rompe mientras llega`() {
        val p = Markup.parse("El *ci")
        assertEquals("El ci", p.plain)
        assertFalse(p.hasMark)
    }

    @Test
    fun `contrato - sin marca el texto queda igual`() {
        val p = Markup.parse("Nada para destacar.")
        assertEquals("Nada para destacar.", p.plain)
        assertFalse(p.hasMark)
    }

    @Test
    fun `contrato - dos asteriscos seguidos no marcan nada`() {
        val p = Markup.parse("2 ** 3")
        assertFalse(p.hasMark)
        assertEquals("2  3", p.plain)
    }
}
