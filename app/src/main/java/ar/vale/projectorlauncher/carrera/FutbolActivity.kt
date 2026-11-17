package ar.vale.projectorlauncher.carrera

import ar.vale.projectorlauncher.R

/**
 * El fútbol en la pared, al estilo HaxBall: la misma sala y el mismo puente que la carrera, con
 * otra página. Cada celular es un trackpad con el botón de patear.
 */
class FutbolActivity : CarreraActivity() {
    override val wallPage = "futbol.html"
    override val phonePage = "jugador.html"
    override val offText = R.string.futbol_off
    override val failedText = R.string.carrera_failed
    override val noWebViewText = R.string.futbol_no_webview
}
