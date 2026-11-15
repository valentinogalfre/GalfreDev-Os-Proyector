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

    private val prime = Streaming.ALL.first { it.name == "Prime Video" }

    @Test
    fun `contrato - con las dos versiones instaladas se abre la que se eligio`() {
        val tv = prime.tv.first()
        assertEquals(prime.play, Streaming.installed(prime, prime.play) { true })
        // Una elección que ya no está instalada, o que es de otro servicio, no cuenta.
        assertEquals(tv, Streaming.installed(prime, prime.play) { it == tv })
        assertEquals(tv, Streaming.installed(prime, netflix.play) { true })
    }

    @Test
    fun `contrato - la otra version instalada se ofrece para usarla y no para bajarla de nuevo`() {
        fun names(choices: List<Streaming.Choice>) = choices.map { "${it.action}:${it.pkg}" }
        val tv = prime.tv.first()
        assertEquals(
            listOf("OPEN:$tv", "USE_PHONE:${prime.play}", "UPDATE:$tv"),
            names(Streaming.choices(prime, tvDevice = true) { true })
        )
        assertEquals(
            listOf("OPEN:${prime.play}", "USE_TV:$tv", "UPDATE:${prime.play}"),
            names(Streaming.choices(prime, tvDevice = true, chosen = prime.play) { true })
        )
        // Netflix para TV no se baja en un equipo sin certificar, pero si vino de fábrica se puede volver a ella.
        val ninja = netflix.tv.first()
        assertEquals(
            listOf("OPEN:${netflix.play}", "USE_TV:$ninja", "UPDATE:${netflix.play}"),
            names(Streaming.choices(netflix, tvDevice = true, chosen = netflix.play) { true })
        )
    }

    @Test
    fun `contrato - el celular abre la version que se eligio en el equipo`() {
        val list = Streaming.forPhone({ name -> netflix.play.takeIf { name == "Netflix" } }) { true }
        assertEquals(netflix.play, list.getJSONObject(0).getString("package"))
        assertEquals("com.google.android.youtube.tv", list.getJSONObject(1).getString("package"))
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
    fun `contrato - un servicio se reconoce y se abre tambien por su paquete de otra region`() {
        val paramount = Streaming.ALL.first { it.name == "Paramount+" }
        assertEquals(paramount, Streaming.byPackage("com.cbs.ca"))
        assertEquals(paramount, Streaming.byPackage("com.cbs.ott"))
        assertEquals("com.cbs.ott", Streaming.installed(paramount) { it == "com.cbs.ott" })
        assertEquals("com.cbs.ca", Streaming.installed(paramount) { true })
    }

    // --- Qué se le pide a la tienda ---

    private fun service(name: String) = Streaming.ALL.first { it.name == name }
    private fun Streaming.Service.asked(tv: Boolean) = Streaming.fetchable(this, tv).map { it.pkg }

    @Test
    fun `contrato - en un equipo de TV se pide primero la version de TV, y la de celular queda de alternativa`() {
        assertEquals(listOf("com.amazon.amazonvideo.livingroom", "com.amazon.avod.thirdpartyclient"), service("Prime Video").asked(tv = true))
        assertEquals(listOf("com.spotify.tv.android", "com.spotify.music"), service("Spotify").asked(tv = true))
        assertEquals(listOf(Streaming.Form.TV, Streaming.Form.PHONE), Streaming.fetchable(service("Prime Video"), true).map { it.form })
    }

    @Test
    fun `contrato - en un equipo tactil se pide la version de celular y ninguna otra`() {
        assertEquals(listOf("com.amazon.avod.thirdpartyclient"), service("Prime Video").asked(tv = false))
        assertEquals(listOf("com.netflix.mediaclient"), service("Netflix").asked(tv = false))
    }

    @Test
    fun `contrato - no se ofrece una version de TV que solo anda en equipos certificados`() {
        // Instalada y sin andar, taparía a la de celular que sí anda.
        assertEquals(listOf("com.netflix.mediaclient"), service("Netflix").asked(tv = true))
    }

    @Test
    fun `contrato - un servicio con un solo paquete se pide por ese, en cualquier equipo`() {
        for (tv in listOf(true, false)) {
            assertEquals(listOf("com.disney.disneyplus"), service("Disney+").asked(tv))
            assertEquals(listOf("com.wbd.stream"), service("HBO Max").asked(tv))
        }
        assertEquals(Streaming.Form.ONLY, Streaming.fetchable(service("Disney+"), true).single().form)
    }

    @Test
    fun `contrato - Paramount+ se pide por el paquete que la tienda entrega fuera de Estados Unidos`() {
        assertEquals(listOf("com.cbs.ca"), service("Paramount+").asked(tv = true))
    }

    // --- Qué se ofrece con cada servicio ---

    private fun Streaming.Service.offered(tv: Boolean, vararg installed: String) =
        Streaming.choices(this, tv) { it in installed }.map { it.action to it.pkg }

    @Test
    fun `contrato - un servicio instalado se puede abrir y actualizar`() {
        // Una app de fábrica que pide actualizarse y no deja: se la vuelve a buscar por su mismo paquete.
        assertEquals(
            listOf(Streaming.Action.OPEN to "com.disney.disneyplus", Streaming.Action.UPDATE to "com.disney.disneyplus"),
            service("Disney+").offered(tv = true, "com.disney.disneyplus")
        )
    }

    @Test
    fun `contrato - si la version de TV no anda se ofrece la de celular`() {
        assertEquals(
            listOf(
                Streaming.Action.OPEN to "com.amazon.amazonvideo.livingroom",
                Streaming.Action.UPDATE to "com.amazon.amazonvideo.livingroom",
                Streaming.Action.GET_PHONE to "com.amazon.avod.thirdpartyclient"
            ),
            service("Prime Video").offered(tv = true, "com.amazon.amazonvideo.livingroom")
        )
    }

    @Test
    fun `contrato - con la de celular instalada en un equipo de TV se ofrece la de TV`() {
        assertEquals(
            listOf(
                Streaming.Action.OPEN to "com.amazon.avod.thirdpartyclient",
                Streaming.Action.GET_TV to "com.amazon.amazonvideo.livingroom",
                Streaming.Action.UPDATE to "com.amazon.avod.thirdpartyclient"
            ),
            service("Prime Video").offered(tv = true, "com.amazon.avod.thirdpartyclient")
        )
    }

    @Test
    fun `contrato - un servicio que falta solo se puede buscar`() {
        assertEquals(listOf(Streaming.Action.GET to "tv.pluto.android"), service("Pluto TV").offered(tv = true))
        assertEquals(
            listOf(Streaming.Action.GET_TV to "com.canela.ott.tv", Streaming.Action.GET_PHONE to "com.canela.ott"),
            service("Canela.TV").offered(tv = true)
        )
    }

    @Test
    fun `contrato - con un paquete viejo o de otra region se ofrece el actual`() {
        assertEquals(
            listOf(Streaming.Action.OPEN to "com.hbo.hbonow", Streaming.Action.GET to "com.wbd.stream"),
            service("HBO Max").offered(tv = true, "com.hbo.hbonow")
        )
        assertEquals(
            listOf(Streaming.Action.OPEN to "com.cbs.ott", Streaming.Action.GET to "com.cbs.ca"),
            service("Paramount+").offered(tv = true, "com.cbs.ott")
        )
    }

    // --- La lista de Cine ---

    @Test
    fun `contrato - Cine muestra lo instalado, y lo que falta o se saco queda en mas servicios`() {
        val have = setOf("com.netflix.mediaclient", "com.google.android.youtube.tv", "com.disney.disneyplus")
        val (shown, rest) = Streaming.split(hidden = setOf("Disney+")) { it in have }
        assertEquals(listOf("Netflix", "YouTube"), shown.map { it.name })
        assertTrue(rest.any { it.name == "Disney+" })
        assertTrue(rest.any { it.name == "Pluto TV" })
        assertEquals(Streaming.ALL.size, shown.size + rest.size)
    }

    @Test
    fun `contrato - hay variedad para ver sin pagar, y el celular sabe cual es`() {
        val free = Streaming.ALL.filter { it.free }.map { it.name }
        assertTrue(free.containsAll(listOf("YouTube", "Pluto TV", "Mercado Play", "ViX", "Plex", "Canela.TV")))
        // Lo que se paga no se anuncia como gratis.
        listOf("Netflix", "Prime Video", "Disney+", "HBO Max", "Paramount+").forEach { assertFalse(it, free.contains(it)) }
        val phone = Streaming.forPhone { false }
        val pluto = (0 until phone.length()).map(phone::getJSONObject).first { it.getString("name") == "Pluto TV" }
        assertTrue(pluto.getBoolean("free"))
        assertFalse(phone.getJSONObject(0).getBoolean("free"))
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
        val all = Streaming.ALL.flatMap { it.packages }
        assertEquals(all.size, all.toSet().size)
        assertEquals(Streaming.ALL.size, Streaming.ALL.map { it.name }.toSet().size)
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
