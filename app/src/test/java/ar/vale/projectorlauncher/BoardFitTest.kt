package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.juntada.BoardFit
import ar.vale.projectorlauncher.juntada.Juntada
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** La tabla de resultados de la pared entra entera, o dice cuántas filas no entraron. */
class BoardFitTest {

    // Medidas del 1080p de la captura W-62g: la tabla tiene 505 px y cada fila mide 79 px.
    private val available = 505f
    private val natural = 79f

    @Test
    fun `contrato - siete personas entran enteras y ninguna fila queda cortada`() {
        val plan = BoardFit.plan(7, available, natural)
        assertEquals(7, plan.shown)
        assertEquals(0, plan.hidden)
        assertTrue("las 7 filas suman ${7 * plan.rowHeight}", 7 * plan.rowHeight <= available)
    }

    @Test
    fun `contrato - lo que ya entraba no se achica`() {
        val plan = BoardFit.plan(6, available, natural)
        assertEquals(6, plan.shown)
        assertEquals(natural, plan.rowHeight, 0f)
    }

    @Test
    fun `contrato - una fila no se achica por debajo del minimo legible`() {
        for (count in 0..Juntada.MAX_PEOPLE) {
            val plan = BoardFit.plan(count, available, natural)
            if (plan.shown > 0) assertTrue("$count filas", plan.rowHeight >= natural * BoardFit.MIN_SCALE - 0.01f)
        }
    }

    @Test
    fun `contrato - con el maximo de personas de la Juntada no queda ninguna fila cortada ni callada`() {
        val people = Juntada.MAX_PEOPLE
        val plan = BoardFit.plan(people, available, natural)
        assertTrue("entran ${plan.slots} filas de ${plan.rowHeight}", plan.slots * plan.rowHeight <= available)
        assertTrue("faltan filas y no se dice", plan.hidden > 0)
        assertEquals("lo que se muestra más lo que falta es todo", people, plan.shown + plan.hidden)
        val rows = BoardFit.rows((1..people).map { "persona $it" }, plan) { "y $it más" }
        assertEquals(plan.slots, rows.size)
        assertEquals("y ${plan.hidden} más", rows.last())
    }

    @Test
    fun `contrato - nunca se deja afuera una sola fila`() {
        for (count in 0..Juntada.MAX_PEOPLE) {
            for (height in listOf(300f, 400f, 505f, 700f)) {
                assertNotEquals("$count filas en $height px", 1, BoardFit.plan(count, height, natural).hidden)
            }
        }
    }

    @Test
    fun `contrato - ninguna cantidad de filas se pasa del alto disponible`() {
        for (count in 0..Juntada.MAX_PEOPLE) {
            for (height in listOf(300f, 400f, 505f, 700f)) {
                val plan = BoardFit.plan(count, height, natural)
                assertTrue("$count filas en $height px: ${plan.slots} × ${plan.rowHeight}", plan.slots * plan.rowHeight <= height + 0.01f)
                assertEquals(count, plan.shown + plan.hidden)
            }
        }
    }
}
