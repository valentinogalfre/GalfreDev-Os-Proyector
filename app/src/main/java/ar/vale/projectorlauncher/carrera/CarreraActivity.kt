package ar.vale.projectorlauncher.carrera

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Typeface
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.util.TypedValue
import android.view.Gravity
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.TextView
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.Qr
import ar.vale.projectorlauncher.remote.RemoteService
import ar.vale.projectorlauncher.remote.RemoteState
import java.io.ByteArrayInputStream

/**
 * La carrera en la pared. La pantalla es una página que viene dentro del APK: dibuja el 3D, corre
 * la carrera y habla con los volantes por la sala. Acá se abre la sala, se muestra la página y se
 * le pasa el control remoto. La página no toca la red: sus archivos salen del APK y con la sala
 * habla por [Host], así que no depende del certificado ni de permitir tráfico sin cifrar.
 */
open class CarreraActivity : Activity() {

    /** La página de la pared y la que abre cada celular, dentro de `assets/carrera`. */
    protected open val wallPage = "index.html?q=bajo"
    protected open val phonePage = Carrera.RACE_PAGE
    protected open val offText = R.string.carrera_off
    protected open val failedText = R.string.carrera_failed
    protected open val noWebViewText = R.string.carrera_no_webview

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var frame: FrameLayout
    private var web: WebView? = null
    private var waiting = false
    private val host = Host { runOnUiThread { if (!isFinishing) finish() } }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        @Suppress("DEPRECATION")
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        frame = FrameLayout(this).apply { setBackgroundColor(getColor(R.color.carbon)) }
        setContentView(frame)
        if (RemoteState.running) load() else say(getString(offText))
    }

    /** La carrera necesita el servidor del celular. Si está apagado, se pregunta antes de prenderlo. */
    private fun say(text: String) {
        frame.removeAllViews()
        frame.addView(
            TextView(this).apply {
                this.text = text
                gravity = Gravity.CENTER
                setTextColor(getColor(R.color.hueso))
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 22f)
                typeface = Typeface.create(resources.getFont(R.font.instrument_sans_medium), Typeface.NORMAL)
                setPadding(64, 64, 64, 64)
            }
        )
    }

    private fun turnOn() {
        if (waiting) return
        waiting = true
        Prefs(this).remoteEnabled = true
        RemoteService.start(this)
        awaitServer(40)
    }

    private fun awaitServer(left: Int) {
        when {
            isFinishing -> Unit
            RemoteState.running -> load()
            left == 0 -> {
                waiting = false
                say(getString(failedText))
            }
            else -> handler.postDelayed({ awaitServer(left - 1) }, 250)
        }
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    private fun load() {
        val view = try {
            WebView(this)
        } catch (e: RuntimeException) {
            // Hay firmwares sin el componente del sistema que muestra páginas.
            say(getString(noWebViewText))
            return
        }
        val files = CarreraFiles(this)
        view.setBackgroundColor(getColor(R.color.carbon))
        view.settings.javaScriptEnabled = true
        view.settings.allowFileAccess = false
        view.settings.allowContentAccess = false
        view.settings.setSupportZoom(false)
        // El sonido de la carrera arranca solo: en la pared no hay nadie que toque la pantalla para habilitarlo.
        view.settings.mediaPlaybackRequiresUserGesture = false
        // La página recuerda, mientras está abierta, con qué nitidez le alcanzó a este equipo en cada pista.
        view.settings.domStorageEnabled = true
        // La página mide todo en proporción a la pantalla; el mínimo de letra de Android le rompería la escala.
        view.settings.minimumFontSize = 1
        view.settings.minimumLogicalFontSize = 1
        view.settings.textZoom = 100
        view.webViewClient = object : WebViewClient() {
            /** La página no sale de la carrera: cualquier otro destino se ignora. */
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean =
                !request.url.toString().startsWith(ORIGIN)

            /** Todo pedido se responde desde el APK, o no se responde: nada sale a la red. */
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse {
                val url = request.url.toString().substringBefore('#').substringBefore('?')
                val file = (if (url.startsWith(ORIGIN)) files.open(url.substring(ORIGIN.length)) else null)
                    ?: return WebResourceResponse("text/plain", "utf-8", 404, "Not Found", emptyMap(), ByteArrayInputStream(ByteArray(0)))
                val headers = mapOf("Content-Security-Policy" to HttpResponse.GAME_POLICY, "X-Content-Type-Options" to "nosniff")
                return WebResourceResponse(file.type.substringBefore(';'), "utf-8", 200, "OK", headers, ByteArrayInputStream(file.bytes))
            }

            /** En un equipo con poca memoria el sistema puede matar el proceso que dibuja: se cierra la pantalla, no la app. */
            override fun onRenderProcessGone(view: WebView, detail: RenderProcessGoneDetail): Boolean {
                finish()
                return true
            }
        }
        // Lo que la página avisa por consola queda en el registro del equipo: es lo único que se ve desde afuera.
        view.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: ConsoleMessage): Boolean {
                Log.i(TAG, "${message.messageLevel()} ${message.message()} (${message.sourceId().substringAfterLast('/')}:${message.lineNumber()})")
                return true
            }
        }
        view.addJavascriptInterface(host, "CarreraHost")
        val room = CarreraHub.carrera.open(phonePage)
        val join = RemoteState.address(this)?.let { "http://$it:${RemoteState.port}/carrera/$phonePage#r=${room.code}" + (if (RemoteState.publicPort > 0) "&p=${RemoteState.publicPort}" else "") }
        frame.removeAllViews()
        frame.addView(view)
        web = view
        view.loadUrl("${ORIGIN}$wallPage#s=${room.hostSecret}&tls=${RemoteState.securePort}&qr=${join?.let(::qr).orEmpty()}")
    }

    /**
     * Lo único del launcher que la página puede tocar: su canal con la sala y cerrar esta pantalla. La página es
     * la del APK y no navega a otro lado, pero igual esto no da más que mandar y recibir mensajes del juego.
     */
    private class Host(private val leave: () -> Unit) {
        @Volatile private var pipe: Pipe? = null

        /** El que maneja la sala cerró la carrera desde su celular: se vuelve al inicio, como con Atrás. */
        @JavascriptInterface
        fun exit() = leave()

        @JavascriptInterface
        fun open() {
            val fresh = Pipe()
            pipe?.close()
            pipe = fresh
            Thread({ CarreraHub.carrera.serve(fresh, LOOPBACK) }, "carrera-pared").apply { isDaemon = true }.start()
        }

        @JavascriptInterface
        fun send(text: String) {
            pipe?.push(text)
        }

        @JavascriptInterface
        fun poll(): String? = pipe?.drain()

        fun close() {
            pipe?.close()
            pipe = null
        }
    }

    /** El control remoto maneja la sala: los lados cambian de pista, OK larga. El resto sigue su camino. */
    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        val key = when (event.keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> "left"
            KeyEvent.KEYCODE_DPAD_RIGHT -> "right"
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER, KeyEvent.KEYCODE_NUMPAD_ENTER -> "ok"
            else -> return super.dispatchKeyEvent(event)
        }
        if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) {
            val view = web
            if (view != null) view.evaluateJavascript("window.carreraKey&&window.carreraKey('$key')", null)
            else if (key == "ok") turnOn()
        }
        return true
    }

    override fun onResume() {
        super.onResume()
        web?.onResume()
    }

    override fun onPause() {
        web?.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        host.close()
        // Al salir se cierra la sala: el código del QR deja de servir.
        if (web != null) CarreraHub.carrera.close()
        web?.let {
            frame.removeView(it)
            it.destroy()
        }
        web = null
        super.onDestroy()
    }

    companion object {
        /** Un origen que no existe en ninguna red: sirve solo para que la página tenga uno, y seguro. */
        private const val ORIGIN = "https://carrera.invalid/"
        private const val LOOPBACK = "127.0.0.1"
        private const val TAG = "Carrera"

        /** El QR ya resuelto, como lo espera la página: lado, guion y los módulos en hexadecimal. */
        fun qr(text: String): String {
            val matrix = Qr.encode(text)
            val out = StringBuilder().append(matrix.size).append('-')
            var nibble = 0
            var count = 0
            for (y in 0 until matrix.size) for (x in 0 until matrix.size) {
                nibble = (nibble shl 1) or (if (matrix[x, y]) 1 else 0)
                if (++count % 4 == 0) {
                    out.append(Character.forDigit(nibble, 16))
                    nibble = 0
                }
            }
            if (count % 4 != 0) out.append(Character.forDigit(nibble shl (4 - count % 4), 16))
            return out.toString()
        }
    }
}
