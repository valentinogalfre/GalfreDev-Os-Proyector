package ar.vale.projectorlauncher.device

import android.graphics.Color
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import ar.vale.projectorlauncher.ui.GdActivity

/** Imagen apagada: negro total hasta la próxima tecla. También sirve para pausar una presentación. */
class BlackoutActivity : GdActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(View(this).apply { setBackgroundColor(Color.BLACK) })
        window.decorView.setBackgroundColor(Color.BLACK)
        window.attributes = window.attributes.apply { screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_OFF }
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_UP) finish()
        return true
    }
}
