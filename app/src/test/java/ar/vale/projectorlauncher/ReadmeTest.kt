package ar.vale.projectorlauncher

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** El README no promete más de lo que hay: ni tests que no existen, ni pruebas en el proyector que no se hicieron. */
class ReadmeTest {

    private val readme get() = File("../README.md").readText()

    /** Cada `@Test` de `app/src/test/java`, que es lo que JUnit corre (también lo que sale salteado). */
    private fun testCount(): Int = File("src/test/java").walkTopDown()
        .filter { it.isFile && it.extension == "kt" }
        .sumOf { file -> file.readLines().count { marker.containsMatchIn(it) } }

    private val marker = Regex("""^\s*@Test\b""")

    @Test
    fun `contrato - el numero de tests del README es el de los tests que hay`() {
        val said = Regex("""(\d+) tests de contrato""").find(readme)?.groupValues?.get(1)?.toInt()
        assertTrue("el README tiene que decir cuántos tests de contrato hay", said != null)
        assertEquals("el README dice $said y hay ${testCount()}: actualizar la línea de testDebugUnitTest", testCount(), said)
    }

    /**
     * Desde noviembre de 2026 corre en un Fika P8, así que ya no puede decir que nada se probó en
     * un equipo. Lo que no puede faltar es el aviso de que no todo se vio ahí, y dónde está la lista.
     */
    @Test
    fun `contrato - el README avisa que no todo se vio en el proyector y dice donde esta lo que falta`() {
        assertTrue(readme, readme.contains("No todo se vio todavía en el equipo"))
        assertTrue(readme, readme.contains("ROADMAP.md"))
    }
}
