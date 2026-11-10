package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.ui.RowSnap
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Contrato de las listas con las flechas: ninguna fila queda cortada contra el borde de arriba
 * (el título fijo), y la fila elegida sigue a la vista. Los números son píxeles de la lista.
 */
class RowsSnapTest {

    private val viewTop = 0
    private val viewBottom = 600

    @Test
    fun `contrato - bajando, la fila cortada arriba se esconde entera`() {
        // Cortada: va de -20 a 48. La elegida llena el fondo: no hay lugar para mostrar la cortada.
        assertEquals(48, RowSnap.correction(-20, 48, 600, viewTop, viewBottom))
    }

    @Test
    fun `contrato - subiendo, la fila cortada arriba se muestra entera`() {
        // Hay lugar abajo: la elegida baja 20 px y sigue a la vista, y el rótulo de arriba se lee entero.
        assertEquals(-20, RowSnap.correction(-20, 48, 300, viewTop, viewBottom))
    }

    @Test
    fun `contrato - una fila entera, justo al borde o ya fuera de vista no se toca`() {
        assertEquals(0, RowSnap.correction(0, 68, 300, viewTop, viewBottom))
        assertEquals(0, RowSnap.correction(12, 80, 300, viewTop, viewBottom))
        assertEquals(0, RowSnap.correction(-68, 0, 300, viewTop, viewBottom))
    }

    @Test
    fun `contrato - tras el ajuste ninguna fila queda cortada y la elegida no se sale`() {
        for (top in -67..-1) for (selBottom in 100..viewBottom step 25) {
            val bottom = top + 68
            val move = RowSnap.correction(top, bottom, selBottom, viewTop, viewBottom)
            val newTop = top - move
            val newBottom = bottom - move
            assertTrue("fila cortada: $top..$bottom mueve $move", newTop >= viewTop || newBottom <= viewTop)
            assertTrue("la elegida se sale: $selBottom mueve $move", selBottom - move <= viewBottom)
        }
    }
}
