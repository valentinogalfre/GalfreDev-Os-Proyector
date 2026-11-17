package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.carrera.Carrera
import ar.vale.projectorlauncher.carrera.CarreraActivity
import ar.vale.projectorlauncher.carrera.Pipe
import ar.vale.projectorlauncher.remote.Channel
import ar.vale.projectorlauncher.remote.HttpParser
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.Qr
import ar.vale.projectorlauncher.remote.RemoteServer
import ar.vale.projectorlauncher.remote.Router
import ar.vale.projectorlauncher.remote.WebSocket
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.DataInputStream
import java.net.Socket
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

/** Una punta de conexión de mentira: lo que el test manda entra por [say], lo que la sala contesta sale por [heard]. */
private class FakeChannel : Channel {
    private val incoming = LinkedBlockingQueue<String>()
    val heard = LinkedBlockingQueue<String>()
    @Volatile var closed = false
    @Volatile var replaced = false

    fun say(json: JSONObject) = incoming.put(json.toString())
    fun hangUp() = incoming.put(END)
    fun next(type: String): JSONObject {
        while (true) {
            val text = heard.poll(3, TimeUnit.SECONDS) ?: throw AssertionError("no llegó «$type»")
            val json = JSONObject(text)
            if (json.getString("t") == type) return json
        }
    }

    override fun read(): String? = incoming.take().takeIf { it !== END }
    override fun send(text: String) = !closed && heard.offer(text)
    override fun close() {
        closed = true
        incoming.offer(END)
    }

    override fun replace() {
        replaced = true
        close()
    }

    private companion object {
        const val END = "\u0000fin"
    }
}

class CarreraTest {

    private val carrera = Carrera()

    private fun connect(hello: JSONObject, from: String = "192.168.0.20"): FakeChannel {
        val channel = FakeChannel()
        thread(isDaemon = true) { carrera.serve(channel, from) }
        channel.say(hello)
        return channel
    }

    private fun host(room: Carrera.Room, from: String = "127.0.0.1") = connect(JSONObject().put("t", "host").put("secret", room.hostSecret), from)

    private fun join(room: Carrera.Room, name: String, from: String = "192.168.0.20", key: String? = null) =
        connect(JSONObject().put("t", "join").put("room", room.code).put("name", name).put("key", key ?: ""), from)

    private fun mask(opcode: Int, payload: ByteArray, final: Boolean = true): ByteArray {
        val key = byteArrayOf(1, 2, 3, 4)
        val out = ByteArrayOutputStream()
        out.write((if (final) 0x80 else 0) or opcode)
        out.write(0x80 or payload.size)
        out.write(key)
        payload.forEachIndexed { i, b -> out.write(b.toInt() xor key[i and 3].toInt()) }
        return out.toByteArray()
    }

    // --- El protocolo ---

    @Test
    fun `websocket - el saludo responde la clave que pide el estandar`() {
        val request = HttpParser.parse(
            ByteArrayInputStream(
                ("GET /api/carrera/socket HTTP/1.1\r\nHost: x\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n" +
                    "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n").toByteArray()
            )
        )!!
        assertTrue(WebSocket.wanted(request))
        // El ejemplo del RFC 6455.
        assertTrue(String(WebSocket.accept(request)).contains("Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\r\n"))
    }

    @Test
    fun `websocket - lee texto enmascarado, entero o en partes, y contesta el ping`() {
        val wire = mask(0x1, "hola".toByteArray()) + mask(0x9, "x".toByteArray()) +
            mask(0x1, "par".toByteArray(), final = false) + mask(0x0, "tido".toByteArray())
        val out = ByteArrayOutputStream()
        val socket = WebSocket(ByteArrayInputStream(wire), out)
        assertEquals("hola", socket.read())
        assertEquals("partido", socket.read())
        assertNull(socket.read())
        Thread.sleep(100)
        assertEquals(listOf(0x8A.toByte(), 1.toByte(), 'x'.code.toByte()), out.toByteArray().take(3))
    }

    @Test
    fun `websocket - corta si el mensaje no viene enmascarado o es demasiado grande`() {
        val plain = byteArrayOf(0x81.toByte(), 2, 'h'.code.toByte(), 'i'.code.toByte())
        assertNull(WebSocket(ByteArrayInputStream(plain), ByteArrayOutputStream()).read())
        val big = byteArrayOf(0x81.toByte(), (0x80 or 126).toByte(), 0x40, 0) + ByteArray(4 + 0x4000)
        assertNull(WebSocket(ByteArrayInputStream(big), ByteArrayOutputStream()).read())
    }

