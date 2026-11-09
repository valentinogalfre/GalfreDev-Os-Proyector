package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.device.Functions
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class FunctionsTest {

    @Test
    fun `contrato - las entradas, la pantalla inalambrica y el inicio del Chowa P8 se buscan por su paquete`() {
        assertTrue("com.mediatek.wwtv.tvcenter" in Functions.KnownApps.BY_KIND.getValue(Functions.Kind.HDMI))
        assertTrue("com.ionitech.airscreen" in Functions.KnownApps.BY_KIND.getValue(Functions.Kind.MIRROR))
        assertTrue("com.zeasn.whale.open.launcher.technical" in Functions.KnownApps.BY_KIND.getValue(Functions.Kind.VENDOR_HOME))
    }

    @Test
    fun `contrato - los inicios de los otros equipos siguen en la lista`() {
        val homes = Functions.KnownApps.BY_KIND.getValue(Functions.Kind.VENDOR_HOME)
        assertEquals(listOf("com.htc.spectraos", "com.jm.jmlauncher"), homes.take(2))
    }

    @Test
    fun `contrato - la fila de opciones de desarrollador avisa que reiniciar con depuracion deja sin Wi-Fi`() {
        val strings = File("src/main/res/values/strings.xml").readText()
        val warning = Regex("""name="set_sys_dev_sub">([^<]+)<""").find(strings)!!.groupValues[1]
        assertTrue(warning, warning.contains("Wi-Fi"))
        assertTrue(warning, warning.contains("reiniciar"))
    }

    @Test
    fun `contrato - pedir ADB para el inicio avisa que hay que apagar la depuracion antes de reiniciar`() {
        val strings = File("src/main/res/values/strings.xml").readText()
        val text = Regex("""name="set_home_adb">([^<]+)<""").find(strings)!!.groupValues[1]
        assertTrue(text, text.contains("Wi-Fi"))
        assertTrue(text, text.contains("antes de reiniciar"))
    }

    @Test
    fun `contrato - la guia nombra el peligro de la depuracion antes de pedir activarla`() {
        val guide = File("../docs/instalar.md").readText()
        val warning = guide.indexOf("No reinicies con Depuración USB activada")
        val firstStep = guide.indexOf("activá Depuración USB")
        assertTrue("falta el aviso", warning >= 0)
        assertTrue("falta el paso", firstStep >= 0)
        assertTrue("el aviso tiene que ir antes", warning < firstStep)
    }

    @Test
    fun `contrato - la guia apaga la depuracion antes del unico reinicio con ADB`() {
        val guide = File("../docs/instalar.md").readText()
        val off = guide.indexOf("settings put global adb_enabled 0")
        val reboot = guide.indexOf("Recién ahora apagá y prendé")
        assertTrue("falta apagarla", off >= 0)
        assertTrue("falta el reinicio", reboot >= 0)
        assertTrue("primero se apaga", off < reboot)
    }
}
