package ar.vale.projectorlauncher.remote

import ar.vale.projectorlauncher.juntada.DemoFiles
import ar.vale.projectorlauncher.juntada.Demos
import ar.vale.projectorlauncher.juntada.Juntada
import ar.vale.projectorlauncher.juntada.JuntadaError
import ar.vale.projectorlauncher.juntada.TriviaSource
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.Semaphore
import java.util.concurrent.TimeUnit

/**
 * Las rutas de la juntada. Entran el dueño, con su token, y los invitados que el dueño dejó
 * pasar ([Access]). Armar la trivia, frenarla, llevar la fila de presentaciones y empezar de cero
 * son solo del dueño.
 */
class JuntadaRoutes(
    private val juntada: Juntada,
    private val source: TriviaSource,
    private val files: DemoFiles? = null,
    private val waitMs: Long = UPLOAD_WAIT_MS,
    private val maxWaiting: Int = MAX_WAITING
) {

    /**
     * Los archivos entran de a uno y en orden de llegada: varios celulares mandando a la vez a un
     * equipo de 1 GB se frenan entre todos. El que llega segundo no se rechaza, espera su turno.
     */
    private val turn = Semaphore(1, true)

    /** True mientras hay alguien en escena. */
    fun staged(): Boolean = juntada.staged

    /** [pass] es el pase del invitado que llama. El dueño no tiene. */
    fun handle(path: String, body: JSONObject, owner: Boolean, pass: Int? = null): HttpResponse = try {
        act(path, body, owner, pass)
    } catch (e: JuntadaError) {
        HttpResponse.error(if (e.code == "join") 403 else 409, e.code)
    }

    private fun act(path: String, body: JSONObject, owner: Boolean, pass: Int?): HttpResponse {
        val key = body.optString("key").ifEmpty { null }
        when (path) {
            "state" -> Unit
            "join" -> {
                val person = juntada.join(body.getString("name"), pass)
                return HttpResponse.ok(JSONObject().put("key", person.key).put("id", person.id).put("name", person.name))
            }
            "answer" -> juntada.answer(key, body.getInt("question"), body.getInt("option"))
            "poll" -> juntada.createPoll(
                key, owner, body.getString("question"), strings(body, "options"),
                body.optBoolean("secret"), body.optInt("seconds")
            )
            "vote" -> juntada.vote(key, body.getInt("option"))
            "poll/close" -> juntada.closePoll(key, owner)
            "poll/tiebreak" -> juntada.breakTie(key, owner)
            "expense" -> juntada.addExpense(key, body.getString("payer"), body.getLong("amount"), body.getString("what"), strings(body, "among"))
            "expense/delete" -> juntada.deleteExpense(key, owner, body.getInt("id"))
            "trivia/start" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                val level = Juntada.Level.of(body.optString("level", Juntada.Level.NORMAL.wire)) ?: throw JuntadaError("invalid")
                juntada.startTrivia(
                    body.getString("topic"), body.optInt("count", DEFAULT_QUESTIONS),
                    level, body.optInt("seconds", Juntada.DEFAULT_SECONDS), source
                )
            }
            "trivia/stop" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.stopTrivia()
            }
            "reset" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.reset()
            }
            "demo" -> juntada.signUpDemo(key, owner, body.getString("title"), body.getString("kind"))
            "demo/leave" -> juntada.withdrawDemo(key, owner, body.getInt("id"))
            "demo/start" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.startDemo(if (body.has("id")) body.getInt("id") else null)
            }
            "demo/finish" -> juntada.finishDemo(key, owner)
            "demo/move" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.moveDemo(body.getInt("id"), body.optBoolean("up", true))
            }
            "demo/again" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.requeueDemo(body.getInt("id"))
            }
            "demo/limit" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.demoLimit(body.getInt("minutes"))
            }
            "demo/open" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.demoOpen(body.getBoolean("open"))
            }
            "demo/clap" -> juntada.clapDemo(key, body.getInt("id"), body.optInt("count", 1))
            "demo/rate" -> juntada.rateDemo(key, body.getInt("id"), body.getInt("stars"))
            "demo/key" -> if (!juntada.demoKey(key, owner, body.getString("name"))) return HttpResponse.error(409, "stage_away")
            "demo/source" -> if (!juntada.demoSource(key, owner, body.getString("name"))) return HttpResponse.error(409, "no_source")
            // Antes de mandar el archivo, el celular pregunta si va a entrar: así el aviso llega claro
            // y al instante, y no después de subir cien megas.
            "demo/check" -> {
                accepts(key, owner, body.getInt("id"), body.getString("name"), body.getLong("size"))
                return HttpResponse.ok()
            }
            // El puntero llega muchas veces por segundo: no devuelve el estado entero cada vez.
            "demo/pointer" -> {
                juntada.demoPointer(key, owner, body.unit("x"), body.unit("y"), body.optBoolean("visible", true))
                return HttpResponse.ok()
            }
            else -> return HttpResponse.error(404, "not_found")
        }
        // Cada acción devuelve el estado nuevo: el celular no espera a la próxima consulta.
        return HttpResponse.ok(juntada.state(key, owner))
    }

    /** Lo que tiene que cumplir un archivo para entrar a la fila. Devuelve su nombre limpio y qué es. */
    private fun accepts(key: String?, owner: Boolean, id: Int, rawName: String, length: Long): Pair<String, Demos.Media> {
        val store = files ?: throw HttpError(404, "not_found")
        juntada.checkDemoUpload(key, owner, id)
        val name = Uploads.safeName(rawName) ?: throw HttpError(400, "name")
        val media = Demos.Media.ofName(name) ?: throw HttpError(415, "demo_type")
        if (length <= 0) throw HttpError(411, "length")
        if (length > Demos.MAX_BYTES) throw HttpError(413, "demo_big")
        if (!store.fits(length)) throw HttpError(507, "space")
        return name to media
    }

    /**
     * El archivo de una presentación. Llega en crudo, y quién lo manda va en una cabecera: la
     * clave de cada persona no viaja nunca en la dirección. Antes de leer un solo byte se revisa
     * que le corresponda, que sea algo que la pared sabe mostrar y que entre.
     */
    fun upload(r: HttpRequest, owner: Boolean): HttpResponse = try {
        val store = files ?: throw HttpError(404, "not_found")
        val key = r.header(KEY_HEADER)
        val id = r.query["id"]?.toIntOrNull() ?: throw HttpError(400, "invalid")
        val (name, media) = accepts(key, owner, id, r.query["name"].orEmpty(), r.contentLength)
        // Cada archivo que espera ocupa una conexión. Con demasiados esperando, el que llega
        // vuelve a intentar en un rato: las consultas de los demás celulares no se quedan sin lugar.
        if (turn.queueLength >= maxWaiting) throw HttpError(409, "busy")
        if (!turn.tryAcquire(waitMs, TimeUnit.MILLISECONDS)) throw HttpError(409, "busy")
        try {
            // Mientras esperaba el turno pudo cambiar todo: se vuelve a mirar antes de escribir.
            accepts(key, owner, id, name, r.contentLength)
            juntada.demoReceiving(id)
            store.receive(id, r.contentLength, r.body)
            // Recién acá reemplaza al anterior, y solo si la presentación sigue esperando: con el
            // turno ya dado, la pared está mostrando el archivo que había y ese no se toca.
            juntada.attachDemo(key, owner, id, name, media, r.contentLength) { store.commit(id, name) }
        } catch (e: IOException) {
            // Lo que llegó a medias ya lo borró quien lo estaba recibiendo.
            throw HttpError(400, "incomplete")
        } catch (e: JuntadaError) {
            // La sacaron de la fila mientras subía: no queda nada suelto. Si sigue en la fila, se
            // va solo lo que acaba de llegar.
            if (e.code == "gone") store.drop(id) else store.discard(id)
            throw e
        } finally {
            juntada.demoReceiving(null)
            turn.release()
        }
        HttpResponse.ok(juntada.state(key, owner))
    } catch (e: JuntadaError) {
        HttpResponse.error(if (e.code == "join") 403 else 409, e.code)
    }

    private fun strings(body: JSONObject, name: String): List<String> {
        val array = body.getJSONArray(name)
        if (array.length() > MAX_LIST) throw HttpError(400, "list")
        return (0 until array.length()).map { array.getString(it) }
    }

    companion object {
        const val PREFIX = "/api/juntada/"
        const val UPLOAD = "demo/upload"
        const val KEY_HEADER = "x-gd-key"

        /** Cuánto espera su turno un archivo antes de avisar que hay demasiada fila. */
        private const val UPLOAD_WAIT_MS = 5L * 60 * 1000

        /** Cuántos archivos pueden estar esperando a la vez. */
        private const val MAX_WAITING = 8
        const val DEFAULT_QUESTIONS = 8
        private const val MAX_LIST = 64
    }
}