    // --- La sala ---

    @Test
    fun `sala - sin sala abierta o con otro codigo no entra nadie`() {
        val before = connect(JSONObject().put("t", "join").put("room", "x").put("name", "Vale"))
        assertEquals("room", before.next("error").getString("code"))
        val room = carrera.open()
        val wrong = connect(JSONObject().put("t", "join").put("room", room.code + "0").put("name", "Vale"))
        assertEquals("room", wrong.next("error").getString("code"))
    }

    @Test
    fun `sala - la pared solo se conecta desde el mismo equipo y con su secreto`() {
        val room = carrera.open()
        val outside = host(room, from = "192.168.0.30")
        Thread.sleep(150)
        assertTrue(outside.closed)
        assertNull(outside.heard.poll())
        val guess = connect(JSONObject().put("t", "host").put("secret", room.code), "127.0.0.1")
        Thread.sleep(150)
        assertTrue(guess.closed)
        assertNotNull(host(room).next("roster"))
    }

    @Test
    fun `sala - el giro de un volante le llega a la pared acotado y con su numero`() {
        val room = carrera.open()
        val wall = host(room)
        val phone = join(room, "  Vale  ")
        val joined = phone.next("joined")
        assertEquals("Vale", joined.getString("name"))
        wall.next("roster")
        assertEquals("Vale", wall.next("roster").getJSONArray("players").getJSONObject(0).getString("name"))
        phone.say(JSONObject().put("t", "in").put("s", 7.5).put("b", 1).put("n", 0).put("k", 1))
        val input = wall.next("in")
        assertEquals(joined.getInt("id"), input.getInt("id"))
        assertEquals(1.0, input.getDouble("s"), 0.0)
        assertTrue(input.getBoolean("b"))
        assertFalse(input.getBoolean("n"))
        assertTrue(input.getBoolean("k"))
    }

    @Test
    fun `sala - la palanca del futbol le llega a la pared acotada, y sin numeros de mas`() {
        val room = carrera.open()
        val wall = host(room)
        val phone = join(room, "Vale")
        phone.next("joined")
        phone.say(JSONObject().put("t", "in").put("x", -3.0).put("y", 0.25).put("k", 1))
        val input = wall.next("in")
        assertEquals(-1.0, input.getDouble("x"), 0.0)
        assertEquals(0.25, input.getDouble("y"), 1e-9)
        assertEquals(0.0, input.getDouble("s"), 0.0)
        assertTrue(input.getBoolean("k"))
        phone.say(JSONObject().put("t", "in").put("x", "nada"))
        assertEquals(0.0, wall.next("in").getDouble("x"), 0.0)
    }

    @Test
    fun `sala - lo que dice la pared llega a todos, y a uno solo cuando es para el`() {
        val room = carrera.open()
        val wall = host(room)
        val a = join(room, "Ana", "192.168.0.21")
        val b = join(room, "Beto", "192.168.0.22")
        val idA = a.next("joined").getInt("id")
        b.next("joined")
        wall.say(JSONObject().put("t", "all").put("d", JSONObject().put("phase", "lobby")))
        assertEquals("lobby", a.next("all").getJSONObject("d").getString("phase"))
        assertEquals("lobby", b.next("all").getJSONObject("d").getString("phase"))
        wall.say(JSONObject().put("t", "to").put("id", idA).put("d", JSONObject().put("place", 1)))
        assertEquals(1, a.next("you").getJSONObject("d").getInt("place"))
        // Quien entra tarde recibe lo último que se dijo a todos.
        assertEquals("lobby", join(room, "Caro", "192.168.0.23").next("all").getJSONObject("d").getString("phase"))
        assertNull(b.heard.poll(200, TimeUnit.MILLISECONDS))
    }

