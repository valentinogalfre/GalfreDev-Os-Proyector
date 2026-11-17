package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.media.PlayerRules
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** Contrato de la barra del reproductor: al abrir una foto o un PDF aparece. */
class PlayerOpenHudTest {

    @Test
    fun `contrato - al abrir una foto o un PDF la barra aparece igual que al pasar a la siguiente`() {
        assertTrue(PlayerRules.hudOnOpen(FileKind.IMAGE))
        assertTrue(PlayerRules.hudOnOpen(FileKind.PDF))
    }

    @Test
    fun `contrato - en escena la presentacion abre limpia, sin la barra encima`() {
        assertFalse(PlayerRules.hudOnOpen(FileKind.IMAGE, staged = true))
        assertFalse(PlayerRules.hudOnOpen(FileKind.PDF, staged = true))
        assertFalse(PlayerRules.hudOnStart(staged = true))
        // Un video cualquiera sí avisa cuánto dura al arrancar.
        assertTrue(PlayerRules.hudOnStart(staged = false))
    }
}
