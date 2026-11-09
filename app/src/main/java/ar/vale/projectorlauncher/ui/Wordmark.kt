package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.Path

/** El wordmark del kit, letra por letra (lo genera scripts/brand/build_logo.py). */
class Wordmark private constructor(
    val width: Float,
    val height: Float,
    val letters: List<Letter>
) {
    class Letter(val name: Char, val left: Float, val right: Float, val path: Path)

    /** La g es la primera letra: es la que se construye en el arranque. */
    val g: Letter get() = letters.first()

    companion object {
        /** Medidas de construcción de la g, en unidades del dibujo (manual de marca, pág. 08). */
        const val X_HEIGHT_Y = 208.26f
        const val BASELINE_Y = 734.26f
        const val FOOT_Y = 812.26f
        const val DESCENDER_Y = 931.26f
        const val STEM_LEFT_X = 369f
        const val STEM_RIGHT_X = 533f
        const val G_TOP_Y = 195.17f
        const val G_WIDTH = 533f

        fun load(context: Context): Wordmark {
            val lines = context.assets.open("brand/wordmark.txt").bufferedReader().use { it.readLines() }
            val head = lines.first().split('\t')
            val letters = lines.drop(1).filter { it.isNotBlank() }.map { line ->
                val p = line.split('\t')
                Letter(p[0][0], p[1].toFloat(), p[2].toFloat(), SvgPath.toPath(SvgPath.parse(p[3])))
            }
            return Wordmark(head[1].toFloat(), head[2].toFloat(), letters)
        }
    }
}
