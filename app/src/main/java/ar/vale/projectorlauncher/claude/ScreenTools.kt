package ar.vale.projectorlauncher.claude

import ar.vale.projectorlauncher.remote.RemoteGuard

/** Lo que hay delante y cómo se lo toca. Es una interfaz para probar las herramientas sin Android. */
interface ScreenDriver {

    class Snapshot(val app: String, val packageName: String, val root: ScreenText.Node?, val width: Int, val height: Int)

    /** False si falta el permiso de Control total. */
    val available: Boolean

    /** Null si no hay ninguna ventana que leer. */
    fun snapshot(): Snapshot?
    fun tap(node: ScreenText.Node): Boolean

    /** Sin [node], escribe en el campo que tiene el foco. */
    fun type(node: ScreenText.Node?, text: String): Boolean
    fun key(name: String): Boolean
    fun swipe(direction: String): Boolean
    fun pause(milliseconds: Long)
}

/**
 * Las herramientas con las que Claude maneja otra app: mira, toca, escribe, y vuelve a mirar.
 *
 * Cada acción devuelve la pantalla que quedó, así no hace falta un pedido más para verla. Los
 * números de los elementos valen solo para esa última pantalla.
 */
class ScreenTools(private val driver: ScreenDriver, private val enabled: () -> Boolean = { true }) {

    private var last: ScreenText.Listing? = null

    fun see(): ToolOutcome = guarded { ToolOutcome(read()) }

    fun tap(number: Int): ToolOutcome = guarded {
        val (node, label) = target(number) ?: return@guarded stale(number)
        if (!driver.tap(node)) return@guarded ToolOutcome("No se pudo tocar \"$label\".", isError = true)
        ToolOutcome("Toqué \"$label\".\n\n${settled()}")
    }

    fun type(text: String, number: Int?): ToolOutcome = guarded {
        val node = if (number == null) null else (target(number) ?: return@guarded stale(number)).first
        if (node != null && node.password) return@guarded ToolOutcome(PASSWORD, isError = true)
        if (node != null && !node.editable) {
            return@guarded ToolOutcome("El elemento $number no es un campo de texto. Tocá primero el campo.", isError = true)
        }
        if (!driver.type(node, text)) {
            return@guarded ToolOutcome("No hay un campo de texto listo. Tocá el campo y volvé a probar.", isError = true)
        }
        ToolOutcome("Texto escrito.\n\n${settled()}")
    }

    fun key(name: String): ToolOutcome = guarded(checkFront = name !in ALWAYS_ALLOWED) {
        if (!driver.key(name)) return@guarded ToolOutcome("La tecla no llegó.", isError = true)
        ToolOutcome("Tecla enviada.\n\n${settled()}")
    }

    fun swipe(direction: String): ToolOutcome = guarded {
        if (!driver.swipe(direction)) return@guarded ToolOutcome("No se pudo deslizar.", isError = true)
        ToolOutcome("Deslicé hacia $direction.\n\n${settled()}")
    }

    fun wait(seconds: Int): ToolOutcome = guarded {
        driver.pause(seconds * 1000L)
        ToolOutcome(read())
    }

    /** Nada de esto corre sin el permiso, ni sobre una pantalla que tiene que confirmar una persona. */
    private fun guarded(checkFront: Boolean = true, action: () -> ToolOutcome): ToolOutcome {
        if (!enabled()) return ToolOutcome(OFF, isError = true)
        if (!driver.available) return ToolOutcome(NO_ACCESS, isError = true)
        if (checkFront && RemoteGuard.handsOff(driver.snapshot()?.packageName)) {
            last = null
            return ToolOutcome(HANDS_OFF, isError = true)
        }
        return action()
    }

    private fun target(number: Int): Pair<ScreenText.Node, String>? {
        val listing = last ?: return null
        val node = listing.targets.getOrNull(number - 1) ?: return null
        return node to listing.labels[number - 1]
    }

    private fun stale(number: Int) = ToolOutcome(
        if (last == null) "Primero usá ver_pantalla: los números salen de ahí."
        else "No existe el elemento $number en la última pantalla. Usá ver_pantalla.",
        isError = true
    )

    private fun read(): String {
        val snapshot = driver.snapshot()
        if (snapshot == null) {
            last = null
            return "No se pudo leer la pantalla. Probá con esperar."
        }
        if (RemoteGuard.handsOff(snapshot.packageName)) {
            last = null
            return HANDS_OFF
        }
        val listing = ScreenText.describe(snapshot.app, snapshot.root, snapshot.width, snapshot.height)
        last = listing
        return listing.text
    }

    /** Espera a que la pantalla deje de cambiar, con tope: un video o un reloj no se quedan quietos nunca. */
    private fun settled(): String {
        driver.pause(FIRST_LOOK_MS)
        var previous = read()
        repeat(MAX_LOOKS) {
            driver.pause(NEXT_LOOK_MS)
            val next = read()
            if (next == previous) return next
            previous = next
        }
        return previous
    }

    companion object {
        const val NO_ACCESS = "Falta activar Control total: se hace una sola vez, desde Celular, en el proyector. Sin eso no puedo ver ni tocar otras apps."
        const val HANDS_OFF = "Lo que está en pantalla lo tiene que resolver una persona con el control: es una instalación, una compra, un permiso o un ajuste del sistema. No lo leo ni lo toco."
        const val OFF = "Manejar otras apps está apagado en los ajustes de Claude."
        const val PASSWORD = "No escribo contraseñas. Pedile a la persona que la escriba."

        /** Salir siempre se puede, también de una pantalla que no se toca. */
        private val ALWAYS_ALLOWED = setOf("atras", "inicio")
        private const val FIRST_LOOK_MS = 500L
        private const val NEXT_LOOK_MS = 400L
        private const val MAX_LOOKS = 4
    }
}
