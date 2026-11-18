package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.store.Release
import ar.vale.projectorlauncher.store.ResolveException
import ar.vale.projectorlauncher.store.Resolver
import ar.vale.projectorlauncher.update.UpdatePlan
import ar.vale.projectorlauncher.update.UpdatePlan.Action
import ar.vale.projectorlauncher.update.UpdatePlan.Phase
import ar.vale.projectorlauncher.update.UpdatePlan.Status
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class UpdateTest {

    private val abis = listOf("armeabi-v7a", "armeabi")
    private val source = UpdatePlan.source("valentinogalfre/galfredev-OS")

    private fun release(version: String) = Release(version, "https://g/$version.apk", "abc", 3_000_000)

    private val published = """{"tag_name":"v1.4.0","assets":[
        {"name":"galfredev-os-1.4.0.apk","browser_download_url":"https://g/os.apk","digest":"sha256:abc","size":3000000},
        {"name":"capturas.zip","browser_download_url":"https://g/c.zip","size":10}
    ]}"""

    @Test
    fun `contrato - si hay una version publicada mas nueva se ofrece actualizar`() {
        val plan = UpdatePlan.plan(online = true, installed = "1.3.0", phase = Phase.DONE, latest = release("1.4.0"))
        assertEquals(Status.AVAILABLE, plan.status)
        assertEquals(listOf(Action.UPDATE), plan.actions)
    }

    @Test
    fun `contrato - nunca se ofrece bajar de version ni reinstalar la misma`() {
        assertEquals(Status.UP_TO_DATE, UpdatePlan.plan(true, "1.4.0", Phase.DONE, release("1.4.0")).status)
        assertEquals(Status.UP_TO_DATE, UpdatePlan.plan(true, "1.10.0", Phase.DONE, release("1.9.0")).status)
        assertFalse(Action.UPDATE in UpdatePlan.plan(true, "2.0.0", Phase.DONE, release("1.9.9")).actions)
    }

    @Test
    fun `contrato - la version se compara por numeros y no como texto`() {
        assertTrue(UpdatePlan.isNewer("1.10.0", "1.9.0"))
        assertFalse(UpdatePlan.isNewer(null, "1.0.0"))
    }

    @Test
    fun `contrato - sin internet se ofrece abrir el wifi antes que nada`() {
        val plan = UpdatePlan.plan(online = false, installed = "1.3.0", phase = Phase.DONE, latest = release("1.4.0"))
        assertEquals(Status.OFFLINE, plan.status)
        assertEquals(Action.WIFI, plan.actions.first())
        assertFalse(Action.UPDATE in plan.actions)
    }

    @Test
    fun `contrato - si GitHub no responde se puede reintentar y no se ofrece instalar`() {
        val plan = UpdatePlan.plan(true, "1.3.0", Phase.FAILED, null)
        assertEquals(Status.FAILED, plan.status)
        assertEquals(listOf(Action.RETRY), plan.actions)
    }

    @Test
    fun `contrato - la consulta automatica es como mucho cada seis horas y nunca sin red`() {
        val hour = 60L * 60 * 1000
        val now = 100 * hour
        assertTrue(UpdatePlan.shouldAutoCheck(now, lastCheck = 0, online = true))
        assertFalse(UpdatePlan.shouldAutoCheck(now, now - 5 * hour, online = true))
        assertTrue(UpdatePlan.shouldAutoCheck(now, now - 6 * hour, online = true))
        assertFalse(UpdatePlan.shouldAutoCheck(now, lastCheck = 0, online = false))
    }

    @Test
    fun `contrato - si el reloj del proyector volvio atras igual consulta`() {
        // Sin pila, estos equipos arrancan en 1970 hasta que sincronizan la hora.
        assertTrue(UpdatePlan.shouldAutoCheck(now = 1_000, lastCheck = 1_000_000_000, online = true))
    }

    @Test
    fun `contrato - de la release se toma el APK del launcher con su hash, no otro archivo`() {
        val r = Resolver.fromGitHub(published, source, abis)
        assertEquals("1.4.0", r.version)
        assertEquals("https://g/os.apk", r.url)
        assertEquals("abc", r.sha256)
    }

    @Test
    fun `contrato - un APK de otra version en la release no se toma como el bueno`() {
        val wrong = """{"tag_name":"v1.4.0","assets":[
            {"name":"galfredev-os-1.3.0.apk","browser_download_url":"https://g/viejo.apk","size":10}
        ]}"""
        assertThrows(ResolveException::class.java) { Resolver.fromGitHub(wrong, source, abis) }
    }

    @Test
    fun `contrato - el workflow publica el APK con el nombre que busca el actualizador`() {
        val workflow = File("../.github/workflows/release.yml").readText()
        assertTrue(workflow.contains("apk=\"galfredev-os-\${{ steps.version.outputs.version }}.apk\""))
        assertEquals("^galfredev-os-{version}\\.apk$", UpdatePlan.ASSET)
    }

    @Test
    fun `contrato - las actualizaciones salen del repo publico del proyecto`() {
        val strings = File("src/main/res/values/strings.xml").readText()
        assertTrue(strings.contains("""<string name="update_repo" translatable="false">valentinogalfre/galfredev-OS</string>"""))
    }
}
