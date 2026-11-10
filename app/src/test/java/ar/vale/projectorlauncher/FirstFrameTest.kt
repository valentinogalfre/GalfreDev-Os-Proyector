package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.media.FirstFrame
import ar.vale.projectorlauncher.media.Srt
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** Contrato del reproductor: retomar sin negro ni subtítulos sobre el negro. */
class FirstFrameTest {


    private val cues = listOf(Srt.Cue(1_000, 3_000, "Hola"))

    @Test
    fun `contrato - mientras falta el primer cuadro no hay subtitulo aunque la posicion caiga en uno`() {
        val gate = FirstFrame()
        assertTrue(gate.waiting)
        assertNull(gate.cue(cues, 2_000))
    }

    @Test
    fun `contrato - con el primer cuadro el subtitulo de la posicion aparece`() {
        val gate = FirstFrame()
        gate.arrived()
        assertFalse(gate.waiting)
        assertEquals("Hola", gate.cue(cues, 2_000)?.text)
    }

    @Test
    fun `contrato - si el video falla o pasa el tope de espera la pantalla no queda tapada para siempre`() {
        val failed = FirstFrame().apply { failed() }
        assertFalse(failed.waiting)
        val late = FirstFrame().apply { gaveUp() }
        assertFalse(late.waiting)
    }
}