    @Test
    fun `sala - un cuadro de la carrera llega a todos los celulares, no se guarda y tiene un largo maximo`() {
        val room = carrera.open()
        val wall = host(room)
        val a = join(room, "Ana", "192.168.0.21")
        val b = join(room, "Beto", "192.168.0.22")
        a.next("joined")
        b.next("joined")
        wall.say(JSONObject().put("t", "all").put("d", JSONObject().put("phase", "race")))
        wall.say(JSONObject().put("t", "st").put("d", "4.5|10,0,0,0,30,1"))
        assertEquals("4.5|10,0,0,0,30,1", a.next("st").getString("d"))
        assertEquals("4.5|10,0,0,0,30,1", b.next("st").getString("d"))
        // Uno más largo de lo que ocupan ocho autos no pasa.
        wall.say(JSONObject().put("t", "st").put("d", "9".repeat(Carrera.STATE_CHARS + 1)))
        assertNull(b.heard.poll(300, TimeUnit.MILLISECONDS))
        // Quien entra tarde recibe cómo está la sala, pero no un cuadro viejo.
        val late = join(room, "Caro", "192.168.0.23")
        assertEquals("race", late.next("all").getJSONObject("d").getString("phase"))
        val rest = generateSequence { late.heard.poll(300, TimeUnit.MILLISECONDS) }.toList()
        assertEquals(emptyList<String>(), rest.filter { JSONObject(it).getString("t") == "st" })
    }

    @Test
    fun `sala - un celular que se cae vuelve a su auto con su clave`() {
        val room = carrera.open()
        val wall = host(room)
        val first = join(room, "Vale")
        val joined = first.next("joined")
        first.hangUp()
        Thread.sleep(150)
        val again = join(room, "Vale", key = joined.getString("key")).next("joined")
        assertEquals(joined.getInt("id"), again.getInt("id"))
        Thread.sleep(150)
        var last: JSONObject? = null
        while (true) last = JSONObject(wall.heard.poll() ?: break).takeIf { it.getString("t") == "roster" } ?: last
        val players = last!!.getJSONArray("players")
        assertEquals(1, players.length())
        assertTrue(players.getJSONObject(0).getBoolean("on"))
    }

    @Test
    fun `sala - el mismo volante abierto dos veces deja uno solo, y al otro se le avisa que no insista`() {
        val room = carrera.open()
        val first = join(room, "Vale")
        val key = first.next("joined").getString("key")
        val second = join(room, "Vale", key = key)
        second.next("joined")
        assertTrue(first.replaced)
        assertFalse(second.closed)
        // En el cable el aviso es el código de cierre, que el navegador le entrega a la página.
        val out = ByteArrayOutputStream()
        val socket = WebSocket(ByteArrayInputStream(ByteArray(0)), out)
        socket.replace()
        socket.read()
        Thread.sleep(100)
        assertEquals(listOf(0x88.toByte(), 2.toByte(), (WebSocket.REPLACED shr 8).toByte(), WebSocket.REPLACED.toByte()), out.toByteArray().toList())
    }

    @Test
    fun `sala - hay un tope de autos y un tope por direccion`() {
        val room = carrera.open()
        repeat(Carrera.MAX_PER_ADDRESS) { join(room, "Uno$it", "192.168.0.50").next("joined") }
        assertEquals("full", join(room, "Otro", "192.168.0.50").next("error").getString("code"))
        repeat(Carrera.MAX_PLAYERS - Carrera.MAX_PER_ADDRESS) { join(room, "J$it", "192.168.1.$it").next("joined") }
        assertEquals("full", join(room, "Tarde", "192.168.2.1").next("error").getString("code"))
    }

    @Test
    fun `sala - un volante no puede inundar a la pared`() {
        val room = carrera.open()
        val wall = host(room)
        val phone = join(room, "Vale")
        phone.next("joined")
        repeat(400) { phone.say(JSONObject().put("t", "in").put("s", 0.1)) }
        phone.say(JSONObject().put("t", "ping").put("n", 1))
        Thread.sleep(400)
        val inputs = generateSequence { wall.heard.poll() }.count { JSONObject(it).getString("t") == "in" }
        assertTrue("llegaron $inputs", inputs <= Carrera.MAX_PER_SECOND * 2)
    }

    @Test
    fun `sala - cerrarla echa a todos y el codigo viejo deja de servir`() {
        val room = carrera.open()
        val phone = join(room, "Vale")
        phone.next("joined")
        carrera.close()
        Thread.sleep(100)
        assertTrue(phone.closed)
        carrera.open()
        assertEquals("room", join(room, "Vale").next("error").getString("code"))
    }

    // --- Por la red de verdad ---

