package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.ui.Row
import org.junit.Assert.assertEquals
import org.junit.Test

/** Contrato de las listas: el rótulo de la primera sección no queda fuera de vista. */
class RowsFirstTest {


    @Test
    fun `contrato - la lista arranca en la primera fila que se puede elegir y los encabezados de arriba quedan para mostrarse`() {
        val rows = listOf(Row.header("SEGUÍ VIENDO"), Row("Sintel") {}, Row.header("SERVICIOS"), Row("Netflix") {})
        assertEquals(1, Row.firstSelectable(rows))
        assertEquals(0, Row.firstSelectable(listOf(Row("Sintel") {})))
        assertEquals(0, Row.firstSelectable(emptyList()))
    }
}
