package ar.vale.projectorlauncher.juntada

import kotlin.math.ceil
import kotlin.math.floor

/**
 * Cuántas filas de una tabla de la pared entran en el alto que hay, y de qué alto. Es lógica pura:
 * la Juntada admite hasta [Juntada.MAX_PEOPLE] personas y una trivia termina con todas en la tabla.
 */
object BoardFit {

    /** [shown] filas de [rowHeight]; si [hidden] > 0 hay una fila más, del mismo alto, que dice cuántas faltan. */
    class Plan(val shown: Int, val hidden: Int, val rowHeight: Float) {
        val slots: Int get() = shown + if (hidden > 0) 1 else 0
    }

    /** Hasta dónde se achica una fila antes de dejar filas afuera: más chica ya no se lee desde el sillón. */
    const val MIN_SCALE = 0.75f

    /**
     * [count] filas que miden [natural] cada una, en [available]. Primero se achican; si ni así entran,
     * se muestran las que entran y la última fila dice cuántas faltan. Nunca queda una fila a medias,
     * ni se deja una sola afuera: un «y 1 más» ocuparía el mismo lugar que esa fila.
     */
    fun plan(count: Int, available: Float, natural: Float): Plan {
        if (count <= 0 || natural <= 0f) return Plan(0, 0, natural)
        if (count * natural <= available) return Plan(count, 0, natural)
        // Las filas miden píxeles enteros: redondear hacia el lado que no se pasa del alto.
        val min = ceil(natural * MIN_SCALE)
        if (count * min <= available) return Plan(count, 0, floor(available / count))
        val slots = (available / min).toInt()
        val shown = (slots - 1).coerceIn(0, count - 1)
        return Plan(shown, count - shown, min)
    }

    /** Las filas a dibujar: las que entran y, si faltan, la que lo dice. */
    fun <T> rows(items: List<T>, plan: Plan, more: (Int) -> T): List<T> =
        items.take(plan.shown) + (if (plan.hidden > 0) listOf(more(plan.hidden)) else emptyList())
}
