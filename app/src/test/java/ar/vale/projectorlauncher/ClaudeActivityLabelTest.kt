package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ClaudeSettings
import ar.vale.projectorlauncher.claude.Tools
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** El renglón de estado dice lo que Claude hace de verdad: cada herramienta, su texto. */
class ClaudeActivityLabelTest {

    private fun strings() = File("src/main/res/values/strings.xml").readText()

    private fun text(name: String): String =
        Regex("""name="$name">([^<]+)<""").find(strings())!!.groupValues[1]

    @Test
    fun `contrato - esperar no dice que mira la pantalla`() {
        assertNotEquals(ClaudeSettings.activityRes("ver_pantalla"), ClaudeSettings.activityRes("esperar"))
        assertEquals(R.string.claude_waiting, ClaudeSettings.activityRes("esperar"))
        assertEquals("esperando…", text("claude_waiting"))
    }

    @Test
    fun `contrato - ninguna herramienta de pantalla cae en el texto generico`() {
        for (tool in Tools.SCREEN) {
            assertNotEquals(tool, R.string.claude_acting, ClaudeSettings.activityRes(tool))
        }
    }

    @Test
    fun `contrato - los textos de estado van en minuscula y terminan en puntos suspensivos`() {
        val names = listOf(
            "claude_thinking", "claude_searching", "claude_acting", "claude_looking", "claude_waiting",
            "claude_tapping", "claude_typing", "claude_moving", "claude_opening"
        )
        for (name in names) {
            val value = text(name)
            assertTrue("$name: $value", value.endsWith("…") && value.first().isLowerCase())
        }
    }
}
