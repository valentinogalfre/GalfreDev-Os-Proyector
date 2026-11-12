package ar.vale.projectorlauncher.ui

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.claude.ClaudeHud
import java.lang.ref.WeakReference

/**
 * Base de todas las pantallas: lienzo fijo, tema, cinta de foco y transiciones.
 * Sin AndroidX a propósito: el APK es framework puro para arrancar rápido en hardware flojo.
 */
abstract class GdActivity : Activity() {

    lateinit var prefs: Prefs
        private set
    lateinit var tape: FocusTape
        private set
    lateinit var rootFrame: FrameLayout
        private set
    lateinit var content: View
        private set

    /** Capas abiertas arriba del contenido (paneles, teclado). La de arriba recibe el atrás. */
    private val overlays = ArrayList<Overlay>()
    private var resumed = false

    interface Overlay {
        fun dismiss()
    }

    fun pushOverlay(overlay: Overlay) {
        overlays.add(overlay)
    }

    fun popOverlay(overlay: Overlay) {
        overlays.remove(overlay)
    }

    val hasOverlay: Boolean get() = overlays.isNotEmpty()

    /** Pantallas que solo maneja el dueño: un invitado con el control prestado no entra a tocarlas. */
    open val ownerOnly: Boolean get() = false

    override fun attachBaseContext(newBase: Context) {
        super.attachBaseContext(Screen.wrap(newBase))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = Prefs(this)
        Motion.load(prefs)
        hideSystemBars()
    }

    override fun setContentView(layoutResID: Int) {
        setContentView(layoutInflater.inflate(layoutResID, FrameLayout(this), false))
    }

    override fun setContentView(view: View) {
        rootFrame = FrameLayout(this)
        content = view
        rootFrame.addView(
            view,
            ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        tape = FocusTape(this)
        rootFrame.addView(
            tape,
            ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        super.setContentView(rootFrame)
        if (intent.getBooleanExtra(EXTRA_TAPE, false) && Motion.full) {
            tape.startCovered(intent.getStringExtra(EXTRA_TAPE_TITLE), holdsCover())
        }
    }

    /** Agrega una capa arriba del contenido y debajo de la cinta. */
    fun addLayer(view: View) {
        rootFrame.addView(
            view,
            rootFrame.indexOfChild(tape),
            ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
    }

    override fun onPause() {
        resumed = false
        if (current === this) foreground = null
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        resumed = true
        foreground = WeakReference(this)
        ClaudeHud.clear()
        if (Screen.themeChanged(this)) {
            recreate()
            return
        }
        hideSystemBars()
        if (::tape.isInitialized && !holdsCover()) tape.uncover()
    }

    /**
     * Una pantalla que todavía no tiene qué mostrar (un video sin su primer cuadro) pide que la cinta
     * siga tapando al entrar, y la destapa ella misma con `tape.uncover()` cuando está lista.
     */
    protected open fun holdsCover(): Boolean = false

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (!hasFocus) return
        hideSystemBars()
        // Android arranca en modo táctil, y en modo táctil no hay foco: sin esto la cinta no
        // aparece hasta la primera tecla. requestFocusFromTouch sale de ese modo.
        if (::content.isInitialized && window.decorView.findFocus() == null) {
            content.requestFocusFromTouch()
        }
    }

    @Suppress("DEPRECATION")
    private fun hideSystemBars() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            )
    }

    /**
     * Pantalla estándar: título grande y, a la derecha, un dato. La usan las pantallas de lista
     * y grilla; devuelve las vistas para que cada una cargue su contenido.
     */
    fun setHead(title: CharSequence, data: CharSequence? = null) {
        findViewById<TextView>(R.id.screen_title).text = title
        findViewById<TextView>(R.id.screen_data).text = data
    }

    /** Abre una pantalla propia con la transición de cinta. */
    fun openScreen(intent: Intent, title: CharSequence?) {
        tape.cover(title) {
            intent.putExtra(EXTRA_TAPE, true)
            if (title != null) intent.putExtra(EXTRA_TAPE_TITLE, title.toString())
            startActivity(intent)
            noTransition()
            uncoverIfIgnored()
        }
    }

    /**
     * Abre algo de afuera (otra app, un ajuste del sistema). La cinta tapa, y al volver se
     * destapa sola en onResume. Si el sistema no pudo abrirlo, se destapa y avisa.
     */
    fun openExternal(intent: Intent, title: CharSequence?, onFail: () -> Unit = {}) {
        tape.cover(title) {
            val ok = runCatching { startActivity(intent) }.isSuccess
            if (ok) {
                noTransition()
                uncoverIfIgnored()
            } else {
                tape.uncover()
                onFail()
            }
        }
    }

    /** Si nada nos pausó, nada se abrió: no dejar la pantalla tapada para siempre. */
    private fun uncoverIfIgnored() {
        tape.postDelayed({ if (resumed) tape.uncover() }, COVER_WATCHDOG_MS)
    }

    /** Cierra esta pantalla con la cinta: la anterior estaba tapada y se destapa sola. */
    fun closeScreen() {
        tape.cover(null) {
            finish()
            noTransition()
        }
    }

    @Suppress("DEPRECATION")
    fun noTransition() = overridePendingTransition(0, 0)

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        // Mientras la cinta tapa la pantalla no se aceptan teclas: evita abrir dos veces lo mismo.
        if (::tape.isInitialized && tape.isBusy) return true
        (overlays.lastOrNull() as? Keyboard)?.let { if (it.onKey(event)) return true }
        return super.dispatchKeyEvent(event)
    }

    @Deprecated("Deprecated in Java")
    @Suppress("MissingSuperCall")
    override fun onBackPressed() {
        val top = overlays.lastOrNull()
        if (top != null) top.dismiss() else closeScreen()
    }

    /** El teclado en pantalla abierto, si lo hay. */
    val keyboard: Keyboard? get() = overlays.lastOrNull() as? Keyboard

    /** True mientras la cinta tapa la pantalla o está por hacerlo: lo que se abra ahora no puede pasar por ella. */
    val covering: Boolean get() = ::tape.isInitialized && tape.isBusy

    companion object {
        @Volatile private var foreground: WeakReference<GdActivity>? = null

        /** La pantalla nuestra que está a la vista; null si hay otra app delante. */
        val current: GdActivity? get() = foreground?.get()

        const val EXTRA_TAPE = "gd.tape"
        const val EXTRA_TAPE_TITLE = "gd.tape.title"
        private const val COVER_WATCHDOG_MS = 3000L
    }
}
