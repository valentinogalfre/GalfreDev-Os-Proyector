package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.media.PlayerRules
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
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

    @Test
    fun `contrato - en escena la barra se va sola aunque el video este en pausa, para mostrar el cuadro entero`() {
        assertTrue(PlayerRules.hudAutoHides(media = true, playing = false, staged = true))
        assertTrue(PlayerRules.hudAutoHides(media = true, playing = true, staged = true))
    }

    @Test
    fun `contrato - en escena una tecla no tapa la diapositiva con la barra, y si acompania al video`() {
        assertFalse(PlayerRules.hudOnKey(media = false, staged = true))
        assertTrue(PlayerRules.hudOnKey(media = true, staged = true))
        // Fuera de escena todo sigue como siempre: cada tecla trae la barra.
        assertTrue(PlayerRules.hudOnKey(media = false, staged = false))
        assertTrue(PlayerRules.hudOnKey(media = true, staged = false))
    }

    @Test
    fun `contrato - en escena pasar de pagina dice por cual va, y solo si hay mas de una`() {
        assertTrue(PlayerRules.pageMark(FileKind.PDF, staged = true, pages = 12))
        assertFalse(PlayerRules.pageMark(FileKind.PDF, staged = true, pages = 1))
        assertFalse(PlayerRules.pageMark(FileKind.IMAGE, staged = true, pages = 0))
        // Fuera de escena la página ya está en la barra.
        assertFalse(PlayerRules.pageMark(FileKind.PDF, staged = false, pages = 12))
    }

    @Test
    fun `contrato - el pase automatico necesita mas de una foto`() {
        assertTrue(PlayerRules.slideshow(FileKind.IMAGE, files = 2))
        assertFalse(PlayerRules.slideshow(FileKind.IMAGE, files = 1))
        assertFalse(PlayerRules.slideshow(FileKind.PDF, files = 5))
    }

    @Test
    fun `contrato - un PDF sin paginas no tiene pagina que mostrar, y con paginas nunca se pasa del final`() {
        assertNull(PlayerRules.page(0, 0))
        assertNull(PlayerRules.page(3, -1))
        assertEquals(0, PlayerRules.page(-1, 5))
        assertEquals(2, PlayerRules.page(2, 5))
        assertEquals(4, PlayerRules.page(9, 5))
    }
}
