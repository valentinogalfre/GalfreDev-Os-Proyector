package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.media.Storage
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Test

/** Contrato de Cine: título y dato de cada carpeta. */
class CinePlaceTest {

    private val internal = FileItem(File("/storage/emulated/0"), FileKind.DIR, "Memoria interna")
    private val usb = FileItem(File("/storage/ABCD-1234"), FileKind.DIR, "USB ABCD-1234")
    private val roots = listOf(internal, usb)

    @Test
    fun `contrato - la raiz de la memoria interna se titula con su nombre visible y no muestra la ruta del sistema`() {
        val place = Storage.place(internal.file, roots)
        assertEquals("Memoria interna", place.title)
        assertNull(place.where)
    }

    @Test
    fun `contrato - la raiz de un USB se titula con el nombre visible del USB`() {
        val place = Storage.place(usb.file, roots)
        assertEquals("USB ABCD-1234", place.title)
        assertNull(place.where)
    }

    @Test
    fun `contrato - una carpeta de la memoria interna dice donde esta con el nombre visible de la raiz`() {
        val place = Storage.place(File("/storage/emulated/0/Pictures"), roots)
        assertEquals("Pictures", place.title)
        assertEquals("Memoria interna", place.where)
    }

    @Test
    fun `contrato - una carpeta mas adentro suma el camino sin mostrar nunca storage emulated`() {
        val place = Storage.place(File("/storage/emulated/0/Pictures/Sintel"), roots)
        assertEquals("Sintel", place.title)
        assertEquals("Memoria interna/Pictures", place.where)
        assertFalse(place.where!!.contains("/storage"))
    }

    @Test
    fun `contrato - una carpeta del USB dice el nombre visible del USB`() {
        val place = Storage.place(File("/storage/ABCD-1234/Peliculas/2010"), roots)
        assertEquals("2010", place.title)
        assertEquals("USB ABCD-1234/Peliculas", place.where)
    }

    @Test
    fun `contrato - un nombre que empieza igual que una raiz no se confunde con ella`() {
        val place = Storage.place(File("/storage/emulated/01/Fotos"), roots)
        assertEquals("Fotos", place.title)
        assertEquals("/storage/emulated/01", place.where)
    }
}
