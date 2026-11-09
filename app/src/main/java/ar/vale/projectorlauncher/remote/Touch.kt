package ar.vale.projectorlauncher.remote

import kotlin.math.abs

/**
 * Cómo cae un toque del celular en la pantalla.
 *
 * Android cancela los gestos si el equipo no tiene pantalla táctil, y un proyector no tiene. Sin
 * eso queda hacer lo que hace un lector de pantalla: buscar la vista que está en ese punto y
 * pedirle la acción. Esta parte no conoce Android, para poder probarla.
 */
object Touch {

    enum class Axis { VERTICAL, HORIZONTAL }

    interface Node {
        val visible: Boolean
        val clickable: Boolean
        val scrollable: Boolean

        /** Hacia dónde se mueve, o null si la vista no lo declara. */
        val axis: Axis?
        val children: List<Node>
        fun contains(x: Int, y: Int): Boolean
    }

    /** Pasa un punto de la pantalla, de 0 a 1, a un pixel que exista. Android rechaza los de afuera. */
    fun pixel(value: Float, size: Int): Float = value.coerceIn(0f, 1f) * (size - 1).coerceAtLeast(0)

    fun clickable(root: Node, x: Int, y: Int): Node? = hit(root, x, y) { it.clickable }

    /** Primero lo que está debajo del puntero. Si no hay nada, lo que se pueda mover en pantalla. */
    fun scrollable(root: Node, x: Int, y: Int, axis: Axis): Node? {
        val known = { node: Node -> node.scrollable && node.axis == axis }
        val unknown = { node: Node -> node.scrollable && node.axis == null }
        return hit(root, x, y, known) ?: hit(root, x, y, unknown) ?: anywhere(root, known) ?: anywhere(root, unknown)
    }

    /** Se reparte como un toque de verdad: lo que está encima primero, y si no lo toma, lo de abajo. */
    private fun hit(node: Node, x: Int, y: Int, wanted: (Node) -> Boolean): Node? {
        if (!node.visible || !node.contains(x, y)) return null
        for (child in node.children.asReversed()) hit(child, x, y, wanted)?.let { return it }
        return node.takeIf(wanted)
    }

    private fun anywhere(node: Node, wanted: (Node) -> Boolean): Node? {
        if (!node.visible) return null
        if (wanted(node)) return node
        for (child in node.children) anywhere(child, wanted)?.let { return it }
        return null
    }

    fun axis(dx: Float, dy: Float): Axis = if (abs(dy) >= abs(dx)) Axis.VERTICAL else Axis.HORIZONTAL

    /** La lista sigue al dedo: si sube, se ve lo que viene después. */
    fun forward(dx: Float, dy: Float): Boolean = (if (axis(dx, dy) == Axis.VERTICAL) dy else dx) < 0

    /** Las vistas lo dicen de distintas formas, y algunas no lo dicen. */
    fun axisOf(rows: Int, columns: Int, name: CharSequence?, sideways: Boolean, upDown: Boolean): Axis? = when {
        sideways && !upDown -> Axis.HORIZONTAL
        upDown && !sideways -> Axis.VERTICAL
        rows == 1 && columns > 1 -> Axis.HORIZONTAL
        rows > 1 -> Axis.VERTICAL
        name?.contains("Horizontal") == true || name?.contains("ViewPager") == true -> Axis.HORIZONTAL
        else -> null
    }
}
