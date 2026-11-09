package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ScreenDriver
import ar.vale.projectorlauncher.claude.ScreenText
import ar.vale.projectorlauncher.claude.ScreenTools
import ar.vale.projectorlauncher.remote.RemoteGuard
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** Una vista de mentira, con lo mismo que informa accesibilidad. */
private class V(
    override val text: String? = null,
    override val description: String? = null,
    override val idName: String? = null,
    override val className: String? = "android.view.View",
    override val visible: Boolean = true,
    override val clickable: Boolean = false,
    override val editable: Boolean = false,
    override val scrollable: Boolean = false,
    override val checkable: Boolean = false,
    override val checked: Boolean = false,
    override val focused: Boolean = false,
    override val selected: Boolean = false,
    override val password: Boolean = false,
    val box: List<Int> = listOf(0, 0, 100, 40),
    override val children: List<ScreenText.Node> = emptyList()
) : ScreenText.Node {
    override val left get() = box[0]
    override val top get() = box[1]
    override val right get() = box[2]
    override val bottom get() = box[3]
}

private fun root(vararg children: V) = V(box = listOf(0, 0, 1280, 720), children = children.toList())

private class FakeScreen(var tree: V?, var pkg: String = "com.netflix.mediaclient") : ScreenDriver {
    val did = ArrayList<String>()
    var slept = 0L
    override var available = true
    var afterAction: (() -> Unit)? = null

    override fun snapshot() = tree?.let { ScreenDriver.Snapshot("Netflix", pkg, it, 1280, 720) }
    override fun tap(node: ScreenText.Node) = true.also { did.add("tap:${node.text ?: node.description}"); afterAction?.invoke() }
    override fun type(node: ScreenText.Node?, text: String) = true.also { did.add("type:$text:${node != null}") }
    override fun key(name: String) = true.also { did.add("key:$name") }
    override fun swipe(direction: String) = true.also { did.add("swipe:$direction") }
    override fun pause(milliseconds: Long) { slept += milliseconds }
}

class ScreenTest {

    private fun listing(tree: V) = ScreenText.describe("Netflix", tree, 1280, 720)

    // --- Lo que Claude lee ---

    @Test
    fun `contrato - cada cosa que se puede tocar tiene un numero y su nombre`() {
        val l = listing(root(
            V(text = "Buscar", clickable = true, className = "android.widget.Button", box = listOf(0, 0, 100, 40)),
            V(text = "Mi lista", box = listOf(0, 100, 100, 140))
        ))
        assertTrue(l.text, l.text.startsWith("App al frente: Netflix"))
        assertTrue(l.text.contains("[1] botón \"Buscar\""))
        assertTrue(l.text.contains("[2] texto \"Mi lista\""))
        assertEquals(2, l.targets.size)
        assertEquals("Buscar", l.targets[0].text)
    }

    @Test
    fun `contrato - un boton sin texto se nombra por lo que tiene adentro y eso no se repite`() {
        val card = V(clickable = true, box = listOf(0, 0, 300, 200), children = listOf(
            V(text = "Matrix", box = listOf(0, 0, 300, 40)),
            V(text = "1999", box = listOf(0, 40, 300, 80))
        ))
        val l = listing(root(card))
        assertTrue(l.text, l.text.contains("[1] botón \"Matrix · 1999\""))
        assertEquals("el texto de adentro no ocupa otro renglón", 1, l.targets.size)
    }

    @Test
    fun `contrato - un boton sin nombre igual se puede tocar y dice su id`() {
        val l = listing(root(V(clickable = true, idName = "search_button", className = "android.widget.ImageButton")))
        assertTrue(l.text, l.text.contains("[1] botón sin nombre (search_button)"))
    }

    @Test
    fun `contrato - lo que escribieron en un campo de contrasena nunca sale`() {
        val l = listing(root(V(text = "secreta123", editable = true, password = true, clickable = true)))
        assertFalse(l.text, l.text.contains("secreta123"))
        assertTrue(l.text.contains("campo de contraseña"))
    }