    @Test
    fun `servidor - un volante entra por websocket y otra pagina no`() {
        val pairing = Pairing("t".repeat(48), {})
        val router = Router(pairing, FakeDevice(), race = carrera::serve) { HttpResponse.error(404, "x") }
        val server = RemoteServer(router)
        val port = server.start(18790, 20)
        try {
            val room = carrera.open()
            fun upgrade(origin: String?): Socket {
                val socket = Socket("127.0.0.1", port)
                socket.soTimeout = 3000
                val head = StringBuilder("GET /api/carrera/socket HTTP/1.1\r\nHost: 127.0.0.1:$port\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n")
                head.append("Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n")
                if (origin != null) head.append("Origin: $origin\r\n")
                socket.getOutputStream().write(head.append("\r\n").toString().toByteArray())
                return socket
            }
            fun statusLine(socket: Socket): String {
                val line = StringBuilder()
                while (true) {
                    val c = socket.getInputStream().read()
                    if (c < 0 || c == '\n'.code) break
                    line.append(c.toChar())
                }
                return line.toString().trim()
            }
            assertFalse(statusLine(upgrade("http://otra.pagina")).contains("101"))
            assertFalse(statusLine(upgrade(null)).contains("101"))

            val socket = upgrade("http://127.0.0.1:$port")
            assertEquals("HTTP/1.1 101 Switching Protocols", statusLine(socket))
            val input = DataInputStream(socket.getInputStream())
            while (input.readLine().isNotEmpty()) Unit
            val hello = JSONObject().put("t", "join").put("room", room.code).put("name", "Vale").toString().toByteArray()
            socket.getOutputStream().write(mask(0x1, hello))
            assertEquals(0x81, input.readUnsignedByte())
            val reply = ByteArray(input.readUnsignedByte()).also(input::readFully)
            assertEquals("joined", JSONObject(String(reply)).getString("t"))
            socket.close()
        } finally {
            server.stop()
            carrera.close()
        }
    }

    @Test
    fun laParedHablaConLaSalaSinPasarPorLaRed() {
        val carrera = Carrera()
        val room = carrera.open()
        val pipe = Pipe()
        val serving = thread { carrera.serve(pipe, "127.0.0.1") }
        pipe.push(JSONObject().put("t", "host").put("secret", room.hostSecret).toString())
        val phone = FakeChannel()
        thread { carrera.serve(phone, "192.168.0.7") }
        phone.say(JSONObject().put("t", "join").put("room", room.code).put("name", "Vale").put("key", "k".repeat(24)))
        phone.next("joined")
        phone.say(JSONObject().put("t", "in").put("s", 0.5).put("n", true))

        val heard = ArrayList<JSONObject>()
        val until = System.currentTimeMillis() + 3000
        while (heard.none { it.optString("t") == "in" } && System.currentTimeMillis() < until) {
            val batch = org.json.JSONArray(pipe.drain())
            for (i in 0 until batch.length()) heard.add(batch.getJSONObject(i))
            Thread.sleep(5)
        }
        assertTrue(heard.any { it.optString("t") == "roster" })
        assertEquals(0.5, heard.first { it.optString("t") == "in" }.getDouble("s"), 1e-9)

        pipe.close()
        serving.join(2000)
        assertFalse(serving.isAlive)
        assertNull(pipe.drain())
    }

    @Test
    fun siLaParedDejaDeLeerElCanalSeCierra() {
        val pipe = Pipe(limit = 3)
        repeat(3) { assertTrue(pipe.send("{}")) }
        assertFalse(pipe.send("{}"))
        assertNull(pipe.drain())
        assertNull(pipe.read())
    }

    @Test
    fun elQrViajaComoLadoYModulosEnHexadecimal() {
        val text = "http://192.168.0.20:8686/carrera/volante.html#r=0123456789abcdef"
        val matrix = Qr.encode(text)
        val (side, hex) = CarreraActivity.qr(text).split("-")
        assertEquals(matrix.size, side.toInt())
        assertEquals((matrix.size * matrix.size + 3) / 4, hex.length)
        for (y in 0 until matrix.size) for (x in 0 until matrix.size) {
            val at = y * matrix.size + x
            val bit = (Character.digit(hex[at / 4], 16) shr (3 - at % 4)) and 1
            assertEquals(matrix[x, y], bit == 1)
        }
    }
}
