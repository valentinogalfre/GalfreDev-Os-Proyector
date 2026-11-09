package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ApiError
import ar.vale.projectorlauncher.claude.ErrorDetail
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.IOException
import java.security.cert.CertificateExpiredException

class ClaudeErrorsTest {

    @Test
    fun `contrato - sin saldo la API puede responder 402 o un 400 que lo dice`() {
        assertTrue(ApiError(402, "billing_error", "Billing problem").noCredit)
        val low = "Your credit balance is too low to access the Anthropic API."
        assertTrue(ApiError(400, "invalid_request_error", low).noCredit)
    }

    @Test
    fun `contrato - un 400 cualquiera no se confunde con falta de saldo`() {
        assertFalse(ApiError(400, "invalid_request_error", "messages: bad").noCredit)
    }

    @Test
    fun `contrato - un rechazo de la API muestra el codigo y su motivo, acotado`() {
        val detail = ErrorDetail.of(ApiError(400, "invalid_request_error", "output_config: " + "x".repeat(500)))!!
        assertTrue(detail, detail.startsWith("HTTP 400: output_config"))
        assertTrue(detail, detail.length <= 160)
    }

    @Test
    fun `contrato - una falla de red muestra la causa de fondo`() {
        val cause = CertificateExpiredException("NotAfter: 2020")
        val error = IOException("handshake", IOException("path", cause))
        assertEquals("CertificateExpiredException: NotAfter: 2020", ErrorDetail.of(error))
    }

    @Test
    fun `contrato - sin error no se inventa un detalle`() {
        assertNull(ErrorDetail.of(null))
    }
}
