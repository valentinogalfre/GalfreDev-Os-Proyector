package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.media.PlayerRules
import org.junit.Assert.assertTrue
import org.junit.Test

/** Contrato de la barra del reproductor: al abrir una foto o un PDF aparece. */
class PlayerOpenHudTest {

    @Test
    fun `contrato - al abrir una foto o un PDF la barra aparece igual que al pasar a la siguiente`() {
        assertTrue(PlayerRules.hudOnOpen(FileKind.IMAGE))
        assertTrue(PlayerRules.hudOnOpen(FileKind.PDF))
    }
}
