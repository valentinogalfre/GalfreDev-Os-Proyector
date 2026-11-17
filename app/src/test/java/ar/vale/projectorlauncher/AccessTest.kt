package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.juntada.Juntada
import ar.vale.projectorlauncher.juntada.TriviaSource
import ar.vale.projectorlauncher.carrera.Carrera
import ar.vale.projectorlauncher.remote.Access
import ar.vale.projectorlauncher.remote.HttpParser
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.JuntadaRoutes
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.RemoteDevice
import ar.vale.projectorlauncher.remote.Router
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream

/**
 * Quién entra además del dueño, y hasta dónde. Cada prueba cuida una promesa hecha a quien presta
 * su proyector: nadie se conecta sin su permiso, y nadie con permiso llega a su clave, a Claude
 * ni a sus archivos.
 */
class AccessTest {

    private class Device : RemoteDevice {
        val calls = ArrayList<String>()
        var private = false
        override fun state() = JSONObject().also { calls.add("state") }
        override fun key(name: String) = RemoteDevice.Result.OK.also { calls.add("key:$name") }
        override fun text(value: String, submit: Boolean) = RemoteDevice.Result.OK.also { calls.add("text") }
        override fun link(url: String) = RemoteDevice.Result.OK.also { calls.add("link") }
        override fun upload(name: String, length: Long, body: InputStream) = name.also { calls.add("upload") }
        override fun saveClaudeKey(key: String) = true.also { calls.add("claude_key") }
        override fun askClaude(text: String) = RemoteDevice.Result.OK.also { calls.add("ask") }
        override fun claudeState() = JSONObject().also { calls.add("claude_state") }
        override fun stopClaude() { calls.add("claude_stop") }
        override fun pointer(x: Float, y: Float, visible: Boolean) { calls.add("pointer") }
        override fun tap(x: Float, y: Float) = RemoteDevice.Result.OK.also { calls.add("tap") }
        override fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float) = RemoteDevice.Result.OK.also { calls.add("swipe") }
        override fun apps() = JSONObject().also { calls.add("apps") }
        override fun open(pkg: String) = RemoteDevice.Result.OK.also { calls.add("open:$pkg") }
        override fun cast() = (if (receives) RemoteDevice.Result.OK else RemoteDevice.Result.NOT_INSTALLED).also { calls.add("cast") }
        var receives = true
        override fun fits(length: Long) = true
        override fun privateScreen() = private
    }

    private var clock = 1_000_000L
    private val pairing = Pairing("t".repeat(48), {}, { clock })
    private val device = Device()
    private val access = Access(now = { clock })
    private val house = Juntada(null, { clock })
    /** La carrera abierta que ve el control, o ninguna. */
    private var door: Carrera.Room? = null
    private val router = Router(
        pairing, device, JuntadaRoutes(house, TriviaSource { _, _ -> error("sin trivia") }), access,
        raceDoor = { owner -> door?.let { JSONObject().put("code", it.code).apply { if (owner) put("lead", it.leadTicket) } } }
    ) { null }

    private fun call(path: String, body: String = "{}", token: String?, method: String = "POST", extra: String = ""): HttpResponse {
        val head = StringBuilder("$method $path HTTP/1.1\r\nHost: 10.0.0.2:8686\r\nContent-Type: application/json\r\n")
        token?.let { head.append("Authorization: Bearer $it\r\n") }
        head.append(extra).append("Content-Length: ${body.toByteArray().size}\r\n\r\n").append(body)
        return router.handle(HttpParser.parse(ByteArrayInputStream(head.toString().toByteArray()))!!)
    }

    private fun HttpResponse.json(): JSONObject =
        JSONObject(ByteArrayOutputStream().also(::write).toString("UTF-8").substringAfter("\r\n\r\n"))

    /** Pide permiso como lo hace la página, con el código de la pared. */
    private fun ask(name: String = "Ana"): String =
        call("/api/access/ask", """{"name":"$name"}""", access.code).json().getString("pass")

    private fun approved(level: Access.Level, name: String = "Ana"): String {
        val pass = ask(name)
        assertTrue(access.decide(access.pending().last().id, level))
        return pass
    }

    private val ownerOnly = listOf(
        "POST" to "/api/link", "POST" to "/api/upload?name=a.apk", "POST" to "/api/claude/key", "POST" to "/api/claude/ask",
        "POST" to "/api/claude/stop", "GET" to "/api/claude/state", "GET" to "/api/access/list", "POST" to "/api/access/decide"
    )
    private val control = listOf(
        "POST" to "/api/key", "POST" to "/api/text", "POST" to "/api/pointer", "POST" to "/api/tap", "POST" to "/api/swipe",
        "POST" to "/api/open", "POST" to "/api/cast", "GET" to "/api/state", "GET" to "/api/apps"
    )

    // --- Pedir ---

    @Test
    fun `contrato - el codigo de la pared solo sirve para pedir permiso`() {
        for ((method, path) in ownerOnly + control) assertEquals(path, 401, call(path, token = access.code, method = method).status)
        assertEquals(401, call("/api/juntada/state", token = access.code).status)
        assertEquals(401, call("/api/juntada/join", """{"name":"Ana"}""", access.code).status)
        assertEquals(401, call("/api/access/me", token = access.code).status)
        assertTrue(device.calls.isEmpty())
        assertEquals(200, call("/api/access/ask", """{"name":"Ana"}""", access.code).status)
    }

    @Test
    fun `contrato - sin el codigo de la pared no se puede ni pedir`() {
        assertEquals(401, call("/api/access/ask", """{"name":"Ana"}""", null).status)
        assertEquals(401, call("/api/access/ask", """{"name":"Ana"}""", "x".repeat(48)).status)
        assertEquals(401, call("/api/access/ask", """{"name":"Ana"}""", access.code.dropLast(1)).status)
        assertFalse("sin la palabra Bearer tampoco", access.canAsk(access.code))
        assertTrue(access.pending().isEmpty())
    }

    @Test
    fun `contrato - un pase sin aprobar no abre nada`() {
        val pass = ask()
        assertEquals("pending", call("/api/access/me", token = pass).json().getString("level"))
        for ((method, path) in ownerOnly + control) assertEquals(path, 401, call(path, token = pass, method = method).status)
        assertEquals(401, call("/api/juntada/join", """{"name":"Ana"}""", pass).status)
        assertTrue(device.calls.isEmpty())
        assertEquals(0, house.state(null, true).getJSONArray("people").length())
    }

    @Test
    fun `contrato - el dueno ve quien pide con su nombre y nunca un pase`() {
        val pass = ask("<b>Ana</b>")
        val list = call("/api/access/list", token = pairing.token, method = "GET")
        val text = list.json().toString()
        assertEquals("<b>Ana</b>", list.json().getJSONArray("pending").getJSONObject(0).getString("name"))
        assertFalse(text.contains(pass))
        assertFalse(text.contains("hash"))
    }

    @Test
    fun `contrato - un nombre vacio no es un pedido`() {
        assertEquals(400, call("/api/access/ask", """{"name":"   "}""", access.code).status)
        assertEquals(400, call("/api/access/ask", "{}", access.code).status)
        assertTrue(access.pending().isEmpty())
    }

    @Test
    fun `contrato - otra pagina no puede pedir permiso desde el navegador de alguien`() {
        val r = call("/api/access/ask", """{"name":"Ana"}""", access.code, extra = "Origin: http://malo.com\r\n")
        assertEquals(403, r.status)
        assertTrue(access.pending().isEmpty())
    }

    // --- Hasta dónde llega cada permiso ---

    @Test
    fun `contrato - aprobado para la juntada entra a la juntada y a nada mas`() {
        val pass = approved(Access.Level.PARTY)
        assertEquals("party", call("/api/access/me", token = pass).json().getString("level"))
        assertEquals(200, call("/api/juntada/join", """{"name":"Ana"}""", pass).status)
        for ((method, path) in ownerOnly + control) assertEquals(path, 403, call(path, token = pass, method = method).status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - con control maneja lo mismo que el control remoto`() {
        val pass = approved(Access.Level.CONTROL)
        assertEquals(200, call("/api/key", """{"name":"down"}""", pass).status)
        assertEquals(200, call("/api/tap", """{"x":0.5,"y":0.5}""", pass).status)
        assertEquals(200, call("/api/swipe", """{"x1":0.5,"y1":0.8,"x2":0.5,"y2":0.2}""", pass).status)
        assertEquals(200, call("/api/text", """{"text":"hola"}""", pass).status)
        assertEquals(200, call("/api/pointer", """{"x":0.1,"y":0.1}""", pass).status)
        assertEquals(200, call("/api/open", """{"package":"com.netflix.mediaclient"}""", pass).status)
        assertEquals(200, call("/api/apps", "", pass, method = "GET").status)
        assertEquals(200, call("/api/juntada/join", """{"name":"Ana"}""", pass).status)
        assertEquals(listOf("key:down", "tap", "swipe", "text", "pointer", "open:com.netflix.mediaclient", "apps"), device.calls)
    }

    @Test
    fun `contrato - poner la pared a recibir una pantalla es parte del control, y avisa si el equipo no puede`() {
        val pass = approved(Access.Level.CONTROL)
        assertEquals(200, call("/api/cast", token = pass).status)
        assertEquals(200, call("/api/cast", token = pairing.token).status)
        assertEquals(listOf("cast", "cast"), device.calls)
        device.receives = false
        val none = call("/api/cast", token = pairing.token)
        assertEquals(404, none.status)
        assertEquals("not_installed", none.json().getString("error"))
    }

    @Test
    fun `contrato - con control no llega a la clave, a Claude, a los archivos ni a los permisos`() {
        val pass = approved(Access.Level.CONTROL)
        val bodies = mapOf(
            "/api/claude/key" to """{"key":"sk-ant-${"a".repeat(40)}"}""",
            "/api/claude/ask" to """{"text":"hola"}""",
            "/api/link" to """{"url":"https://example.com"}""",
            "/api/access/decide" to """{"id":1,"level":"control"}"""
        )
        for ((method, path) in ownerOnly) {
            val r = call(path, bodies[path] ?: "{}", pass, method)
            assertEquals(path, 403, r.status)
            assertEquals("owner", r.json().getString("error"))
        }
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - con control prestado no se manejan las pantallas del dueno, pero se puede salir`() {
        val pass = approved(Access.Level.CONTROL)
        device.private = true
        for ((path, body) in listOf(
            "/api/key" to """{"name":"ok"}""", "/api/key" to """{"name":"down"}""", "/api/tap" to """{"x":0.5,"y":0.5}""",
            "/api/swipe" to """{"x1":0.5,"y1":0.8,"x2":0.5,"y2":0.2}""", "/api/text" to """{"text":"sk-ant-x"}"""
        )) {
            val r = call(path, body, pass)
            assertEquals("$path $body", 403, r.status)
            assertEquals("private", r.json().getString("error"))
        }
        assertTrue(device.calls.isEmpty())
        assertEquals(200, call("/api/key", """{"name":"back"}""", pass).status)
        assertEquals(200, call("/api/key", """{"name":"home"}""", pass).status)
        assertEquals("al dueño no lo frena", 200, call("/api/key", """{"name":"ok"}""", pairing.token).status)
    }

    @Test
    fun `contrato - un invitado no abre los ajustes del sistema ni la tienda`() {
        val pass = approved(Access.Level.CONTROL)
        for (pkg in listOf("com.android.settings", "com.android.tv.settings", "com.android.vending")) {
            assertEquals(pkg, 403, call("/api/open", """{"package":"$pkg"}""", pass).status)
        }
        assertTrue(device.calls.isEmpty())
        assertEquals(200, call("/api/open", """{"package":"com.android.settings"}""", pairing.token).status)
    }

    // --- Quién decide ---

    @Test
    fun `contrato - solo el dueno aprueba`() {
        val guest = approved(Access.Level.CONTROL, "Beto")
        ask("Ana")
        val waiting = access.pending().single().id
        assertEquals(403, call("/api/access/decide", """{"id":$waiting,"level":"control"}""", guest).status)
        assertEquals(401, call("/api/access/decide", """{"id":$waiting,"level":"control"}""", access.code).status)
        assertEquals(401, call("/api/access/decide", """{"id":$waiting,"level":"control"}""", null).status)
        assertEquals(1, access.pending().size)
        assertEquals(200, call("/api/access/decide", """{"id":$waiting,"level":"party"}""", pairing.token).status)
        assertTrue(access.pending().isEmpty())
    }

    @Test
    fun `contrato - un nivel inventado no aprueba a nadie`() {
        ask()
        val id = access.pending().single().id
        assertEquals(400, call("/api/access/decide", """{"id":$id,"level":"full"}""", pairing.token).status)
        assertEquals(400, call("/api/access/decide", """{"id":$id,"level":"owner"}""", pairing.token).status)
        assertEquals(1, access.pending().size)
        assertEquals(404, call("/api/access/decide", """{"id":999,"level":"party"}""", pairing.token).status)
    }

    @Test
    fun `contrato - decir que no deja el pase sin valor`() {
        val pass = ask()
        assertEquals(200, call("/api/access/decide", """{"id":${access.pending().single().id},"level":"none"}""", pairing.token).status)
        assertEquals(401, call("/api/access/me", token = pass).status)
        assertEquals(401, call("/api/juntada/state", token = pass).status)
    }

    @Test
    fun `contrato - sacar a un invitado lo corta en el acto`() {
        val pass = approved(Access.Level.CONTROL)
        assertEquals(200, call("/api/key", """{"name":"ok"}""", pass).status)
        access.decide(access.allowed().single().id, null)
        assertEquals(401, call("/api/key", """{"name":"ok"}""", pass).status)
        assertEquals(401, call("/api/juntada/state", token = pass).status)
    }

    @Test
    fun `contrato - el dueno puede dar el control despues y tambien quitarlo`() {
        val pass = approved(Access.Level.PARTY)
        val id = access.allowed().single().id
        assertEquals(403, call("/api/key", """{"name":"ok"}""", pass).status)
        call("/api/access/decide", """{"id":$id,"level":"control"}""", pairing.token)
        assertEquals(200, call("/api/key", """{"name":"ok"}""", pass).status)
        call("/api/access/decide", """{"id":$id,"level":"party"}""", pairing.token)
        assertEquals(403, call("/api/key", """{"name":"ok"}""", pass).status)
        assertEquals("sigue en la juntada", 200, call("/api/juntada/join", """{"name":"Ana"}""", pass).status)
    }

    // --- Límites ---

    @Test
    fun `contrato - un pedido que nadie contesta vence`() {
        val pass = ask()
        clock += Access.PENDING_MS + 1
        assertTrue(access.pending().isEmpty())
        assertEquals(401, call("/api/access/me", token = pass).status)
    }

    @Test
    fun `contrato - un permiso aprobado no vence solo`() {
        val pass = approved(Access.Level.PARTY)
        clock += Access.PENDING_MS * 100
        assertEquals("party", call("/api/access/me", token = pass).json().getString("level"))
    }

    @Test
    fun `contrato - un solo equipo no llena la fila de pedidos`() {
        repeat(Access.MAX_PER_ADDRESS) { assertTrue(access.ask("Troll $it", "10.0.0.9") is Access.Asked.Pass) }
        assertEquals(Access.Asked.Full, access.ask("Troll más", "10.0.0.9"))
        assertTrue("otro equipo sí puede pedir", access.ask("Ana", "10.0.0.10") is Access.Asked.Pass)
    }

    @Test
    fun `contrato - la fila de pedidos tiene tope`() {
        repeat(Access.MAX_PENDING) { assertTrue(access.ask("P$it", "10.0.1.$it") is Access.Asked.Pass) }
        assertEquals(Access.Asked.Full, access.ask("Uno más", "10.0.2.1"))
        assertEquals(409, call("/api/access/ask", """{"name":"Otro"}""", access.code).status)
    }

    // --- Lo que queda guardado ---

    @Test
    fun `contrato - lo guardado no sirve para entrar - no lleva ningun pase`() {
        val pass = approved(Access.Level.CONTROL)
        val saved = access.export().toString()
        assertFalse(saved.contains(pass))
    }

    @Test
    fun `contrato - los aprobados sobreviven a un reinicio, los pedidos sin contestar no`() {
        val ana = approved(Access.Level.CONTROL, "Ana")
        val beto = ask("Beto")
        val again = Access(JSONObject(access.export().toString()), { clock })
        assertEquals(access.code, again.code)
        assertEquals(Access.Level.CONTROL, again.level("Bearer $ana"))
        assertNull(again.status("Bearer $beto"))
        assertTrue(again.pending().isEmpty())
        val next = (again.ask("Caro", "10.0.0.3") as Access.Asked.Pass).value
        assertNotEquals("un pedido nuevo no pisa a uno viejo", again.allowed().single().id, again.pending().single().id)
        assertEquals("pending", again.status("Bearer $next"))
    }

    @Test
    fun `contrato - un archivo guardado roto no deja entrar a nadie ni rompe el arranque`() {
        val broken = JSONObject("""{"code":"corto","devices":[{"name":"x","hash":"abc","level":"control"},{"name":"y","hash":"${"a".repeat(64)}","level":"full"},"basura"]}""")
        val again = Access(broken, { clock })
        assertTrue(again.allowed().isEmpty())
        assertTrue(again.code.length >= 48)
    }

    @Test
    fun `contrato - empezar de cero saca a los invitados y cambia el codigo`() {
        val pass = approved(Access.Level.CONTROL)
        val old = access.code
        access.clearGuests()
        assertNotEquals(old, access.code)
        assertEquals(401, call("/api/key", """{"name":"ok"}""", pass).status)
        assertEquals(401, call("/api/access/ask", """{"name":"Ana"}""", old).status)
    }

    // --- El dueño ---

    @Test
    fun `contrato - usar el acceso del dueno deja anotado que el proyector ya tiene dueno`() {
        assertFalse(access.claimed)
        call("/api/key", """{"name":"ok"}""", "x".repeat(48))
        assertFalse("un token cualquiera no lo marca", access.claimed)
        call("/api/access/me", token = pairing.token).let { assertEquals("owner", it.json().getString("level")) }
        assertTrue(access.claimed)
        assertTrue("y queda guardado", Access(JSONObject(access.export().toString())).claimed)
    }

    @Test
    fun `contrato - desconectar a todos tambien suelta al dueno y a los invitados`() {
        val pass = approved(Access.Level.PARTY)
        call("/api/state", "", pairing.token, method = "GET")
        access.forgetAll()
        assertFalse(access.claimed)
        assertEquals(401, call("/api/juntada/state", token = pass).status)
    }

    @Test
    fun `la carrera abierta - el codigo lo ve quien paso, el pase de mando solo el dueño`() {
        val guest = approved(Access.Level.PARTY)
        assertFalse(call("/api/carrera", token = guest, method = "GET").json().getBoolean("open"))
        door = Carrera.Room("c0de", "secreto", "pase")
        val seen = call("/api/carrera", token = guest, method = "GET").json()
        assertEquals("c0de", seen.getString("code"))
        assertFalse(seen.has("lead"))
        assertEquals("pase", call("/api/carrera", token = pairing.token, method = "GET").json().getString("lead"))
        // Sin que lo hayan dejado pasar no se ve nada, y abrirla en la pared es del que tiene el control.
        assertEquals(401, call("/api/carrera", token = ask("Otro"), method = "GET").status)
        assertEquals(403, call("/api/carrera/open", token = guest).status)
    }
}