    @Test
    fun `contrato - no se lista lo invisible ni lo que quedo fuera de la pantalla`() {
        val l = listing(root(
            V(text = "oculto", visible = false),
            V(text = "afuera", box = listOf(0, 800, 100, 840)),
            V(text = "sin tamaño", box = listOf(10, 10, 10, 10)),
            V(text = "visible")
        ))
        assertEquals(listOf("visible"), l.targets.map { it.text })
    }

    @Test
    fun `contrato - el orden es el de lectura, de arriba abajo y de izquierda a derecha`() {
        val l = listing(root(
            V(text = "abajo", box = listOf(0, 600, 100, 640)),
            V(text = "derecha", box = listOf(600, 0, 700, 40)),
            V(text = "izquierda", box = listOf(0, 4, 100, 44))
        ))
        assertEquals(listOf("izquierda", "derecha", "abajo"), l.targets.map { it.text })
    }

    @Test
    fun `contrato - una pantalla enorme se corta y lo avisa`() {
        val many = (0 until 200).map { V(text = "fila $it", box = listOf(0, it * 3, 100, it * 3 + 3)) }
        val l = listing(root(*many.toTypedArray()))
        assertTrue(l.targets.size <= 70)
        assertTrue(l.text.contains("no entraron"))
    }

    @Test
    fun `contrato - una pantalla vacia se explica en vez de devolver nada`() {
        val l = listing(root())
        assertTrue(l.text.contains("No hay nada legible"))
        assertTrue(l.targets.isEmpty())
    }

    @Test
    fun `contrato - los estados que importan salen al lado`() {
        val l = listing(root(
            V(text = "Subtítulos", checkable = true, checked = true, clickable = true),
            V(text = "Buscar", editable = true, focused = true, box = listOf(0, 100, 100, 140)),
            V(scrollable = true, box = listOf(0, 200, 1280, 720))
        ))
        assertTrue(l.text, l.text.contains("interruptor \"Subtítulos\" (encendido)"))
        assertTrue(l.text.contains("campo \"Buscar\" (con foco)"))
        assertTrue(l.text.contains("Se puede deslizar"))
    }

    // --- Lo que Claude puede hacer ---

    private val search = V(text = "Buscar", clickable = true)
    private val field = V(text = "", description = "Título", editable = true, box = listOf(0, 100, 300, 140))
    private val secret = V(description = "Clave", editable = true, password = true, box = listOf(0, 200, 300, 240))

    @Test
    fun `contrato - sin Control total no ve ni toca, y dice como activarlo`() {
        val screen = FakeScreen(root(search)).apply { available = false }
        val tools = ScreenTools(screen)
        for (outcome in listOf(tools.see(), tools.tap(1), tools.type("x", null), tools.key("ok"), tools.swipe("abajo"))) {
            assertTrue(outcome.isError)
            assertTrue(outcome.text.contains("Control total"))
        }
        assertTrue(screen.did.isEmpty())
    }

    @Test
    fun `contrato - apagado en los ajustes no hace nada`() {
        val screen = FakeScreen(root(search))
        val tools = ScreenTools(screen) { false }
        assertTrue(tools.see().isError)
        assertTrue(tools.tap(1).isError)
        assertTrue(screen.did.isEmpty())
    }

    @Test
    fun `contrato - no se toca a ciegas, primero hay que mirar`() {
        val screen = FakeScreen(root(search))
        val outcome = ScreenTools(screen).tap(1)
        assertTrue(outcome.isError)
        assertTrue(outcome.text.contains("ver_pantalla"))
        assertTrue(screen.did.isEmpty())
    }

    @Test
    fun `contrato - tocar devuelve la pantalla que quedo`() {
        val screen = FakeScreen(root(search))
        val tools = ScreenTools(screen)
        tools.see()
        screen.afterAction = { screen.tree = root(V(text = "Resultados")) }
        val outcome = tools.tap(1)
        assertFalse(outcome.isError)
        assertEquals(listOf("tap:Buscar"), screen.did)
        assertTrue(outcome.text, outcome.text.contains("Resultados"))
        assertTrue("espera a que la pantalla se asiente", screen.slept >= 500)
    }

    @Test
    fun `contrato - un numero que no esta en la ultima pantalla no toca nada`() {
        val screen = FakeScreen(root(search))
        val tools = ScreenTools(screen)
        tools.see()
        assertTrue(tools.tap(7).isError)
        assertTrue(screen.did.isEmpty())
    }

