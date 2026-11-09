package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.apps.Streaming
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class StreamingTest {

    private val netflix = Streaming.ALL.first { it.name == "Netflix" }

    @Test
    fun `contrato - con las dos versiones se abre la de TV`() {
        assertEquals(netflix.tv.first(), Streaming.installed(netflix) { true })
    }

    @Test
    fun `contrato - si solo esta la de celular se abre esa`() {
        assertEquals(netflix.play, Streaming.installed(netflix) { it == netflix.play })
    }

    @Test
    fun `contrato - un servicio sin instalar no tiene paquete que abrir`() {
        assertNull(Streaming.installed(netflix) { false })
    }

    @Test
    fun `contrato - un servicio se reconoce por cualquiera de sus dos versiones`() {
        assertEquals(netflix, Streaming.byPackage(netflix.play))
        assertEquals(netflix, Streaming.byPackage(netflix.tv.first()))
        assertNull(Streaming.byPackage("org.videolan.vlc"))
    }

    @Test
    fun `contrato - el celular ve cada servicio una vez y con lo que corresponde abrir`() {
        val list = Streaming.forPhone { it == netflix.tv.first() }
        assertEquals(Streaming.ALL.size, list.length())
        val first = list.getJSONObject(0)
        assertEquals("Netflix", first.getString("name"))
        assertEquals(netflix.tv.first(), first.getString("package"))
        assertTrue(first.getBoolean("installed"))
    }

    @Test
    fun `contrato - un servicio sin instalar se pide por su paquete de Google Play`() {
        val first = Streaming.forPhone { false }.getJSONObject(0)
        assertEquals(netflix.play, first.getString("package"))
        assertFalse(first.getBoolean("installed"))
    }

    @Test
    fun `contrato - YouTube se abre en la version de TV que traen estos firmwares`() {
        val youtube = Streaming.ALL.first { it.name == "YouTube" }
        assertEquals("com.google.android.youtube.tv", Streaming.installed(youtube) { true })
    }

    @Test
    fun `contrato - un servicio puede tener mas de una version de TV`() {
        val paramount = Streaming.ALL.first { it.name == "Paramount+" }
        assertEquals(paramount, Streaming.byPackage("com.cbs.ca"))
        assertEquals("com.cbs.ca", Streaming.installed(paramount) { it == "com.cbs.ca" })
    }

    @Test
    fun `contrato - HBO Max se reconoce tambien por su paquete anterior`() {
        assertEquals("HBO Max", Streaming.byPackage("com.hbo.hbonow")?.name)
    }

    @Test
    fun `contrato - con las dos versiones de HBO se abre la actual`() {
        val hbo = Streaming.ALL.first { it.name == "HBO Max" }
        assertEquals("com.wbd.stream", Streaming.installed(hbo) { true })
    }

    @Test
    fun `contrato - si solo esta la version anterior de HBO se abre esa`() {
        val hbo = Streaming.ALL.first { it.name == "HBO Max" }
        assertEquals("com.hbo.hbonow", Streaming.installed(hbo) { it == "com.hbo.hbonow" })
    }

    @Test
    fun `contrato - se reconocen las apps que trae el Chowa P8`() {
        val factory = mapOf(
            "com.google.android.youtube.tv" to "YouTube",
            "com.amazon.amazonvideo.livingroom" to "Prime Video",
            "com.disney.disneyplus" to "Disney+",
            "com.wbd.stream" to "HBO Max",
            "com.cbs.ca" to "Paramount+",
            "tv.pluto.android" to "Pluto TV",
            "com.spotify.tv.android" to "Spotify",
            "com.univision.prendetv" to "ViX"
        )
        factory.forEach { (pkg, name) -> assertEquals(pkg, name, Streaming.byPackage(pkg)?.name) }
    }

    @Test
    fun `contrato - ningun paquete se repite entre servicios`() {
        val all = Streaming.ALL.flatMap { it.tv.asList() + it.play + listOfNotNull(it.old) }
        assertEquals(all.size, all.toSet().size)
    }

    @Test
    fun `contrato - un enlace se reconoce por el sitio del servicio y sus subdominios, nunca por parecerse`() {
        assertEquals("Netflix", Streaming.byHost("www.netflix.com")?.name)
        assertEquals("Netflix", Streaming.byHost("NETFLIX.com")?.name)
        assertEquals("YouTube", Streaming.byHost("youtu.be")?.name)
        assertEquals("YouTube", Streaming.byHost("m.youtube.com")?.name)
        assertNull(Streaming.byHost("netflix.com.malo.net"))
        assertNull(Streaming.byHost("minetflix.com"))
        assertNull(Streaming.byHost("galfredev.com"))
        assertNull(Streaming.byHost(null))
    }

    @Test
    fun `contrato - la descripcion del permiso dice que Claude lee la pantalla`() {
        val strings = File("src/main/res/values/strings.xml").readText()
        val description = strings.substringAfter("name=\"remote_a11y_description\">").substringBefore("</string>")
        assertTrue(description.contains("Claude"))
        assertTrue(description.contains("Anthropic"))
        assertFalse("ya no es cierto que no lee nada", description.contains("No lee"))
    }

    @Test
    fun `contrato - el servicio de accesibilidad declara que puede hacer gestos`() {
        val config = File("src/main/res/xml/remote_accessibility.xml").readText()
        assertTrue(config.contains("""android:canPerformGestures="true""""))
    }

    @Test
    fun `contrato - la pagina del celular nunca arma HTML con datos del equipo`() {
        val page = File("src/main/assets/remote/index.html").readText()
        assertFalse(page.contains("innerHTML"))
        assertFalse(page.contains("insertAdjacentHTML"))
        assertFalse(page.contains("document.write"))
    }
}
