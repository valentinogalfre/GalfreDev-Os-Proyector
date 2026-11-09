package ar.vale.projectorlauncher.claude

import android.content.Context
import android.content.pm.ApplicationInfo
import android.os.Handler
import android.os.Looper
import ar.vale.projectorlauncher.Prefs
import java.io.File
import java.lang.ref.WeakReference

/**
 * La conversación vive acá y no en la pantalla: el asistente abre apps, y en un equipo de 1 GB la
 * pantalla se puede destruir mientras tanto. Al volver, retoma lo que estaba mostrando.
 */
object ClaudeRuntime {

    fun interface Observer {
        fun onChanged()
    }

    private val main = Handler(Looper.getMainLooper())
    private var observer: WeakReference<Observer>? = null
    private var session: Session? = null
    private var sessionKey: String? = null
    private var sessionModel: String? = null
    private var sessionSearch = true
    private var tools: AndroidTools? = null
    private var appContext: Context? = null

    /** Una copia del estado que se puede leer desde cualquier hilo: la consulta el celular. */
    class Snapshot(
        val question: String,
        val answer: String,
        val activity: String?,
        val busy: Boolean,
        val end: Session.End?,
        val error: Throwable?
    )

    @Volatile var snapshot = Snapshot("", "", null, false, null, null)
        private set

    /** Cambia al empezar de cero: lo que siga llegando de la sesión vieja ya no se dibuja. */
    private var generation = 0
    private const val TEXT_MS = 90L
    private const val MAX_STEPS_KEPT = 40

    // Estado que dibuja la pantalla. Solo se toca en el hilo principal.
    var question: String = ""
        private set
    var answer: String = ""
        private set
    var activity: String? = null
        private set
    var busy = false
        private set
    var end: Session.End? = null
        private set
    var error: Throwable? = null
        private set

    /** Lo que fue haciendo para responder, en orden: una línea por herramienta. */
    var steps: List<String> = emptyList()
        private set
    private var replaceOnText = false
    private var textPending = false
    private val flushText = Runnable {
        textPending = false
        changed()
    }

    fun observe(value: Observer?) {
        observer = value?.let { WeakReference(it) }
    }

    private fun changed() {
        snapshot = Snapshot(question, answer, activity, busy, end, error)
        observer?.get()?.onChanged()
        // Con otra app delante nuestra pantalla no se ve: lo que pasa se cuenta encima de esa app.
        appContext?.let(ClaudeHud::render)
    }

    /** Devuelve false si falta la clave. */
    fun ask(context: Context, text: String): Boolean {
        if (busy) return true
        val app = context.applicationContext
        appContext = app
        val key = KeyVault.load(app) ?: return false
        val prefs = Prefs(app)
        val model = prefs.claudeModel
        val search = prefs.claudeWebSearch
        // Las firmas del historial son de esta cuenta y este modelo: si cambian, se empieza de cero.
        val current = session.takeIf { key == sessionKey && model == sessionModel && search == sessionSearch }
            ?: Session(HttpTransport(key, endpoint(app)), Models.of(model), search, Prompt.SYSTEM, AndroidTools(app).also { tools = it }, Feed(generation)).also {
                session = it
                sessionKey = key
                sessionModel = model
                sessionSearch = search
            }
        question = text
        answer = ""
        steps = emptyList()
        activity = null
        end = null
        error = null
        busy = true
        replaceOnText = false
        changed()
        Thread({ current.ask(text) }, "claude").start()
        return true
    }

    fun cancel() {
        session?.cancel()
        tools?.release()
    }

    fun reset() {
        cancel()
        generation++
        busy = false
        session = null
        sessionKey = null
        question = ""
        answer = ""
        steps = emptyList()
        activity = null
        end = null
        error = null
        changed()
    }

    /** Las compilaciones de prueba pueden hablar con un servidor local (scripts/fake_claude.py). */
    private fun endpoint(context: Context): String {
        val debuggable = context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0
        val file = File(context.filesDir, "claude_endpoint.txt")
        return if (debuggable && file.exists()) file.readText().trim() else HttpTransport.ENDPOINT
    }

    /** Todo pasa al hilo principal, y solo si la sesión que lo manda sigue siendo la actual. */
    private class Feed(private val owner: Int) : Session.Listener {

        private fun later(change: () -> Unit) {
            main.post { if (owner == generation) change() }
        }

        override fun onStep() = later {
            replaceOnText = answer.isNotEmpty()
            // La herramienta anterior ya terminó: lo que sigue es pensar el próximo paso.
            if (activity != null) {
                activity = null
                changed()
            }
        }

        /**
         * El texto llega de a pedacitos, decenas por segundo, y cada uno obligaba a rearmar la
         * respuesta entera en pantalla. Se junta lo que llega y se dibuja unas diez veces por segundo.
         */
        override fun onText(text: String) = later {
            answer = if (replaceOnText) text else answer + text
            replaceOnText = false
            activity = null
            if (!textPending) {
                textPending = true
                main.postDelayed(flushText, TEXT_MS)
            }
        }

        override fun onTool(name: String, input: org.json.JSONObject) {
            val line = Tools.trace(name, input)
            later {
                steps = (steps + line).takeLast(MAX_STEPS_KEPT)
                changed()
            }
        }

        override fun onActivity(what: String) = later {
            activity = what
            changed()
        }

        override fun onEnd(end: Session.End, error: Throwable?) = later {
            ClaudeRuntime.end = end
            ClaudeRuntime.error = error
            busy = false
            activity = null
            changed()
        }
    }
}
