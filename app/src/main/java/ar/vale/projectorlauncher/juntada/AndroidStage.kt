package ar.vale.projectorlauncher.juntada

import android.app.Instrumentation
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.Installed
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.device.BlackoutActivity
import ar.vale.projectorlauncher.device.Casting
import ar.vale.projectorlauncher.device.Functions
import ar.vale.projectorlauncher.media.CineActivity
import ar.vale.projectorlauncher.media.PlayerActivity
import ar.vale.projectorlauncher.remote.RemoteAccessibility
import ar.vale.projectorlauncher.remote.WallPointer
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice

/**
 * La pared de la fila de presentaciones. Abre el archivo de quien presenta en el reproductor de
 * siempre y le presta las teclas mientras dura su turno, y nada más que mientras ese archivo está
 * delante: si la pared está en otra cosa, las teclas de quien presenta no tocan nada.
 */
class AndroidStage(private val context: Context, private val files: DemoFiles) : Stage {

    private val main = Handler(Looper.getMainLooper())
    private val instrumentation = Instrumentation()

    override fun open(demo: Demos.Shown): Boolean {
        // Quien muestra su propia pantalla no necesita nada de la pared: solo que le guarden el turno.
        val name = demo.file ?: return true
        val file = files.file(demo.id, name)
        if (!file.isFile) return false
        if (!canShow()) return false
        val kind = when (demo.media) {
            Demos.Media.PDF -> FileKind.PDF
            Demos.Media.IMAGE -> FileKind.IMAGE
            else -> FileKind.VIDEO
        }
        val intent = CineActivity.player(context, file, kind)
            .putExtra(PlayerActivity.EXTRA_STAGE, demo.id)
            .putExtra(PlayerActivity.EXTRA_TITLE, demo.title)
        main.post {
            val front = GdActivity.current
            // La cinta tapa con el título de la presentación y se corre para mostrarla. Si justo
            // está tapando por otra cosa, no puede: se abre directo, y el turno no queda sin pantalla.
            if (front != null && !front.covering) front.openScreen(intent, demo.title)
            else runCatching { context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
        }
        return true
    }

    override fun close(id: Int) {
        main.post {
            (GdActivity.current as? BlackoutActivity)?.finish()
            PlayerActivity.onStage(id)?.leaveStage()
            // De vuelta al tablero: ahí se ven los aplausos y quién sigue.
            if (canShow()) {
                val board = JuntadaActivity.demos(context)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                runCatching { context.startActivity(board) }
            }
        }
    }

    /**
     * Desde Android 10, con otra app delante solo se puede abrir una pantalla si está activo el
     * control total. Antes de eso (el Fika P8 es Android 9) se puede siempre.
     */
    private fun canShow(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.Q || GdActivity.current != null || RemoteAccessibility.instance != null

    override fun key(id: Int, name: String): Boolean {
        val front = GdActivity.current
        // Con la imagen en negro, cualquier tecla la devuelve: igual que con el control.
        if (front is BlackoutActivity) {
            main.post { front.finish() }
            return true
        }
        val player = PlayerActivity.onStage(id) ?: return false
        if (front !== player) return false
        // Si el archivo no se pudo reproducir, delante está el aviso con sus salidas (otro
        // reproductor, la Tienda). Esas son de quien maneja la pared, no de quien presenta.
        if (player.unplayable) return false
        if (name == BLACK) {
            main.post { runCatching { player.startActivity(Intent(player, BlackoutActivity::class.java)) } }
            return true
        }
        val code = KEYS[name] ?: return false
        return runCatching { instrumentation.sendKeyDownUpSync(code) }.isSuccess
    }

    override fun pointer(id: Int, x: Float, y: Float, visible: Boolean) {
        val player = PlayerActivity.onStage(id) ?: return
        if (GdActivity.current === player) WallPointer.move(x, y, visible)
    }

    override fun sources(): List<String> = Demos.SOURCES.filter { entry(it) != null }

    /**
     * Quien muestra su pantalla elige por dónde entra, y la pared se pone a recibirla. No abre
     * ninguna otra cosa: la app que recibe la pantalla, o la entrada HDMI.
     */
    override fun source(id: Int, name: String): Boolean {
        val (intent, title) = entry(name) ?: return false
        if (!canShow()) return false
        main.post {
            val front = GdActivity.current
            if (front != null && !front.covering) front.openExternal(intent, title)
            else runCatching { context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
        }
        return true
    }

    private fun entry(name: String): Pair<Intent, String>? = when (name) {
        CAST -> Casting.best(context)?.let { it.intent to it.name }
        HDMI -> Installed.functions(context).firstOrNull { it.kind == Functions.Kind.HDMI && !it.broadcast }
            ?.let { Intent(it.intent).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) to context.getString(it.kind.label) }
        else -> null
    }

    override fun timeUp(name: String) {
        main.post {
            val front = GdActivity.current ?: return@post
            Notice.show(front, front.getString(R.string.demo_time_up, name), Notice.Kind.WARN)
        }
    }

    private companion object {
        const val BLACK = "black"
        const val CAST = "cast"
        const val HDMI = "hdmi"
        val KEYS = mapOf(
            "left" to KeyEvent.KEYCODE_DPAD_LEFT,
            "right" to KeyEvent.KEYCODE_DPAD_RIGHT,
            "ok" to KeyEvent.KEYCODE_DPAD_CENTER
        )
    }
}
