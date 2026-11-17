package ar.vale.projectorlauncher.juntada

import android.content.Context
import android.content.pm.ApplicationInfo
import android.os.Handler
import android.os.Looper
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.claude.HttpTransport
import ar.vale.projectorlauncher.claude.KeyVault
import ar.vale.projectorlauncher.claude.Models
import ar.vale.projectorlauncher.remote.AccessHub
import org.json.JSONObject
import java.io.File
import java.lang.ref.WeakReference
import java.security.SecureRandom

/**
 * La juntada de este equipo: una sola, compartida por la pared, el servidor del celular y Claude.
 * La gente y las cuentas se guardan en un archivo propio, para que sobrevivan a un apagón.
 */
object JuntadaHub {

    fun interface Watcher {
        fun onJuntadaChanged()
    }

    private const val FILE = "juntada.json"
    private val main = Handler(Looper.getMainLooper())
    private val random = SecureRandom()
    private var instance: Juntada? = null
    private var saved: String? = null
    private var watcher: WeakReference<Watcher>? = null

    @Synchronized
    fun get(context: Context): Juntada {
        instance?.let { return it }
        val app = context.applicationContext
        val file = File(app.filesDir, FILE)
        val stored = runCatching { JSONObject(file.readText()) }.getOrNull()
        val created = Juntada(stored)
        saved = stored?.toString()
        // Lo que quedó en el disco de una presentación que ya no está, o de una subida a medias, se va.
        val store = files(app)
        created.dropMissingDemoFiles(store::exists)
        store.sweep(created.demoIds())
        created.stage = AndroidStage(app, store)
        created.onDemosGone = { ids -> ids.forEach(store::drop) }
        created.onReset = { AccessHub.get(app).clearGuests() }
        created.onChange = {
            save(created, file)
            main.post { watcher?.get()?.onJuntadaChanged() }
        }
        instance = created
        return created
    }

    private var store: DemoFiles? = null

    /**
     * Los archivos de la fila de presentaciones: en la carpeta de la app, que no pide ningún
     * permiso. Es uno solo para todos: sabe qué archivo está entrando, y lo corta si esa
     * presentación se va de la fila.
     */
    @Synchronized
    fun files(context: Context): DemoFiles = store
        ?: DemoFiles(File(context.getExternalFilesDir(null) ?: context.filesDir, "presentaciones")).also { store = it }

    /** La pantalla que quiere enterarse de los cambios. Se avisa en el hilo principal. */
    fun watch(value: Watcher?) {
        watcher = value?.let { WeakReference(it) }
    }

    /** Solo escribe si cambió algo de lo que se guarda: las respuestas de una trivia no tocan el disco. */
    @Synchronized
    private fun save(juntada: Juntada, file: File) {
        val text = juntada.export().toString()
        if (text == saved) return
        runCatching {
            val partial = File(file.parentFile, "$FILE.part")
            partial.writeText(text)
            check(partial.renameTo(file))
        }.onSuccess { saved = text }
    }

    /** Claude si hay clave y responde; si no, las preguntas propias. La trivia nunca queda sin arrancar. */
    fun source(context: Context): TriviaSource {
        val app = context.applicationContext
        return object : TriviaSource {
            override fun make(topic: String, count: Int): Juntada.Quiz = make(topic, count, Juntada.Level.NORMAL)

            override fun make(topic: String, count: Int, level: Juntada.Level): Juntada.Quiz {
                val key = KeyVault.load(app)
                val fromClaude = key?.let {
                    runCatching {
                        val model = Models.of(Prefs(app).claudeModel)
                        TriviaMaker.make(HttpTransport(it, endpoint(app)), model, topic, count, random, level)
                    }.getOrNull()
                }
                return fromClaude ?: TriviaBank.pick(count, random)
            }
        }
    }

    /** Las compilaciones de prueba pueden hablar con un servidor local (scripts/fake_claude.py). */
    private fun endpoint(context: Context): String {
        val debuggable = context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0
        val file = File(context.filesDir, "claude_endpoint.txt")
        return if (debuggable && file.exists()) file.readText().trim() else HttpTransport.ENDPOINT
    }
}
