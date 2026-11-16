package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.HttpRequest
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.PublicTls
import ar.vale.projectorlauncher.remote.Router
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import java.io.ByteArrayInputStream
import java.security.KeyPairGenerator
import java.util.Base64

class PublicTlsTest {

    @Test
    fun `el nombre publico de una direccion lleva guiones en lugar de puntos`() {
        assertEquals("192-168-0-27.local-ip.sh", PublicTls.host("192.168.0.27"))
    }

    @Test
    fun `la clave en el formato viejo se envuelve en el que entiende Java`() {
        val modern = KeyPairGenerator.getInstance("RSA").apply { initialize(2048) }.generateKeyPair().private.encoded
        // El formato viejo es el contenido del sobre: lo que queda después de la cabecera de 26 bytes.
        val old = modern.copyOfRange(26, modern.size)
        val pem = { label: String, der: ByteArray -> "-----BEGIN $label-----\n${Base64.getMimeEncoder().encodeToString(der)}\n-----END $label-----\n" }
        assertArrayEquals(modern, PublicTls.pkcs8(pem("RSA PRIVATE KEY", old)))
        assertArrayEquals(modern, PublicTls.pkcs8(pem("PRIVATE KEY", modern)))
        assertNull(PublicTls.pkcs8(pem("EC PRIVATE KEY", old)))
    }

    @Test
    fun `el puerto del certificado publico solo atiende la carrera`() {
        val game = Router(Pairing("t".repeat(48), {}), FakeDevice(), gameOnly = true) { path ->
            if (path == "/carrera/volante.html" || path == "/index.html") HttpResponse.error(200, "pagina") else null
        }
        val get = { path: String -> game.handle(HttpRequest("GET", path, emptyMap(), mapOf("host" to "x"), 0, ByteArrayInputStream(ByteArray(0)))).status }
        assertEquals(200, get("/carrera/volante.html"))
        assertEquals(404, get("/index.html"))
        assertEquals(404, get("/api/status"))
    }
}
