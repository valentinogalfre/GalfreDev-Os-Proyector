package ar.vale.projectorlauncher.wall

import android.os.Bundle
import android.os.SystemClock
import android.service.dreams.DreamService
import android.content.Context
import android.view.KeyEvent
import android.view.WindowManager
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Screen

/** Pantalla completa de la pared. Izquierda y derecha cambian de modo; cualquier otra tecla sale. */
class WallActivity : GdActivity() {

    private lateinit var wall: WallView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        wall = WallView(this)
        setContentView(wall)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        wall.mode = WallView.Mode.values().getOrElse(prefs.wallMode) { WallView.Mode.WORDS }
        val minutes = intent.getIntExtra(EXTRA_COUNTDOWN_MINUTES, 0)
        if (minutes > 0) wall.countdownEnd = SystemClock.elapsedRealtime() + minutes * 60_000L
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val modes = WallView.Mode.values()
        val delta = when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> -1
            KeyEvent.KEYCODE_DPAD_RIGHT -> 1
            else -> 0
        }
        if (delta == 0) {
            if (keyCode != KeyEvent.KEYCODE_VOLUME_UP && keyCode != KeyEvent.KEYCODE_VOLUME_DOWN) closeScreen()
            return super.onKeyDown(keyCode, event)
        }
        wall.countdownEnd = 0L
        val next = modes[(wall.mode.ordinal + delta + modes.size) % modes.size]
        wall.mode = next
        prefs.wallMode = next.ordinal
        Notice.show(this, getString(next.label))
        return true
    }

    companion object {
        const val EXTRA_COUNTDOWN_MINUTES = "countdown_minutes"
    }
}

/** La misma pared como protector de pantalla del sistema, para cuando otra app queda inactiva. */
class WallDream : DreamService() {

    override fun attachBaseContext(newBase: Context) {
        super.attachBaseContext(Screen.wrap(newBase))
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        isFullscreen = true
        isInteractive = false
        val wall = WallView(this)
        wall.mode = WallView.Mode.values().getOrElse(Prefs(this).wallMode) { WallView.Mode.WORDS }
        setContentView(wall)
    }
}
