package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.FocusGeometry
import ar.vale.projectorlauncher.remote.FocusGeometry.Box
import ar.vale.projectorlauncher.remote.FocusGeometry.Way
import org.junit.Assert.assertEquals
import org.junit.Test

/** Antes de Android 13, las flechas del celular dentro de una app Compose dependen de esto. */
class FocusGeometryTest {

    private val column = listOf(Box(100, 100, 300, 150), Box(100, 200, 300, 250), Box(100, 300, 300, 350))
    private val row = listOf(Box(100, 100, 200, 200), Box(250, 100, 350, 200), Box(400, 100, 500, 200))

    @Test
    fun `contrato - abajo en una lista va al siguiente y no salta`() {
        assertEquals(1, FocusGeometry.next(column[0], Way.DOWN, column))
    }

    @Test
    fun `contrato - arriba en una lista vuelve al anterior`() {
        assertEquals(1, FocusGeometry.next(column[2], Way.UP, column))
    }

    @Test
    fun `contrato - izquierda y derecha siguen la fila`() {
        assertEquals(1, FocusGeometry.next(row[0], Way.RIGHT, row))
        assertEquals(1, FocusGeometry.next(row[2], Way.LEFT, row))
    }

    @Test
    fun `contrato - sin nada en esa direccion no se mueve`() {
        assertEquals(-1, FocusGeometry.next(column[2], Way.DOWN, column))
        assertEquals(-1, FocusGeometry.next(column[0], Way.UP, column))
        assertEquals(-1, FocusGeometry.next(column[0], Way.LEFT, column))
    }

    @Test
    fun `contrato - lo que esta en la misma fila gana aunque otro quede mas cerca`() {
        val from = Box(100, 100, 200, 200)
        val aligned = Box(900, 100, 1000, 200)
        val closerButBelow = Box(250, 210, 350, 310)
        assertEquals(0, FocusGeometry.next(from, Way.RIGHT, listOf(aligned, closerButBelow)))
    }

    @Test
    fun `contrato - si nada queda alineado va al mas cercano`() {
        val from = Box(100, 100, 200, 200)
        val far = Box(800, 400, 900, 500)
        val near = Box(300, 300, 400, 400)
        assertEquals(1, FocusGeometry.next(from, Way.RIGHT, listOf(far, near)))
    }

    @Test
    fun `contrato - un elemento que se superpone no cuenta como siguiente`() {
        val from = Box(100, 100, 300, 300)
        val overlapping = Box(150, 150, 400, 400)
        assertEquals(-1, FocusGeometry.next(from, Way.RIGHT, listOf(overlapping)))
    }

    @Test
    fun `contrato - en una grilla abajo mantiene la columna`() {
        val grid = listOf(
            Box(100, 100, 200, 200), Box(300, 100, 400, 200),
            Box(100, 300, 200, 400), Box(300, 300, 400, 400)
        )
        assertEquals(3, FocusGeometry.next(grid[1], Way.DOWN, grid))
    }
}
