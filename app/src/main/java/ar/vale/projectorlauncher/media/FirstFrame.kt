package ar.vale.projectorlauncher.media

/**
 * Espera del primer cuadro de un video. Al retomar, la búsqueda exacta decodifica desde el cuadro
 * clave anterior y durante ese rato el video está en negro: mientras tanto no se muestran
 * subtítulos y el reproductor puede pedir que la cinta siga tapando.
 */
class FirstFrame {
    var waiting = true
        private set

    fun arrived() { waiting = false }
    fun failed() { waiting = false }
    fun gaveUp() { waiting = false }

    fun cue(cues: List<Srt.Cue>, positionMs: Long): Srt.Cue? = if (waiting) null else Srt.at(cues, positionMs)
}
