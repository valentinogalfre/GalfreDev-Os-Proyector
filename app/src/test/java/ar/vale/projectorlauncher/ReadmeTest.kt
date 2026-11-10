package ar.vale.projectorlauncher

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** El README no promete más de lo que hay: ni tests que no existen, ni pruebas en un proyector que no se hicieron. */
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

    @Test
    fun `contrato - el README dice que todavia no se probo en un proyector real`() {
        assertTrue(readme, readme.contains("Nada de esto se probó todavía en un proyector real"))
    }
}
