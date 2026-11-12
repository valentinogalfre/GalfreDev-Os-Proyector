package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.HttpError
import ar.vale.projectorlauncher.remote.HttpParser
import ar.vale.projectorlauncher.remote.HttpRequest
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.RemoteDevice
import ar.vale.projectorlauncher.remote.RemoteGuard
import ar.vale.projectorlauncher.remote.RemoteServer
import ar.vale.projectorlauncher.remote.Router
import ar.vale.projectorlauncher.remote.Uploads
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.IOException
import java.io.InputStream
import java.net.Socket
import java.nio.file.Files
import java.util.concurrent.CountDownLatch
import kotlin.concurrent.thread

private class FakeDevice : RemoteDevice {
    val calls = ArrayList<String>()
    var uploaded: ByteArray? = null
    var result = RemoteDevice.Result.OK
    var started: CountDownLatch? = null
    var gate: CountDownLatch? = null
    override fun state() = JSONObject().put("name", "fake")
    override fun key(name: String) = result.also { calls.add("key:$name") }
    override fun text(value: String, submit: Boolean) = result.also { calls.add("text:$value:$submit") }
    override fun link(url: String) = result.also { calls.add("link:$url") }
    override fun upload(name: String, length: Long, body: InputStream): String {
        started?.countDown()
        gate?.await()
        uploaded = body.readBytes()
        calls.add("upload:$name")
        return name
    }
    override fun saveClaudeKey(key: String) = true.also { calls.add("claude_key") }
    override fun askClaude(text: String) = result.also { calls.add("ask:$text") }
    override fun claudeState(): JSONObject = JSONObject().put("busy", false).also { calls.add("claude_state") }
    override fun stopClaude() { calls.add("claude_stop") }
    override fun pointer(x: Float, y: Float, visible: Boolean) { calls.add("pointer:$x:$y:$visible") }
    override fun tap(x: Float, y: Float) = result.also { calls.add("tap:$x:$y") }
    override fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float) =
        result.also { calls.add("swipe:$fromX:$fromY:$toX:$toY") }
    override fun apps(): JSONObject = JSONObject().put("name", "lista").also { calls.add("apps") }
    override fun open(pkg: String) = result.also { calls.add("open:$pkg") }
    override fun fits(length: Long) = length < 1000
    override fun privateScreen() = false
}

class RemoteSecurityTest {

    private var clock = 1_000_000L
    private val pairing = Pairing("t".repeat(48), {}, { clock })
    private val device = FakeDevice()
    private val router = Router(pairing, device) { path ->
        if (path == "/") HttpResponse(200, "text/html", "<html>".toByteArray()) else null
    }

    private fun request(
        method: String,
        target: String,
        body: String = "",
        token: String? = pairing.token,
        type: String? = "application/json",
        extra: String = ""
    ): HttpRequest {
        val head = StringBuilder("$method $target HTTP/1.1\r\nHost: 10.0.0.2:8686\r\n")
        token?.let { head.append("Authorization: Bearer $it\r\n") }
        type?.let { head.append("Content-Type: $it\r\n") }
        head.append(extra)
        head.append("Content-Length: ${body.toByteArray().size}\r\n\r\n").append(body)
        return HttpParser.parse(ByteArrayInputStream(head.toString().toByteArray()))!!
    }

    private fun HttpResponse.text(): String = ByteArrayOutputStream().also(::write).toString("UTF-8")

    // --- Autorización ---

    private val apiRoutes = listOf(
        "POST" to "/api/key", "POST" to "/api/text", "POST" to "/api/link", "POST" to "/api/upload?name=a.txt",
        "POST" to "/api/claude/key", "POST" to "/api/claude/ask", "POST" to "/api/pointer", "GET" to "/api/state",
        "POST" to "/api/tap", "POST" to "/api/swipe", "POST" to "/api/open", "GET" to "/api/apps",
        "GET" to "/api/claude/state", "POST" to "/api/claude/stop"
    )

