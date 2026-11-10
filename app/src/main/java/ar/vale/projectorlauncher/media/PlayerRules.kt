package ar.vale.projectorlauncher.media

/** Reglas de la barra del reproductor, sin vistas. */
object PlayerRules {

    /** En pausa la barra queda a la vista: esconderla dejaría a quien pausó sin saber dónde está. */
    fun hudAutoHides(media: Boolean, playing: Boolean): Boolean = !media || playing
}
