package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ClaudeRuntime
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** El celular consulta el estado apenas el equipo acepta el pedido: ese estado ya tiene que ser el nuevo. */
class ClaudeAnnounceTest {

    @After
    fun clean() = ClaudeRuntime.unannounce()

    @Test
    fun `contrato - aceptado un pedido, el estado ya lo muestra en curso y sin la respuesta anterior`() {
        ClaudeRuntime.announce("¿Cuánto tarda la luz del Sol?")
        val state = ClaudeRuntime.snapshot
        assertTrue(state.busy)
        assertEquals("¿Cuánto tarda la luz del Sol?", state.question)
        assertEquals("", state.answer)
        assertNull(state.end)
        assertNull(state.error)
    }

    @Test
    fun `contrato - si el pedido no arranco, el estado vuelve a ser el de verdad`() {
        ClaudeRuntime.announce("¿Cuánto tarda la luz del Sol?")
        ClaudeRuntime.unannounce()
        val state = ClaudeRuntime.snapshot
        assertFalse(state.busy)
        assertEquals("", state.question)
    }
}
