package ar.vale.projectorlauncher.ui

import android.graphics.Path

/**
 * Lector mínimo de datos de trazado SVG, para animar el logo con los dibujos originales del
 * kit. `PathParser` es API oculta y sin AndroidX no hay otro; el logo usa solo comandos
 * absolutos M, L, H, V, Q, C y Z, y este lector no acepta otra cosa.
 */
object SvgPath {

    data class Command(val op: Char, val args: List<Float>)

    private val ARGS = mapOf('M' to 2, 'L' to 2, 'H' to 1, 'V' to 1, 'Q' to 4, 'C' to 6, 'Z' to 0)

    fun parse(data: String): List<Command> {
        val out = ArrayList<Command>()
        var i = 0
        while (i < data.length) {
            val c = data[i]
            if (c == ' ' || c == ',' || c == '\n') {
                i++
                continue
            }
            val need = ARGS[c] ?: throw IllegalArgumentException("comando no soportado: $c")
            i++
            if (need == 0) {
                out.add(Command(c, emptyList()))
                continue
            }
            // Un comando puede repetirse sin volver a escribir la letra.
            do {
                val args = ArrayList<Float>(need)
                repeat(need) {
                    while (i < data.length && (data[i] == ' ' || data[i] == ',')) i++
                    val start = i
                    if (i < data.length && data[i] == '-') i++
                    while (i < data.length && (data[i].isDigit() || data[i] == '.')) i++
                    require(i > start) { "falta un número en la posición $start" }
                    args.add(data.substring(start, i).toFloat())
                }
                out.add(Command(c, args))
                while (i < data.length && (data[i] == ' ' || data[i] == ',')) i++
            } while (i < data.length && (data[i].isDigit() || data[i] == '-' || data[i] == '.'))
        }
        return out
    }

    fun toPath(commands: List<Command>): Path {
        val path = Path()
        var x = 0f
        var y = 0f
        for (cmd in commands) {
            val a = cmd.args
            when (cmd.op) {
                'M' -> { x = a[0]; y = a[1]; path.moveTo(x, y) }
                'L' -> { x = a[0]; y = a[1]; path.lineTo(x, y) }
                'H' -> { x = a[0]; path.lineTo(x, y) }
                'V' -> { y = a[0]; path.lineTo(x, y) }
                'Q' -> { path.quadTo(a[0], a[1], a[2], a[3]); x = a[2]; y = a[3] }
                'C' -> { path.cubicTo(a[0], a[1], a[2], a[3], a[4], a[5]); x = a[4]; y = a[5] }
                'Z' -> path.close()
            }
        }
        return path
    }
}
