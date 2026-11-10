package ar.vale.projectorlauncher.media

import ar.vale.projectorlauncher.FileKind

/** Reglas de la barra del reproductor, sin vistas. */
object PlayerRules {

    /** En pausa la barra queda a la vista: esconderla dejaría a quien pausó sin saber dónde está. */
    fun hudAutoHides(media: Boolean, playing: Boolean): Boolean = !media || playing

    /** Al abrir una foto o un PDF la barra aparece, como cuando se pasa a la siguiente. */
    fun hudOnOpen(kind: FileKind): Boolean = kind == FileKind.IMAGE || kind == FileKind.PDF
}
