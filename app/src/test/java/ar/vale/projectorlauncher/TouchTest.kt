package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.Touch
import ar.vale.projectorlauncher.remote.Touch.Axis
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

private class Spot(
    val name: String,
    private val left: Int = 0,
    private val top: Int = 0,
    private val right: Int = 1280,
    private val bottom: Int = 720,
    override val clickable: Boolean = false,
    override val scrollable: Boolean = false,
    override val axis: Axis? = null,
    override val visible: Boolean = true,
    override val children: List<Touch.Node> = emptyList()
) : Touch.Node {
    override fun contains(x: Int, y: Int) = x in left until right && y in top until bottom
}

class TouchTest {

    private fun name(node: Touch.Node?) = (node as Spot?)?.name

    // --- El punto ---

    @Test
    fun `contrato - el puntero siempre cae en un pixel que existe`() {
        assertEquals(0f, Touch.pixel(0f, 1280), 0f)
        assertEquals(1279f, Touch.pixel(1f, 1280), 0f)
        assertEquals(359.5f, Touch.pixel(0.5f, 720), 0f)
        assertEquals(0f, Touch.pixel(-1f, 1280), 0f)
        assertEquals(1279f, Touch.pixel(2f, 1280), 0f)
    }

    @Test
    fun `contrato - una pantalla sin tamano no da un punto negativo`() {
        assertEquals(0f, Touch.pixel(1f, 0), 0f)
    }

    // --- Tocar sin pantalla táctil ---

    @Test
    fun `contrato - el toque le llega a la vista de mas adentro que lo acepta`() {
        val root = Spot("raiz", clickable = true, children = listOf(
            Spot("tarjeta", 100, 100, 500, 500, clickable = true, children = listOf(
                Spot("boton", 200, 200, 300, 300, clickable = true)
            ))
        ))
        assertEquals("boton", name(Touch.clickable(root, 250, 250)))
        assertEquals("tarjeta", name(Touch.clickable(root, 150, 150)))
    }

    @Test
    fun `contrato - una fila recibe el toque aunque caiga sobre su texto`() {
        val root = Spot("raiz", children = listOf(
            Spot("fila", 0, 100, 1280, 200, clickable = true, children = listOf(
                Spot("titulo", 100, 120, 400, 180)
            ))
        ))
        assertEquals("fila", name(Touch.clickable(root, 200, 150)))
    }

    @Test
    fun `contrato - lo que esta encima gana`() {
        val root = Spot("raiz", children = listOf(
            Spot("abajo", 0, 0, 500, 500, clickable = true),
            Spot("encima", 0, 0, 500, 500, clickable = true)
        ))
        assertEquals("encima", name(Touch.clickable(root, 100, 100)))
    }

    @Test
    fun `contrato - lo que esta encima y no acepta toques los deja pasar`() {
        val root = Spot("raiz", children = listOf(
            Spot("boton", 0, 0, 500, 500, clickable = true),
            Spot("degradado", 0, 0, 500, 500)
        ))
        assertEquals("boton", name(Touch.clickable(root, 100, 100)))
    }

    @Test
    fun `contrato - lo invisible no recibe toques`() {
        val root = Spot("raiz", children = listOf(
            Spot("oculto", 0, 0, 500, 500, clickable = true, visible = false)
        ))
        assertNull(Touch.clickable(root, 100, 100))
    }

    @Test
    fun `contrato - donde no hay nada para tocar no pasa nada`() {
        val root = Spot("raiz", children = listOf(Spot("boton", 0, 0, 100, 100, clickable = true)))
        assertNull(Touch.clickable(root, 900, 600))
    }

    // --- Desplazar sin pantalla táctil ---

    private val shelf = Spot("estante", 0, 100, 1280, 300, scrollable = true, axis = Axis.HORIZONTAL)
    private val feed = Spot("portada", scrollable = true, axis = Axis.VERTICAL, children = listOf(shelf))

    @Test
    fun `contrato - deslizar en vertical mueve la lista aunque caiga sobre una fila horizontal`() {
        assertEquals("portada", name(Touch.scrollable(feed, 300, 200, Axis.VERTICAL)))
    }

    @Test
    fun `contrato - deslizar en horizontal mueve la fila que esta debajo`() {
        assertEquals("estante", name(Touch.scrollable(feed, 300, 200, Axis.HORIZONTAL)))
    }

    @Test
    fun `contrato - una lista de la que no se sabe el sentido igual se usa`() {
        val root = Spot("raiz", children = listOf(Spot("lista", scrollable = true)))
        assertEquals("lista", name(Touch.scrollable(root, 300, 200, Axis.VERTICAL)))
    }

    @Test
    fun `contrato - la lista del sentido correcto gana a la que no se conoce`() {
        val root = Spot("lista", scrollable = true, axis = Axis.VERTICAL, children = listOf(
            Spot("rara", scrollable = true)
        ))
        assertEquals("lista", name(Touch.scrollable(root, 300, 200, Axis.VERTICAL)))
    }

    @Test
    fun `contrato - si el puntero no esta sobre una lista se mueve la que haya en pantalla`() {
        val root = Spot("raiz", children = listOf(
            Spot("barra", 0, 0, 1280, 80),
            Spot("lista", 0, 80, 1280, 720, scrollable = true, axis = Axis.VERTICAL)
        ))
        assertEquals("lista", name(Touch.scrollable(root, 300, 40, Axis.VERTICAL)))
    }

    @Test
    fun `contrato - sin nada que se mueva no se elige nada`() {
        assertNull(Touch.scrollable(Spot("raiz"), 300, 200, Axis.VERTICAL))
    }

    @Test
    fun `contrato - el sentido del deslizamiento es el del tramo mas largo`() {
        assertEquals(Axis.VERTICAL, Touch.axis(10f, -80f))
        assertEquals(Axis.HORIZONTAL, Touch.axis(-80f, 10f))
    }

    @Test
    fun `contrato - la lista sigue al dedo`() {
        assertTrue("dedo hacia arriba", Touch.forward(0f, -80f))
        assertFalse("dedo hacia abajo", Touch.forward(0f, 80f))
        assertTrue("dedo hacia la izquierda", Touch.forward(-80f, 0f))
        assertFalse("dedo hacia la derecha", Touch.forward(80f, 0f))
    }

    @Test
    fun `contrato - el sentido de una lista sale de lo que declara`() {
        assertEquals(Axis.HORIZONTAL, Touch.axisOf(0, 0, null, sideways = true, upDown = false))
        assertEquals(Axis.VERTICAL, Touch.axisOf(0, 0, null, sideways = false, upDown = true))
        assertEquals(Axis.HORIZONTAL, Touch.axisOf(1, 12, null, sideways = false, upDown = false))
        assertEquals(Axis.VERTICAL, Touch.axisOf(12, 1, null, sideways = false, upDown = false))
        assertEquals(Axis.VERTICAL, Touch.axisOf(6, 3, null, sideways = false, upDown = false))
        assertEquals(Axis.HORIZONTAL, Touch.axisOf(0, 0, "android.widget.HorizontalScrollView", false, false))
        assertEquals(Axis.HORIZONTAL, Touch.axisOf(0, 0, "androidx.viewpager.widget.ViewPager", false, false))
        assertNull(Touch.axisOf(0, 0, "android.widget.FrameLayout", sideways = false, upDown = false))
    }
}
