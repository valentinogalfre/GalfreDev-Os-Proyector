package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.device.Casting
import ar.vale.projectorlauncher.device.DeviceHints
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Transmitir desde el celular. La promesa es abrir la app que de verdad recibe la pantalla: una
 * que no lo hace, ofrecida como receptor, deja a alguien esperando frente a la pared.
 */
class CastingTest {

    @Test
    fun `contrato - se reconocen los receptores que traen estos equipos y los de la Tienda`() {
        val receivers = listOf(
            "com.ionitech.airscreen" to "AirScreen",
            "com.weenas.castbay" to "CastBay",
            "com.softwinner.miracastReceiver" to "Miracast",
            "com.ecloud.eshare.server" to "EShareServer",
            "com.hpplay.happyplay.aw" to "HappyCast",
            "com.waxrain.airplaydmr" to "AirPin(PRO)",
            "com.mediatek.wfd.sink" to "Wireless Display",
            "com.vendor.display" to "WiFi Display",
            "com.vendor.share" to "Screen Mirroring",
            "com.vendor.tvcast" to "TV Cast",
            "com.vendor.dlna.dmr" to "Media Renderer",
            "com.vendor.receiver" to "Duplicar pantalla"
        )
        for ((pkg, label) in receivers) assertTrue("$pkg · $label", DeviceHints.casts(pkg, label))
    }

    @Test
    fun `contrato - una app que solo se parece en el nombre no se ofrece como receptor`() {
        val others = listOf(
            "com.google.android.apps.podcasts" to "Google Podcasts",
            "au.com.shiftyjelly.pocketcasts" to "Pocket Casts",
            "com.vendor.broadcast" to "Broadcast",
            "com.weather.forecast" to "Weather Forecast",
            "com.vendor.fileshare" to "File Share",
            "com.netflix.mediaclient" to "Netflix",
            "com.google.android.youtube.tv" to "YouTube",
            // Las del sistema y la nuestra coinciden con alguna palabra y no reciben nada.
            "com.google.android.gms" to "Google Cast",
            "com.android.providers.media" to "Media Mirror",
            "com.android.cast" to "Cast",
            "ar.vale.projectorlauncher" to "galfredev OS mirror"
        )
        for ((pkg, label) in others) assertFalse("$pkg · $label", DeviceHints.casts(pkg, label))
    }

    @Test
    fun `contrato - primero se ofrece el receptor de fabrica, y cada uno una sola vez`() {
        val apps = listOf(
            "CastBay" to "com.weenas.castbay",
            "Netflix" to "com.netflix.mediaclient",
            "AirScreen" to "com.ionitech.airscreen"
        )
        assertEquals(listOf("com.ionitech.airscreen", "com.weenas.castbay"), Casting.order("com.ionitech.airscreen", apps))
        assertEquals(listOf("com.weenas.castbay", "com.ionitech.airscreen"), Casting.order(null, apps))
    }

    @Test
    fun `contrato - el receptor de fabrica se ofrece aunque no figure entre las apps`() {
        // En algunos firmwares es una pantalla suelta del sistema, sin ícono.
        assertEquals(listOf("com.softwinner.miracastReceiver"), Casting.order("com.softwinner.miracastReceiver", emptyList()))
        assertTrue(Casting.order(null, listOf("Netflix" to "com.netflix.mediaclient")).isEmpty())
    }
}