    @Test
    fun `contrato - los numeros viejos dejan de valer cuando cambia la pantalla`() {
        val screen = FakeScreen(root(search, V(text = "Salir", clickable = true, box = listOf(0, 100, 100, 140))))
        val tools = ScreenTools(screen)
        tools.see()
        screen.tree = root(V(text = "Otra cosa", clickable = true))
        tools.see()
        assertTrue(tools.tap(2).isError)
        tools.tap(1)
        assertEquals(listOf("tap:Otra cosa"), screen.did)
    }

    @Test
    fun `contrato - Claude no escribe en un campo de contrasena`() {
        val screen = FakeScreen(root(search, field, secret))
        val tools = ScreenTools(screen)
        tools.see()
        val outcome = tools.type("1234", 3)
        assertTrue(outcome.isError)
        assertTrue(screen.did.isEmpty())
    }

    @Test
    fun `contrato - escribir va al campo indicado o al que tiene el foco`() {
        val screen = FakeScreen(root(search, field))
        val tools = ScreenTools(screen)
        tools.see()
        assertTrue("un botón no es un campo", tools.type("matrix", 1).isError)
        assertFalse(tools.type("matrix", 2).isError)
        assertFalse(tools.type("matrix", null).isError)
        assertEquals(listOf("type:matrix:true", "type:matrix:false"), screen.did)
    }

    @Test
    fun `contrato - Claude no toca el instalador, los permisos ni la tienda de Google`() {
        val untouchable = listOf(
            "com.android.packageinstaller", "com.google.android.packageinstaller", "com.google.android.permissioncontroller",
            "com.android.vending", "com.android.settings", "com.android.tv.settings", "com.android.settings.intelligence"
        )
        for (pkg in untouchable) {
            assertTrue(pkg, RemoteGuard.handsOff(pkg))
            val screen = FakeScreen(root(V(text = "Instalar", clickable = true)), pkg)
            val tools = ScreenTools(screen)
            val seen = tools.see()
            assertTrue(pkg, seen.isError)
            assertFalse("ni siquiera la lee", seen.text.contains("Instalar"))
            assertTrue(tools.tap(1).isError)
            assertTrue(tools.type("x", null).isError)
            assertTrue(tools.swipe("abajo").isError)
            assertTrue(tools.key("ok").isError)
            assertTrue(screen.did.isEmpty())
        }
        for (pkg in listOf("com.netflix.mediaclient", "com.google.android.youtube", "com.spotify.music", "ar.vale.projectorlauncher")) {
            assertFalse(pkg, RemoteGuard.handsOff(pkg))
        }
        assertFalse(RemoteGuard.handsOff(null))
    }

    @Test
    fun `contrato - de una pantalla que no se toca igual se puede salir`() {
        val screen = FakeScreen(root(V(text = "Instalar", clickable = true)), "com.android.packageinstaller")
        val tools = ScreenTools(screen)
        tools.key("atras")
        tools.key("inicio")
        assertEquals(listOf("key:atras", "key:inicio"), screen.did)
    }

    @Test
    fun `contrato - si aparece el instalador despues de mirar, el numero viejo no lo toca`() {
        val screen = FakeScreen(root(search))
        val tools = ScreenTools(screen)
        tools.see()
        screen.pkg = "com.android.packageinstaller"
        assertTrue(tools.tap(1).isError)
        assertTrue(screen.did.isEmpty())
    }

    @Test
    fun `contrato - una pantalla que no para de cambiar no cuelga la espera`() {
        val screen = FakeScreen(root(search))
        val tools = ScreenTools(screen)
        tools.see()
        var n = 0
        screen.afterAction = {}
        val changing = object : ScreenDriver by screen {
            override fun snapshot() = ScreenDriver.Snapshot("Netflix", "com.netflix.mediaclient", root(V(text = "segundo ${n++}", clickable = true)), 1280, 720)
        }
        val busy = ScreenTools(changing)
        busy.see()
        busy.tap(1)
        assertTrue("tope de espera", screen.slept in 500..3000)
    }
}
