package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.FullControl
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class FullControlTest {

    private val component = "ar.vale.projectorlauncher/ar.vale.projectorlauncher.remote.RemoteAccessibility"

    @Test
    fun `contrato - sin pantalla de Accesibilidad se muestran los dos comandos que activan Control total`() {
        val text = FullControl.adbCommands(component)
        assertTrue(text, text.contains("adb shell settings put secure enabled_accessibility_services $component"))
        assertTrue(text, text.contains("adb shell settings put secure accessibility_enabled 1"))
    }

    @Test
    fun `contrato - pedir ADB para Control total avisa que hay que apagar la depuracion antes de reiniciar`() {
        val strings = File("src/main/res/values/strings.xml").readText()
        val text = Regex("""name="remote_full_adb">([^<]+)<""").find(strings)!!.groupValues[1]
        assertTrue(text, text.contains("Wi-Fi"))
        assertTrue(text, text.contains("antes de reiniciar"))
    }
}
