package ar.vale.projectorlauncher.remote

import kotlin.math.abs
import kotlin.math.max

/**
 * A qué elemento va el foco con una flecha, mirando solo dónde están. Hace falta antes de
 * Android 13, en las apps hechas con Compose: ahí el sistema no sabe buscar el siguiente.
 */
object FocusGeometry {

    data class Box(val left: Int, val top: Int, val right: Int, val bottom: Int) {
        val centerX get() = (left + right) / 2
        val centerY get() = (top + bottom) / 2
    }

    enum class Way { UP, DOWN, LEFT, RIGHT }

    /** El índice del mejor candidato, o -1 si no hay nada en esa dirección. */
    fun next(from: Box, way: Way, candidates: List<Box>): Int {
        var best = -1
        var bestScore = Long.MAX_VALUE
        candidates.forEachIndexed { index, box ->
            if (!isAhead(from, box, way)) return@forEachIndexed
            val score = score(from, box, way)
            if (score < bestScore) {
                bestScore = score
                best = index
            }
        }
        return best
    }

    private fun isAhead(from: Box, box: Box, way: Way): Boolean = when (way) {
        Way.RIGHT -> box.centerX > from.centerX && box.left >= from.centerX
        Way.LEFT -> box.centerX < from.centerX && box.right <= from.centerX
        Way.DOWN -> box.centerY > from.centerY && box.top >= from.centerY
        Way.UP -> box.centerY < from.centerY && box.bottom <= from.centerY
    }

    /** Lo que está en la misma fila o columna gana siempre; después, lo más cercano. */
    private fun score(from: Box, box: Box, way: Way): Long {
        val horizontal = way == Way.LEFT || way == Way.RIGHT
        val aligned = if (horizontal) box.top < from.bottom && box.bottom > from.top else box.left < from.right && box.right > from.left
        val major = when (way) {
            Way.RIGHT -> box.left - from.right
            Way.LEFT -> from.left - box.right
            Way.DOWN -> box.top - from.bottom
            Way.UP -> from.top - box.bottom
        }.let { max(it, 0).toLong() }
        val minor = (if (horizontal) abs(box.centerY - from.centerY) else abs(box.centerX - from.centerX)).toLong()
        val distance = major * major * MAJOR_WEIGHT + minor * minor
        return if (aligned) distance else distance + OUT_OF_LINE
    }

    private const val MAJOR_WEIGHT = 13L
    private const val OUT_OF_LINE = 1L shl 40
}
