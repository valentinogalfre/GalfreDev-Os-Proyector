package ar.vale.projectorlauncher.media

import ar.vale.projectorlauncher.FileKind

/** Reglas de la barra del reproductor, sin vistas. */
object PlayerRules {

    /**
     * En pausa la barra queda a la vista: esconderla dejaría a quien pausó sin saber dónde está.
     * En escena se esconde siempre: quien presenta pausa para mostrar ese cuadro, entero.
     */
    fun hudAutoHides(media: Boolean, playing: Boolean, staged: Boolean = false): Boolean = staged || !media || playing

    /**
     * Al abrir una foto o un PDF la barra aparece, como cuando se pasa a la siguiente. En escena
     * no: lo primero que ve la sala es la presentación.
     */
    fun hudOnOpen(kind: FileKind, staged: Boolean = false): Boolean =
        !staged && (kind == FileKind.IMAGE || kind == FileKind.PDF)

    /** Cuando un video arranca, la barra dice cuánto dura. En escena arranca limpio. */
    fun hudOnStart(staged: Boolean): Boolean = !staged

    /**
     * Con cada tecla la barra vuelve. En escena solo acompaña al video, que necesita decir por
     * dónde va: una diapositiva no se tapa.
     */
    fun hudOnKey(media: Boolean, staged: Boolean): Boolean = media || !staged

    /** En escena, pasar de página deja ver por un momento por cuál va, chico y en una esquina. */
    fun pageMark(kind: FileKind, staged: Boolean, pages: Int): Boolean = staged && kind == FileKind.PDF && pages > 1

    /** El pase automático necesita más de una foto: con una sola, la repite. */
    fun slideshow(kind: FileKind, files: Int): Boolean = kind == FileKind.IMAGE && files > 1

    /** La página que se muestra cuando piden la [number]: nunca pasa del final. Un PDF sin páginas no tiene ninguna. */
    fun page(number: Int, count: Int): Int? = if (count <= 0) null else number.coerceIn(0, count - 1)
}
