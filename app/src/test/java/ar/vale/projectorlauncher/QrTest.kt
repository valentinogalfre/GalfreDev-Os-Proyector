package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.Qr
import com.google.zxing.common.BitMatrix
import com.google.zxing.qrcode.decoder.Decoder
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

/** El código solo sirve si otro lector, escrito por otra gente, lo entiende. */
class QrTest {

    private fun read(text: String): String {
        val qr = Qr.encode(text)
        val bits = BitMatrix(qr.size)
        for (y in 0 until qr.size) for (x in 0 until qr.size) if (qr[x, y]) bits.set(x, y)
        return Decoder().decode(bits).text
    }

    @Test
    fun `contrato - la direccion de emparejamiento real se lee igual`() {
        val url = "http://192.168.100.123:8686/#t=" + "a1b2c3d4".repeat(6)
        assertEquals(url, read(url))
    }

    @Test
    fun `contrato - se lee en todas las versiones que puede generar`() {
        for (length in listOf(1, 10, 14, 15, 26, 27, 42, 43, 62, 63, 84, 85, 106, 107, 122, 123, 152, 153, 180, 181, 213)) {
            val text = (0 until length).joinToString("") { "abcdefghij0123456789"[it % 20].toString() }
            assertEquals("largo $length", text, read(text))
        }
    }

    @Test
    fun `contrato - acentos y simbolos sobreviven`() {
        assertEquals("http://a/#t=ñandú-€", read("http://a/#t=ñandú-€"))
    }

    @Test
    fun `contrato - un texto que no entra se rechaza en vez de generar un codigo roto`() {
        assertThrows(IllegalArgumentException::class.java) { Qr.encode("x".repeat(400)) }
    }
}
