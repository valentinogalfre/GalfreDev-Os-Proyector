package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.ui.TapeLabel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Contrato de la cinta entre pantallas: el rótulo de la fila de origen o de destino no desaparece
 * ni aparece de golpe, y no queda debajo del título grande cuando la cinta ya tapa todo.
 */
class TapeLabelTest {

    private val steps = (0..20).map { it / 20f }

    @Test
    fun `contrato - al empezar a tapar el rotulo sigue como antes de moverse, y se va antes de tapar todo`() {
        assertEquals(1f, TapeLabel.alpha(covering = true, ease = 0f), 0f)
        assertEquals(0f, TapeLabel.alpha(covering = true, ease = 1f), 0f)
    }

    @Test
    fun `contrato - al destapar el rotulo no esta con la cinta llena y llega entero cuando la cinta se asienta`() {
        assertEquals(0f, TapeLabel.alpha(covering = false, ease = 0f), 0f)
        assertEquals(1f, TapeLabel.alpha(covering = false, ease = 1f), 0f)
    }

    @Test
    fun `contrato - la transicion es gradual y siempre entre 0 y 1`() {
        val out = steps.map { TapeLabel.alpha(true, it) }
        val back = steps.map { TapeLabel.alpha(false, it) }
        (out + back).forEach { assertTrue(it in 0f..1f) }
        out.zipWithNext().forEach { (a, b) -> assertTrue(b <= a) }
        back.zipWithNext().forEach { (a, b) -> assertTrue(b >= a) }
        // Ningún cuadro salta de golpe: entre pasos de 5 % el cambio es chico.
        (out.zipWithNext() + back.zipWithNext()).forEach { (a, b) -> assertTrue(Math.abs(a - b) <= 0.25f) }
    }
}
