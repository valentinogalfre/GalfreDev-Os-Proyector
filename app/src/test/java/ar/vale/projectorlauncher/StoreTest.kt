package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.store.Abi
import ar.vale.projectorlauncher.store.Catalog
import ar.vale.projectorlauncher.store.DetailPlan
import ar.vale.projectorlauncher.store.Fetch
import ar.vale.projectorlauncher.store.Recommendations
import ar.vale.projectorlauncher.store.Release
import ar.vale.projectorlauncher.store.ResolveException
import ar.vale.projectorlauncher.store.Resolver
import ar.vale.projectorlauncher.store.Source
import ar.vale.projectorlauncher.store.Versions
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class StoreTest {

    private val catalog = Catalog.parse(File("src/main/assets/catalog.json").readText())

    private val github = """{"tag_name":"v1.18.2","assets":[
        {"name":"LocalSend-1.18.2-android-arm32v7.apk","browser_download_url":"https://g/32.apk","digest":"sha256:abc","size":10},
        {"name":"LocalSend-1.18.2-android-arm64v8.apk","browser_download_url":"https://g/64.apk","digest":"sha256:def","size":11},
        {"name":"LocalSend-1.18.1-android-arm32v7.apk","browser_download_url":"https://g/old.apk","size":10}
    ]}"""

    private val source = Source.GitHub(
        "a/b",
        mapOf("armeabi-v7a" to "^LocalSend-{version}-android-arm32v7\\.apk$", "arm64-v8a" to "^LocalSend-{version}-android-arm64v8\\.apk$"),
        null
    )

    @Test
    fun `contrato - un chip de 64 bits con sistema de 32 recibe la version de 32`() {
        val r = Resolver.fromGitHub(github, source, listOf("armeabi-v7a", "armeabi"))
        assertEquals("https://g/32.apk", r.url)
        assertEquals("1.18.2", r.version)
    }

    @Test
    fun `contrato - un sistema de 64 bits prefiere la version de 64`() {
        val r = Resolver.fromGitHub(github, source, listOf("arm64-v8a", "armeabi-v7a"))
        assertEquals("https://g/64.apk", r.url)
    }

    @Test
    fun `contrato - la huella de GitHub se guarda para comprobar la descarga`() {
        assertEquals("abc", Resolver.fromGitHub(github, source, listOf("armeabi-v7a")).sha256)
    }

    @Test
    fun `contrato - si hay dos archivos posibles no se adivina`() {
        val loose = Source.GitHub("a/b", emptyMap(), "android-arm")
        assertThrows(ResolveException::class.java) { Resolver.fromGitHub(github, loose, listOf("armeabi-v7a")) }
    }

    @Test
    fun `contrato - sin variante para el equipo no se ofrece otra`() {
        assertThrows(ResolveException::class.java) { Resolver.fromGitHub(github, source, listOf("x86")) }
    }

    @Test
    fun `contrato - en un listado gana la version mas alta, no la ultima escrita`() {
        val listing = Source.Listing("https://k/", emptyMap(), mapOf("armeabi-v7a" to "kodi-([0-9.]+)-[A-Za-z]+-armeabi-v7a\\.apk"), null, false, null)
        val html = """<a href="kodi-21.3-Omega-armeabi-v7a.apk">x</a><a href="kodi-9.9-Old-armeabi-v7a.apk">y</a>"""
        val r = Resolver.fromListing(html, "https://k/", listing, listOf("armeabi-v7a"))
        assertEquals("21.3", r.version)
        assertEquals("https://k/kodi-21.3-Omega-armeabi-v7a.apk", r.url)
    }

    @Test
    fun `contrato - un release candidate no coincide con el patron de Kodi`() {
        val kodi = catalog.apps.first { it.id == "kodi" }.source as Source.Listing
        val html = """<a href="kodi-22.0-Piers_rc1-armeabi-v7a.apk">x</a><a href="kodi-21.3-Omega-armeabi-v7a.apk">y</a>"""
        val r = Resolver.fromListing(html, kodi.url, kodi, listOf("armeabi-v7a"))
        assertEquals("21.3", r.version)
    }

    @Test
    fun `contrato - si la pagina cambio se avisa en vez de bajar cualquier cosa`() {
        val listing = Source.Listing("https://k/", emptyMap(), emptyMap(), "x-([0-9.]+)\\.apk", false, null)
        assertThrows(ResolveException::class.java) { Resolver.fromListing("<html>", "https://k/", listing, listOf("armeabi-v7a")) }
    }

    @Test
    fun `contrato - el hash publicado por el proyecto acompana a la descarga`() {
        val vlc = catalog.apps.first { it.id == "vlc" }
        val hash = "a".repeat(64)
        val fetch = Fetch { url ->
            if (url.endsWith(".sha256")) "$hash  VLC-Android-3.7.1-armeabi-v7a.apk"
            else """<a href="VLC-Android-3.7.1-armeabi-v7a.apk">"""
        }
        assertEquals(hash, Resolver.resolve(vlc, listOf("armeabi-v7a"), fetch).sha256)
    }

    @Test
    fun `contrato - si el hash publicado no se pudo leer, la descarga no sigue sin comprobar`() {
        val vlc = catalog.apps.first { it.id == "vlc" }
        val fetch = Fetch { url ->
            if (url.endsWith(".sha256")) throw java.io.IOException("404")
            """<a href="VLC-Android-3.7.1-armeabi-v7a.apk">"""
        }
        assertThrows(ResolveException::class.java) { Resolver.resolve(vlc, listOf("armeabi-v7a"), fetch) }
    }

    @Test
    fun `contrato - un archivo de hash sin hash tampoco deja seguir`() {
        val vlc = catalog.apps.first { it.id == "vlc" }
        val fetch = Fetch { url ->
            if (url.endsWith(".sha256")) "<html>no encontrado</html>"
            else """<a href="VLC-Android-3.7.1-armeabi-v7a.apk">"""
        }
        assertThrows(ResolveException::class.java) { Resolver.resolve(vlc, listOf("armeabi-v7a"), fetch) }
    }

    @Test
    fun `contrato - sin digest publicado no se inventa un hash`() {
        // En Android, optString de un null de JSON devuelve la palabra "null".
        val json = github.replace("\"digest\":\"sha256:abc\"", "\"digest\":\"null\"")
        assertEquals(null, Resolver.fromGitHub(json, source, listOf("armeabi-v7a")).sha256)
    }

    @Test
    fun `contrato - un digest de otro algoritmo no pasa por SHA-256`() {
        val json = github.replace("\"digest\":\"sha256:abc\"", "\"digest\":\"sha512:abc\"")
        assertEquals(null, Resolver.fromGitHub(json, source, listOf("armeabi-v7a")).sha256)
    }

    @Test
    fun `contrato - quien ofrece desinstalar tiene el permiso que el sistema exige`() {
        // Sin este permiso, desde Android 9 el instalador se cierra solo y sin avisar nada.
        val manifest = File("src/main/AndroidManifest.xml").readText()
        assertTrue(manifest.contains("android.permission.REQUEST_DELETE_PACKAGES"))
    }

    @Test
    fun `contrato - comparar versiones entiende los formatos reales`() {
        assertTrue(Versions.isNewer("v1.18.2", "1.18.1"))
        assertTrue(Versions.isNewer("0.19.10", "0.19.9"))
        assertTrue(Versions.isNewer("32.70s", "32.7"))
        assertFalse(Versions.isNewer("1.2", "1.2.0"))
        assertFalse(Versions.isNewer("1.2-beta3", "1.2"))
        assertFalse(Versions.isNewer("sin numeros", "1.0"))
    }

    @Test
    fun `contrato - elegir ABI respeta el orden del sistema y cae en la universal`() {
        val by = mapOf("arm64-v8a" to "64", "armeabi-v7a" to "32")
        assertEquals("32", Abi.pick(listOf("armeabi-v7a", "armeabi"), by, "u"))
        assertEquals("u", Abi.pick(listOf("x86"), by, "u"))
        assertNull(Abi.pick(listOf("x86"), by, null))
    }

    @Test
    fun `contrato - se recomienda la version de TV de lo que hay instalado`() {
        val up = Recommendations.upgrades(catalog, setOf("com.google.android.youtube"))
        assertEquals(listOf("smarttube"), up.map { it.app.id })
        assertEquals("com.google.android.youtube", up.single().instead)
    }

    @Test
    fun `contrato - lo que ya esta instalado no se recomienda otra vez`() {
        val installed = setOf("com.google.android.youtube", "org.smarttube.stable")
        assertTrue(Recommendations.upgrades(catalog, installed).isEmpty())
    }

    @Test
    fun `contrato - los paquetes viejos de SmartTube se detectan por seguridad`() {
        val legacy = Recommendations.legacy(catalog, setOf("com.liskovsoft.smarttubetv.beta"))
        assertEquals("smarttube", legacy.single().app.id)
    }

    // --- El catálogo en sí ---

    @Test
    fun `contrato - ids y paquetes del catalogo son unicos`() {
        assertEquals(catalog.apps.size, catalog.apps.map { it.id }.toSet().size)
        assertEquals(catalog.apps.size, catalog.apps.map { it.packageName }.toSet().size)
    }

    @Test
    fun `contrato - toda app tiene una categoria que existe`() {
        val ids = catalog.categories.map { it.id }.toSet()
        catalog.apps.forEach { assertTrue(it.id, it.category in ids) }
    }

    @Test
    fun `contrato - toda fuente es oficial y cifrada`() {
        catalog.apps.forEach { app ->
            when (val s = app.source) {
                is Source.Fixed -> assertTrue(app.id, s.url.startsWith("https://"))
                is Source.Listing -> assertTrue(app.id, s.url.startsWith("https://"))
                is Source.GitHub -> assertTrue(app.id, s.repo.contains('/'))
            }
        }
    }

    @Test
    fun `contrato - toda app corre en los equipos de 32 bits`() {
        catalog.apps.forEach { app ->
            val ok = when (val s = app.source) {
                is Source.Fixed -> true
                is Source.GitHub -> s.universal != null || "armeabi-v7a" in s.assets
                is Source.Listing -> s.universal != null || "armeabi-v7a" in s.assets
            }
            assertTrue(app.id, ok)
        }
    }

    @Test
    fun `contrato - las firmas fijadas son huellas SHA-256 validas`() {
        catalog.apps.flatMap { it.signers }.forEach { assertTrue(it, Regex("[0-9a-f]{64}").matches(it)) }
    }

    @Test
    fun `contrato - SmartTube siempre va con la firma fijada por el incidente de malware`() {
        assertTrue(catalog.apps.first { it.id == "smarttube" }.signers.isNotEmpty())
    }

    @Test
    fun `contrato - los textos respetan el glosario de la marca`() {
        val banned = Regex("plataforma|solución integral|ecosistema|potenciado por IA|a la brevedad|usted", RegexOption.IGNORE_CASE)
        val texts = catalog.apps.flatMap { listOfNotNull(it.summary, it.details, it.caveat) } + catalog.notOffered.map { it.reason }
        texts.forEach { assertFalse(it, banned.containsMatchIn(it)) }
    }

    private val release = Release("2.0", "https://g/a.apk", null, null)

    @Test
    fun `contrato - mientras consulta la ficha lo dice y no ofrece reintentar`() {
        val p = DetailPlan.plan(30, 21, null, DetailPlan.Phase.CHECKING, null)
        assertEquals(DetailPlan.Status.CHECKING, p.status)
        assertFalse(DetailPlan.Action.RETRY in p.actions)
        assertTrue(p.actions.isEmpty())
    }

    @Test
    fun `contrato - consultando, una app instalada conserva Abrir y Desinstalar`() {
        val p = DetailPlan.plan(30, 21, "1.0", DetailPlan.Phase.CHECKING, null)
        assertEquals(DetailPlan.Status.CHECKING, p.status)
        assertEquals(listOf(DetailPlan.Action.OPEN, DetailPlan.Action.UNINSTALL), p.actions)
    }

    @Test
    fun `contrato - el error y Reintentar salen solo si la consulta fallo`() {
        val p = DetailPlan.plan(30, 21, null, DetailPlan.Phase.FAILED, null)
        assertEquals(DetailPlan.Status.NO_NETWORK, p.status)
        assertEquals(listOf(DetailPlan.Action.RETRY), p.actions)
    }

    @Test
    fun `contrato - con la version consultada se ofrece instalar o actualizar`() {
        assertEquals(listOf(DetailPlan.Action.INSTALL), DetailPlan.plan(30, 21, null, DetailPlan.Phase.DONE, release).actions)
        val up = DetailPlan.plan(30, 21, "1.0", DetailPlan.Phase.DONE, release)
        assertEquals(DetailPlan.Status.VERSIONS, up.status)
        assertEquals(listOf(DetailPlan.Action.OPEN, DetailPlan.Action.UPDATE, DetailPlan.Action.UNINSTALL), up.actions)
    }

    @Test
    fun `contrato - un Android viejo lo dice aunque siga consultando`() {
        assertEquals(DetailPlan.Status.NEEDS_ANDROID, DetailPlan.plan(20, 21, null, DetailPlan.Phase.CHECKING, null).status)
    }

    @Test
    fun `contrato - lo que no se puede instalar lo dice, y Claude esta en la lista`() {
        assertTrue(catalog.notOffered.any { it.name == "Netflix" })
        assertTrue(catalog.notOffered.any { it.name == "Claude" })
    }
}