    @Test
    fun `contrato - ninguna ruta de la API funciona sin token`() {
        for ((method, path) in apiRoutes) {
            assertEquals(path, 401, router.handle(request(method, path, "{}", token = null)).status)
        }
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - ninguna ruta de la API funciona con un token equivocado`() {
        for ((method, path) in apiRoutes) {
            assertEquals(path, 401, router.handle(request(method, path, "{}", token = "x".repeat(48))).status)
        }
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - el token no se acepta por la direccion`() {
        val r = request("GET", "/api/state?token=${pairing.token}", token = null)
        assertEquals(401, router.handle(r).status)
    }

    @Test
    fun `contrato - otra pagina no puede usar la API desde el navegador`() {
        val r = request("POST", "/api/key", """{"name":"ok"}""", extra = "Origin: http://malo.com\r\n")
        assertEquals(403, router.handle(r).status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - la propia pagina si puede usar la API`() {
        val r = request("POST", "/api/key", """{"name":"ok"}""", extra = "Origin: http://10.0.0.2:8686\r\n")
        assertEquals(200, router.handle(r).status)
    }

    @Test
    fun `contrato - por la conexion cifrada el origen valido es el https de la propia pagina`() {
        fun secure(origin: String): HttpRequest {
            val body = """{"name":"ok"}"""
            val head = "POST /api/key HTTP/1.1\r\nHost: 10.0.0.2:8696\r\nAuthorization: Bearer ${pairing.token}\r\n" +
                "Content-Type: application/json\r\nOrigin: $origin\r\nContent-Length: ${body.length}\r\n\r\n$body"
            return HttpParser.parse(ByteArrayInputStream(head.toByteArray()), secure = true)!!
        }
        assertEquals(200, router.handle(secure("https://10.0.0.2:8696")).status)
        assertEquals(403, router.handle(secure("http://10.0.0.2:8696")).status)
        assertEquals(403, router.handle(secure("https://malo.com")).status)
        val plain = request("POST", "/api/key", """{"name":"ok"}""", extra = "Origin: https://10.0.0.2:8686\r\n")
        assertEquals("sin cifrar no vale un origen https", 403, router.handle(plain).status)
    }

    @Test
    fun `contrato - el celular ve lo que hace Claude y lo puede frenar`() {
        assertEquals(200, router.handle(request("GET", "/api/claude/state")).status)
        assertEquals(200, router.handle(request("POST", "/api/claude/stop", "{}")).status)
        assertEquals(listOf("claude_state", "claude_stop"), device.calls)
        device.result = RemoteDevice.Result.BUSY
        val busy = router.handle(request("POST", "/api/claude/ask", """{"text":"otra"}"""))
        assertEquals(409, busy.status)
        assertTrue(busy.text().contains("claude_busy"))
    }

    @Test
    fun `contrato - un formulario ajeno no pasa por el tipo de contenido`() {
        val r = request("POST", "/api/key", """{"name":"ok"}""", type = "text/plain")
        assertEquals(415, router.handle(r).status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - no se responden pedidos previos de otros origenes`() {
        assertEquals(405, router.handle(request("OPTIONS", "/api/key", token = null)).status)
    }

    // --- Archivos ---

    @Test
    fun `contrato - solo se sirve la lista cerrada de la pagina`() {
        assertEquals(200, router.handle(request("GET", "/", token = null)).status)
        for (path in listOf("/../../etc/passwd", "/data/data/x", "/%2e%2e/secret", "/api", "/index.html.bak")) {
            assertEquals(path, 404, router.handle(request("GET", path, token = null)).status)
        }
    }

    @Test
    fun `contrato - la pagina no se puede meter en un marco ni lleva scripts ajenos`() {
        val text = router.handle(request("GET", "/", token = null)).text()
        assertTrue(text.contains("X-Frame-Options: DENY"))
        assertTrue(text.contains("frame-ancestors 'none'"))
        assertTrue(text.contains("Cache-Control: no-store"))
    }

    @Test
    fun `contrato - la pagina solo le habla a su proyector y a su propia version segura`() {
        var port = 8696
        val twin = Router(pairing, device, securePort = { port }) { path ->
            if (path == "/") HttpResponse(200, "text/html", "<html>".toByteArray()) else null
        }
        fun page(head: String, secure: Boolean = false): String =
            twin.handle(HttpParser.parse(ByteArrayInputStream("GET / HTTP/1.1\r\n$head\r\n\r\n".toByteArray()), secure = secure)!!).text()
        // La página común puede consultarle a su versión segura si el navegador ya confía en ella.
        val plain = page("Host: 10.0.0.2:8686")
        assertTrue(plain, plain.contains("default-src 'self'; connect-src 'self' https://10.0.0.2:8696; style-src"))
        // Ya en la segura, o sin ella, no hay ningún otro origen.
        assertFalse(page("Host: 10.0.0.2:8696", secure = true).contains("connect-src"))
        port = 0
        assertFalse(page("Host: 10.0.0.2:8686").contains("connect-src"))
        assertFalse(router.handle(request("GET", "/", token = null)).text().contains("connect-src"))
        // Lo que diga el navegador en Host no llega a la política si no es un nombre o una dirección.
        port = 8696
        for (host in listOf("malo.com; script-src *", "malo.com https://otro.com", "[::1]:8686", "a b", "")) {
            val forged = page("Host: $host")
            assertFalse(host, forged.contains("connect-src"))
            assertFalse(host, forged.contains("script-src *"))
        }
    }

    @Test
    fun `contrato - un nombre de archivo nunca decide la carpeta`() {
        assertEquals("passwd", Uploads.safeName("../../etc/passwd"))
        assertEquals("evil.apk", Uploads.safeName("C:\\windows\\evil.apk"))
        assertEquals("secret", Uploads.safeName(".secret"))
        assertEquals("a b.mp4", Uploads.safeName("a\u0000 b.mp4".replace("\u0000", "")))
        assertEquals("ab.mp4", Uploads.safeName("a\nb.mp4"))
        assertNull(Uploads.safeName("../"))
        assertNull(Uploads.safeName(""))
        assertNull(Uploads.safeName("..."))
        assertEquals(120, Uploads.safeName("a".repeat(300) + ".mp4")!!.length)
        assertTrue(Uploads.safeName("a".repeat(300) + ".mp4")!!.endsWith(".mp4"))
    }

    @Test
    fun `contrato - un archivo nuevo nunca pisa uno que ya estaba`() {
        val dir = Files.createTempDirectory("gd").toFile()
        File(dir, "a.mp4").writeText("x")
        File(dir, "a (2).mp4").writeText("x")
        assertEquals("a (3).mp4", Uploads.unique(dir, "a.mp4").name)
        assertEquals("b.mp4", Uploads.unique(dir, "b.mp4").name)
        dir.deleteRecursively()
    }

    @Test
    fun `contrato - la subida guarda con nombre seguro y solo lo declarado`() {
        val r = router.handle(request("POST", "/api/upload?name=..%2F..%2Fa.mp4", "hola", type = "video/mp4"))
        assertEquals(200, r.status)
        assertEquals("upload:a.mp4", device.calls.single())
        assertEquals("hola", String(device.uploaded!!))
    }

    @Test
    fun `contrato - no se acepta un archivo que no entra`() {
        val big = "x".repeat(2000)
        assertEquals(507, router.handle(request("POST", "/api/upload?name=a.mp4", big, type = "video/mp4")).status)
        assertTrue(device.calls.isEmpty())
    }

    // --- Enlaces y claves ---

    @Test
    fun `contrato - desde el celular solo se abren direcciones web`() {
        for (url in listOf("file:///sdcard/a", "intent://x#Intent;end", "javascript:alert(1)", "content://x/y", "nada")) {
            assertEquals(url, 400, router.handle(request("POST", "/api/link", JSONObject().put("url", url).toString())).status)
        }
        assertTrue(device.calls.isEmpty())
        assertEquals(200, router.handle(request("POST", "/api/link", """{"url":"https://a.com"}""")).status)
    }

    @Test
    fun `contrato - la API nunca devuelve la clave de Claude`() {
        val r = router.handle(request("POST", "/api/claude/key", """{"key":"sk-ant-api03-abcdefghijklmnopqrstuvwxyz"}""")).text()
        assertFalse(r.contains("sk-ant"))
        assertTrue(r.contains("\"stored\":true"))
    }

    @Test
    fun `contrato - una clave con otra forma se rechaza`() {
        assertEquals(400, router.handle(request("POST", "/api/claude/key", """{"key":"hola"}""")).status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - el puntero nunca sale de la pantalla`() {
        router.handle(request("POST", "/api/pointer", """{"x":3,"y":-2}"""))
        assertEquals("pointer:1.0:0.0:true", device.calls.single())
    }

    @Test
    fun `contrato - un puntero que no es un numero se rechaza y no llega a la pared`() {
        assertEquals(400, router.handle(request("POST", "/api/pointer", """{"x":"NaN","y":0.5}""")).status)
        assertEquals(400, router.handle(request("POST", "/api/pointer", """{"x":0.5,"y":"NaN"}""")).status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - un JSON roto es un error del pedido y no tumba el servidor`() {
        assertEquals(400, router.handle(request("POST", "/api/key", "{no es json")).status)
    }

    @Test
    fun `contrato - si hace falta accesibilidad el celular se entera`() {
        device.result = RemoteDevice.Result.NEEDS_ACCESSIBILITY
        val r = router.handle(request("POST", "/api/key", """{"name":"ok"}"""))
        assertEquals(409, r.status)
        assertTrue(r.text().contains("accessibility"))
    }

    // --- Emparejamiento ---

    @Test
    fun `contrato - el PIN solo sirve mientras se ve en pantalla`() {
        assertEquals(Pairing.Attempt.Closed, pairing.tryPin(pairing.pin))
        assertEquals(423, router.handle(request("POST", "/api/pair", JSONObject().put("pin", pairing.pin).toString(), token = null)).status)
    }

    @Test
    fun `contrato - el PIN correcto entrega el token y se puede usar una sola vez`() {
        pairing.open = true
        val pin = pairing.pin
        assertEquals(Pairing.Attempt.Paired(pairing.token), pairing.tryPin(pin))
        assertNotEquals(pin, pairing.pin)
        assertTrue(pairing.tryPin(pin) is Pairing.Attempt.Wrong)
    }

    @Test
    fun `contrato - cinco errores bloquean y cada bloqueo dura el doble`() {
        pairing.open = true
        val wrong = "abcdef"
        repeat(Pairing.MAX_FAILURES - 1) { assertTrue(pairing.tryPin(wrong) is Pairing.Attempt.Wrong) }
        assertEquals(Pairing.Attempt.Locked(30), pairing.tryPin(wrong))
        assertTrue(pairing.tryPin(pairing.pin) is Pairing.Attempt.Locked)
        clock += 31_000
        repeat(Pairing.MAX_FAILURES - 1) { pairing.tryPin(wrong) }
        assertEquals(Pairing.Attempt.Locked(60), pairing.tryPin(wrong))
    }

    @Test
    fun `contrato - tras un bloqueo el PIN anterior ya no vale`() {
        pairing.open = true
        val before = pairing.pin
        repeat(Pairing.MAX_FAILURES) { pairing.tryPin("abcdef") }
        assertNotEquals(before, pairing.pin)
    }

    @Test
    fun `contrato - desconectar invalida a todos los celulares`() {
        val before = pairing.token
        pairing.rotate()
        assertFalse(pairing.authorized("Bearer $before"))
        assertTrue(pairing.authorized("Bearer ${pairing.token}"))
    }

    @Test
    fun `contrato - un token viejo demasiado corto se reemplaza`() {
        val p = Pairing("corto", {})
        assertEquals(48, p.token.length)
    }

    @Test
    fun `contrato - el PIN siempre tiene seis digitos`() {
        repeat(200) {
            val p = Pairing(null, {})
            assertEquals(6, p.pin.length)
            assertTrue(p.pin.all(Char::isDigit))
        }
    }

    // --- HTTP ---

    private fun parse(text: String) = HttpParser.parse(ByteArrayInputStream(text.toByteArray()))

    private fun assertStatus(status: Int, text: String) {
        try {
            parse(text)
            fail("tenía que fallar con $status")
        } catch (e: HttpError) {
            assertEquals(status, e.status)
        }
    }

    @Test
    fun `contrato - una conexion que se cierra sin hablar no es un error`() {
        assertNull(parse(""))
    }

    @Test
    fun `contrato - sin longitud explicita no se acepta un cuerpo`() {
        assertStatus(411, "POST /api/key HTTP/1.1\r\nTransfer-Encoding: chunked\r\n\r\n")
    }

    @Test
    fun `contrato - una longitud invalida se rechaza`() {
        assertStatus(400, "POST /a HTTP/1.1\r\nContent-Length: -1\r\n\r\n")
        assertStatus(400, "POST /a HTTP/1.1\r\nContent-Length: mucho\r\n\r\n")
    }

    @Test
    fun `contrato - lineas y cabeceras tienen tope`() {
        assertStatus(431, "GET /" + "a".repeat(9000) + " HTTP/1.1\r\n\r\n")
        val many = (1..60).joinToString("") { "X-$it: a\r\n" }
        assertStatus(431, "GET / HTTP/1.1\r\n$many\r\n")
    }

    @Test
    fun `contrato - algo que no es HTTP se rechaza`() {
        assertStatus(400, "hola\r\n\r\n")
        assertStatus(400, "GET http://a.com/ HTTP/1.1\r\n\r\n")
    }

    @Test
    fun `contrato - el cuerpo nunca se lee mas alla de lo declarado`() {
        val r = parse("POST /a HTTP/1.1\r\nContent-Length: 3\r\n\r\nabcdef")!!
        assertEquals("abc", r.text(100))
    }

    @Test
    fun `contrato - un JSON enorme se corta antes de leerlo`() {
        val body = "x".repeat(20000)
        val r = request("POST", "/api/key", body)
        assertEquals(413, router.handle(r).status)
    }

    // --- Lo que confirma una persona ---

    @Test
    fun `contrato - el celular nunca aprieta el instalador del sistema`() {
        for (installer in listOf(
            "com.android.packageinstaller",
            "com.google.android.packageinstaller",
            "com.miui.packageinstaller",
            "com.samsung.android.packageinstaller"
        )) {
            assertTrue(installer, RemoteGuard.needsPerson(installer))
        }
    }

    // --- Manejar otras apps ---

    @Test
    fun `contrato - un toque llega al equipo en el punto pedido`() {
        val response = router.handle(request("POST", "/api/tap", """{"x":0.25,"y":0.75}"""))
        assertEquals(200, response.status)
        assertEquals(listOf("tap:0.25:0.75"), device.calls)
    }

    @Test
    fun `contrato - un deslizamiento llega con sus dos puntas`() {
        val response = router.handle(request("POST", "/api/swipe", """{"x1":0.5,"y1":0.75,"x2":0.5,"y2":0.25}"""))
        assertEquals(200, response.status)
        assertEquals(listOf("swipe:0.5:0.75:0.5:0.25"), device.calls)
    }

    @Test
    fun `contrato - un toque fuera de la pantalla no se hace`() {
        for (body in listOf("""{"x":1.5,"y":0.5}""", """{"x":0.5,"y":-0.1}""", """{"x":"NaN","y":0.5}""")) {
            val response = router.handle(request("POST", "/api/tap", body))
            assertEquals(body, 400, response.status)
            assertTrue(body, response.text().contains("range"))
        }
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - un deslizamiento con una punta afuera no se hace`() {
        val response = router.handle(request("POST", "/api/swipe", """{"x1":0.5,"y1":0.5,"x2":0.5,"y2":2}"""))
        assertEquals(400, response.status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - si lo tiene que confirmar una persona, el toque se rechaza`() {
        device.result = RemoteDevice.Result.NEEDS_PERSON
        for ((path, body) in listOf(
            "/api/tap" to """{"x":0.5,"y":0.5}""",
            "/api/swipe" to """{"x1":0.1,"y1":0.1,"x2":0.2,"y2":0.2}"""
        )) {
            val response = router.handle(request("POST", path, body))
            assertEquals(path, 403, response.status)
            assertTrue(path, response.text().contains("person"))
        }
    }

    @Test
    fun `contrato - sin control total el toque avisa que falta el permiso`() {
        device.result = RemoteDevice.Result.NEEDS_ACCESSIBILITY
        val response = router.handle(request("POST", "/api/tap", """{"x":0.5,"y":0.5}"""))
        assertEquals(409, response.status)
        assertTrue(response.text().contains("accessibility"))
    }

    @Test
    fun `contrato - la lista de apps se lee sin tocar nada`() {
        val response = router.handle(request("GET", "/api/apps", type = null))
        assertEquals(200, response.status)
        assertTrue(response.text().contains("lista"))
        assertEquals(listOf("apps"), device.calls)
    }

    @Test
    fun `contrato - abrir una app es un POST`() {
        val response = router.handle(request("GET", "/api/open", type = null))
        assertEquals(405, response.status)
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - se abre la app pedida`() {
        val response = router.handle(request("POST", "/api/open", """{"package":"com.netflix.mediaclient"}"""))
        assertEquals(200, response.status)
        assertEquals(listOf("open:com.netflix.mediaclient"), device.calls)
    }

    @Test
    fun `contrato - un paquete con forma rara no llega al equipo`() {
        for (name in listOf("", "netflix", "com.netflix;rm", "../../etc", "com..netflix", ".com.netflix", "com.1netflix")) {
            val response = router.handle(request("POST", "/api/open", JSONObject().put("package", name).toString()))
            assertEquals(name, 400, response.status)
        }
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - el instalador del sistema no se abre desde el celular`() {
        val response = router.handle(request("POST", "/api/open", """{"package":"com.google.android.packageinstaller"}"""))
        assertEquals(403, response.status)
        assertTrue(response.text().contains("person"))
        assertTrue(device.calls.isEmpty())
    }

    @Test
    fun `contrato - una app que no esta se informa`() {
        device.result = RemoteDevice.Result.NOT_INSTALLED
        val response = router.handle(request("POST", "/api/open", """{"package":"com.ejemplo.nada"}"""))
        assertEquals(404, response.status)
        assertTrue(response.text().contains("not_installed"))
    }

    @Test
    fun `contrato - las demas apps se manejan desde el celular`() {
        for (app in listOf("ar.vale.projectorlauncher", "org.videolan.vlc", "com.fluffy.player", null)) {
            assertFalse(app.toString(), RemoteGuard.needsPerson(app))
        }
    }

    @Test
    fun `contrato - si hace falta una persona, la pagina lo sabe`() {
        device.result = RemoteDevice.Result.NEEDS_PERSON
        val r = router.handle(request("POST", "/api/key", """{"name":"ok"}"""))
        assertEquals(403, r.status)
        assertTrue(r.text().contains("person"))
    }

    // --- Subidas ---

    @Test
    fun `contrato - una longitud enorme no desborda el control de espacio`() {
        assertFalse(Uploads.fits(1_000_000, Long.MAX_VALUE, 1000))
        assertFalse(Uploads.fits(1_000_000, Long.MAX_VALUE - 500, 1000))
    }

    @Test
    fun `contrato - el margen de espacio se respeta`() {
        assertTrue(Uploads.fits(2000, 999, 1000))
        assertFalse(Uploads.fits(2000, 1000, 1000))
        assertFalse(Uploads.fits(500, 0, 1000))
    }

    @Test
    fun `contrato - de a una subida por vez`() {
        val started = CountDownLatch(1)
        val gate = CountDownLatch(1)
        device.started = started
        device.gate = gate
        val first = thread { router.handle(request("POST", "/api/upload?name=a.mp4", "uno", type = "video/mp4")) }
        started.await()
        device.started = null
        device.gate = null
        val second = router.handle(request("POST", "/api/upload?name=b.mp4", "dos", type = "video/mp4"))
        assertEquals(409, second.status)
        assertTrue(second.text().contains("busy"))
        gate.countDown()
        first.join()
        assertEquals(200, router.handle(request("POST", "/api/upload?name=b.mp4", "dos", type = "video/mp4")).status)
    }

    @Test
    fun `contrato - una subida que falla no traba las siguientes`() {
        val broken = object : InputStream() {
            override fun read(): Int = throw IOException("se cortó")
        }
        val r = HttpRequest("POST", "/api/upload", mapOf("name" to "a.mp4"), mapOf(
            "authorization" to "Bearer ${pairing.token}", "content-type" to "video/mp4", "host" to "10.0.0.2:8686"
        ), 3, broken)
        runCatching { router.handle(r) }
        assertEquals(200, router.handle(request("POST", "/api/upload?name=b.mp4", "dos", type = "video/mp4")).status)
    }

    // --- PIN por dirección ---

    @Test
    fun `contrato - quien insiste con el PIN no traba al dueno`() {
        pairing.open = true
        val wrong = if (pairing.pin == "000000") "000001" else "000000"
        repeat(Pairing.MAX_FAILURES) { pairing.tryPin(wrong, "10.0.0.66") }
        assertTrue(pairing.tryPin(pairing.pin, "10.0.0.66") is Pairing.Attempt.Locked)
        assertEquals(Pairing.Attempt.Paired(pairing.token), pairing.tryPin(pairing.pin, "10.0.0.7"))
    }

    @Test
    fun `contrato - cada traba le cambia el PIN a quien probaba`() {
        pairing.open = true
        val before = pairing.pin
        val wrong = if (before == "000000") "000001" else "000000"
        repeat(Pairing.MAX_FAILURES) { pairing.tryPin(wrong, "10.0.0.66") }
        assertNotEquals(before, pairing.pin)
    }

    @Test
    fun `contrato - la traba por direccion crece con cada ronda`() {
        pairing.open = true
        val wrong = { if (pairing.pin == "000000") "000001" else "000000" }
        repeat(Pairing.MAX_FAILURES) { pairing.tryPin(wrong(), "10.0.0.66") }
        clock += Pairing.BASE_LOCK_SECONDS * 1000L + 1
        repeat(Pairing.MAX_FAILURES - 1) { pairing.tryPin(wrong(), "10.0.0.66") }
        assertEquals(Pairing.Attempt.Locked(Pairing.BASE_LOCK_SECONDS * 2), pairing.tryPin(wrong(), "10.0.0.66"))
    }

    @Test
    fun `contrato - muchas direcciones no levantan una traba vigente`() {
        pairing.open = true
        val wrong = { if (pairing.pin == "000000") "000001" else "000000" }
        repeat(Pairing.MAX_FAILURES) { pairing.tryPin(wrong(), "10.0.0.66") }
        // Más direcciones que las que se recuerdan: la primera en irse no puede ser la trabada.
        repeat(300) { i -> pairing.tryPin(wrong(), "10.0.${i / 200}.${i % 200}") }
        assertTrue(pairing.tryPin(pairing.pin, "10.0.0.66") is Pairing.Attempt.Locked)
    }

    @Test
    fun `contrato - con todos los lugares trabados, una direccion nueva espera`() {
        pairing.open = true
        val wrong = { if (pairing.pin == "000000") "000001" else "000000" }
        for (address in 0 until 300) {
            repeat(Pairing.MAX_FAILURES) { pairing.tryPin(wrong(), "10.1.${address / 200}.${address % 200}") }
        }
        assertTrue(pairing.tryPin(pairing.pin, "10.2.0.1") is Pairing.Attempt.Locked)
    }

    // --- De punta a punta, con sockets reales ---

    private fun exchange(port: Int, text: String): String =
        Socket("127.0.0.1", port).use { s ->
            s.getOutputStream().write(text.toByteArray())
            s.getOutputStream().flush()
            s.getInputStream().readBytes().toString(Charsets.UTF_8)
        }

    @Test
    fun `contrato - el servidor real atiende, rechaza y sobrevive a la basura`() {
        val server = RemoteServer(router)
        val port = server.start(firstPort = 18686, attempts = 40)
        try {
            assertTrue(exchange(port, "GET / HTTP/1.1\r\nHost: x\r\n\r\n").startsWith("HTTP/1.1 200"))
            assertTrue(exchange(port, "GET /api/state HTTP/1.1\r\nHost: x\r\n\r\n").startsWith("HTTP/1.1 401"))
            assertTrue(exchange(port, "esto no es http\r\n\r\n").startsWith("HTTP/1.1 400"))
            val ok = exchange(port, "GET /api/state HTTP/1.1\r\nHost: x\r\nAuthorization: Bearer ${pairing.token}\r\n\r\n")
            assertTrue(ok.startsWith("HTTP/1.1 200"))
            assertTrue(ok.contains("\"name\":\"fake\""))
        } finally {
            server.stop()
        }
    }

    @Test
    fun `contrato - quien manda de a un byte pierde la conexion`() {
        val server = RemoteServer(router, requestMs = 300, replyMs = 300, reapMs = 20)
        val port = server.start(firstPort = 18746, attempts = 40)
        try {
            Socket("127.0.0.1", port).use { s ->
                // La lentitud es justamente el contrato: cada byte reinicia la espera de lectura.
                val out = s.getOutputStream()
                val giveUp = System.nanoTime() + 5_000_000_000
                var cut = false
                while (!cut && System.nanoTime() < giveUp) {
                    cut = runCatching {
                        out.write('G'.code)
                        out.flush()
                    }.isFailure
                    Thread.sleep(50)
                }
                assertTrue("el servidor no cortó al cliente lento", cut)
            }
        } finally {
            server.stop()
        }
    }

    @Test
    fun `contrato - una subida autorizada dura lo que tarde el archivo`() {
        val server = RemoteServer(router, requestMs = 200, replyMs = 2000, reapMs = 20)
        val port = server.start(firstPort = 18806, attempts = 40)
        try {
            Socket("127.0.0.1", port).use { s ->
                val out = s.getOutputStream()
                out.write(
                    ("POST /api/upload?name=a.mp4 HTTP/1.1\r\nHost: x\r\nContent-Type: video/mp4\r\n" +
                        "Authorization: Bearer ${pairing.token}\r\nContent-Length: 4\r\n\r\n").toByteArray()
                )
                out.flush()
                repeat(4) {
                    Thread.sleep(150)
                    out.write('a'.code)
                    out.flush()
                }
                val reply = s.getInputStream().readBytes().toString(Charsets.UTF_8)
                assertTrue(reply, reply.startsWith("HTTP/1.1 200"))
                assertEquals("aaaa", String(device.uploaded!!))
            }
        } finally {
            server.stop()
        }
    }

    @Test
    fun `contrato - sin token, un cuerpo lento tambien vence`() {
        val server = RemoteServer(router, requestMs = 200, replyMs = 500, reapMs = 20)
        val port = server.start(firstPort = 18866, attempts = 40)
        try {
            Socket("127.0.0.1", port).use { s ->
                s.soTimeout = 4000
                s.getOutputStream().write(
                    "POST /api/pair HTTP/1.1\r\nHost: x\r\nContent-Type: application/json\r\nContent-Length: 500\r\n\r\n".toByteArray()
                )
                s.getOutputStream().flush()
                val started = System.nanoTime()
                val reply = runCatching { s.getInputStream().readBytes() }
                assertTrue("el cierre no llegó por el plazo", reply.isSuccess || reply.exceptionOrNull() !is java.net.SocketTimeoutException)
                assertTrue((System.nanoTime() - started) / 1_000_000 < 3000)
            }
        } finally {
            server.stop()
        }
    }

    @Test
    fun `contrato - una sola direccion no ocupa todas las conexiones`() {
        val server = RemoteServer(router)
        val port = server.start(firstPort = 18926, attempts = 40)
        val held = ArrayList<Socket>()
        try {
            repeat(RemoteServer.MAX_PER_ADDRESS) { held.add(Socket("127.0.0.1", port)) }
            Socket("127.0.0.1", port).use { extra ->
                extra.soTimeout = 4000
                assertEquals(-1, extra.getInputStream().read())
            }
            held.forEach { it.close() }
            // Cerradas, los lugares vuelven. El servidor tarda un instante en enterarse.
            val page = "GET / HTTP/1.1\r\nHost: x\r\n\r\n"
            var reply = ""
            for (attempt in 0 until 200) {
                reply = exchange(port, page)
                if (reply.isNotEmpty()) break
                Thread.sleep(10)
            }
            assertTrue(reply, reply.startsWith("HTTP/1.1 200"))
        } finally {
            held.forEach { runCatching { it.close() } }
            server.stop()
        }
    }
}
