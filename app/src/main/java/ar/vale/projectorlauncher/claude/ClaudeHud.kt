package ar.vale.projectorlauncher.claude

import android.content.Context
import android.os.Handler
import android.os.Looper
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.remote.RemoteAccessibility
import ar.vale.projectorlauncher.ui.GdActivity

/**
 * Claude sobre otra app. Cuando maneja Netflix, su pantalla quedó atrás: lo que va haciendo y lo
 * que responde se muestra en un renglón encima de lo que esté delante. Se llama desde el hilo principal.
 */
object ClaudeHud {

    private val main = Handler(Looper.getMainLooper())
    private val hide = Runnable { RemoteAccessibility.instance?.showStatus(null) }

    fun render(context: Context) {
        main.removeCallbacks(hide)
        val service = RemoteAccessibility.instance ?: return
        // En una pantalla nuestra, Claude ya tiene la suya.
        if (GdActivity.current != null) {
            service.showStatus(null)
            return
        }
        val state = ClaudeRuntime.snapshot
        val text = ClaudeSettings.status(context, state)
        service.showStatus(text?.let { context.getString(R.string.claude_hud, it) })
        if (!state.busy && text != null) {
            main.postDelayed(hide, (READ_BASE_MS + text.length * READ_PER_CHAR_MS).coerceAtMost(READ_MAX_MS))
        }
    }

    /** Al volver a una pantalla nuestra el renglón sobra. */
    fun clear() {
        main.removeCallbacks(hide)
        RemoteAccessibility.instance?.showStatus(null)
    }

    private const val READ_BASE_MS = 5000L
    private const val READ_PER_CHAR_MS = 60L
    private const val READ_MAX_MS = 20000L
}
