package ar.vale.projectorlauncher

import java.io.File
import org.junit.Assert.assertTrue
import org.junit.Test

/** Contrato del reproductor: el video se escala a la pantalla. */
class PlayerLayoutTest {


    @Test
    fun `contrato - el VideoView ocupa toda la pantalla para que un video chico se agrande manteniendo la proporcion`() {
        val layout = File("src/main/res/layout/activity_player.xml").readText()
        val video = Regex("""<VideoView[^>]*>""").find(layout)!!.value
        assertTrue(video, Regex("""layout_width="match_parent"""").containsMatchIn(video))
        assertTrue(video, Regex("""layout_height="match_parent"""").containsMatchIn(video))
    }
}
