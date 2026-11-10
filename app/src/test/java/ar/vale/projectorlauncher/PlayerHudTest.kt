package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.media.PlayerRules
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** Contrato de la barra del reproductor: en pausa no se esconde. */
class PlayerHudTest {


    @Test
    fun `contrato - la barra no se esconde sola mientras el video esta en pausa`() {
        assertFalse(PlayerRules.hudAutoHides(media = true, playing = false))
        assertTrue(PlayerRules.hudAutoHides(media = true, playing = true))
    }

    @Test
    fun `contrato - fotos y PDF esconden la barra solos aunque no haya reproduccion`() {
        assertTrue(PlayerRules.hudAutoHides(media = false, playing = false))
    }
}
