package ar.vale.projectorlauncher.claude

/**
 * Lo que hay en pantalla, contado en texto: una lista numerada de lo que se puede leer y tocar.
 *
 * Android 9 no deja que un servicio de accesibilidad saque capturas, así que Claude no ve la
 * imagen: ve lo mismo que un lector de pantalla. Esta parte no conoce Android, para probarla.
 */
object ScreenText {

    interface Node {
        val text: String?
        val description: String?

        /** El nombre corto del id de la vista, si la app lo informa. Sirve cuando no hay texto. */
        val idName: String?
        val className: String?
        val visible: Boolean
        val clickable: Boolean
        val editable: Boolean
        val scrollable: Boolean
        val checkable: Boolean
        val checked: Boolean
        val focused: Boolean
        val selected: Boolean
        val password: Boolean
        val left: Int
        val top: Int
        val right: Int
        val bottom: Int
        val children: List<Node>
    }

    /** [targets] va en el orden de los números: el elemento 1 es `targets[0]`. */
    class Listing(val text: String, val targets: List<Node>, val labels: List<String>)

    private class Entry(val node: Node, val kind: String, val label: String, val detail: String)

    fun describe(app: String, root: Node?, width: Int, height: Int): Listing {
        val entries = ArrayList<Entry>()
        var scrolls = false
        fun walk(node: Node, inside: Boolean) {
            if (!node.visible || !onScreen(node, width, height)) return
            if (node.scrollable) scrolls = true
            val acts = node.clickable || node.editable || node.checkable
            when {
                acts -> entries.add(entry(node, if (node.password) "" else labelOf(node, deep = true)))
                // El texto de adentro de un botón ya salió en el nombre del botón.
                !inside -> own(node)?.let { entries.add(entry(node, it)) }
            }
            node.children.forEach { walk(it, inside || acts) }
        }
        root?.let { walk(it, inside = false) }

        val band = (height / BANDS).coerceAtLeast(1)
        val sorted = entries.sortedWith(compareBy({ it.node.top / band }, { it.node.left }))
        val shown = dedupe(sorted).take(MAX_ITEMS)
        val out = StringBuilder("App al frente: ").append(app).append('\n')
        if (shown.isEmpty()) {
            out.append("No hay nada legible en pantalla. Puede estar cargando, o ser un video a pantalla completa.")
            return Listing(out.toString(), emptyList(), emptyList())
        }
        shown.forEachIndexed { i, e ->
            out.append('[').append(i + 1).append("] ").append(e.kind)
            if (e.label.isNotEmpty()) out.append(" \"").append(e.label).append('"')
            out.append(e.detail).append('\n')
        }
        if (sorted.size > shown.size) out.append("Hay más elementos que no entraron en la lista.\n")
        if (scrolls) out.append("Se puede deslizar para ver más.")
        return Listing(out.toString().trimEnd(), shown.map { it.node }, shown.map { it.label.ifEmpty { it.kind } })
    }

    private fun onScreen(node: Node, width: Int, height: Int): Boolean =
        node.right > node.left && node.bottom > node.top &&
            node.right > 0 && node.bottom > 0 && node.left < width && node.top < height

    private fun own(node: Node): String? =
        clean(node.text).ifEmpty { clean(node.description) }.ifEmpty { null }

    /** Como un lector de pantalla: si el botón no dice nada, se lo nombra por lo que tiene adentro. */
    private fun labelOf(node: Node, deep: Boolean): String {
        own(node)?.let { return it }
        if (!deep) return ""
        val parts = LinkedHashSet<String>()
        fun gather(n: Node) {
            for (child in n.children) {
                if (!child.visible || parts.size >= MAX_PARTS) continue
                // Un botón adentro de otro tiene su propio renglón.
                if (child.clickable || child.editable || child.checkable) continue
                own(child)?.let(parts::add)
                gather(child)
            }
        }
        gather(node)
        return clean(parts.joinToString(" · "))
    }

    private fun entry(node: Node, label: String): Entry {
        val acts = node.clickable || node.editable || node.checkable
        val name = node.className.orEmpty()
        val kind = when {
            node.password -> "campo de contraseña"
            node.editable -> "campo"
            node.checkable -> "interruptor"
            !acts -> "texto"
            name.contains("Image") && !name.contains("Button") -> "imagen"
            else -> "botón"
        }
        val detail = StringBuilder()
        if (acts && label.isEmpty() && !node.password) {
            detail.append(" sin nombre")
            node.idName?.takeIf { it.isNotBlank() }?.let { detail.append(" (").append(it.take(MAX_ID)).append(')') }
        }
        val states = ArrayList<String>()
        if (node.checkable) states.add(if (node.checked) "encendido" else "apagado")
        if (node.focused) states.add("con foco")
        if (node.selected) states.add("elegido")
        if (states.isNotEmpty()) detail.append(" (").append(states.joinToString(", ")).append(')')
        return Entry(node, kind, label, detail.toString())
    }

    /** Dos renglones iguales seguidos no dicen nada nuevo: pasa con los textos repetidos de una fila. */
    private fun dedupe(entries: List<Entry>): List<Entry> {
        val out = ArrayList<Entry>()
        for (e in entries) {
            val last = out.lastOrNull()
            val repeated = last != null && e.kind == "texto" && last.kind == "texto" && last.label == e.label
            if (!repeated) out.add(e)
        }
        return out
    }

    private fun clean(text: String?): String {
        val flat = text.orEmpty().replace(SPACES, " ").replace('"', '\'').trim()
        return if (flat.length > MAX_LABEL) flat.take(MAX_LABEL - 1) + "…" else flat
    }

    private val SPACES = Regex("\\s+")
    private const val MAX_ITEMS = 70
    private const val MAX_LABEL = 90
    private const val MAX_PARTS = 4
    private const val MAX_ID = 30
    private const val BANDS = 36
}
