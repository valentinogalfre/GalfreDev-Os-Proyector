package ar.vale.projectorlauncher.remote

import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.InputStream
import java.util.concurrent.atomic.AtomicBoolean

/** Lo que el celular puede pedirle al equipo. Es una interfaz para probar las rutas sin Android. */
interface RemoteDevice {
    enum class Result { OK, NEEDS_ACCESSIBILITY, NEEDS_PERSON, NO_FIELD, NOT_INSTALLED, UNKNOWN, BUSY }

    fun state(): JSONObject
    fun key(name: String): Result
    fun text(value: String, submit: Boolean): Result
    fun link(url: String): Result
    fun upload(name: String, length: Long, body: InputStream): String
    fun saveClaudeKey(key: String): Boolean
    fun askClaude(text: String): Result

    /** Qué está haciendo Claude y qué respondió, para verlo también en el celular. */
    fun claudeState(): JSONObject
    fun stopClaude()
    fun pointer(x: Float, y: Float, visible: Boolean)
    fun tap(x: Float, y: Float): Result
    fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float): Result
    fun apps(): JSONObject
    fun open(pkg: String): Result
    fun fits(length: Long): Boolean

    /**
     * True si lo que está a la vista es solo del dueño: Celular, Ajustes, Claude, o una pantalla
     * del sistema. Un invitado con control no la maneja: solo puede salir de ahí.
     */
    fun privateScreen(): Boolean
}

/** Los archivos fijos de la página. No hay ninguna ruta que lea el disco del equipo. */
fun interface StaticFiles {
    fun open(path: String): HttpResponse?
}

class Router(
    private val pairing: Pairing,
    private val device: RemoteDevice,
    private val party: JuntadaRoutes? = null,
    private val access: Access = Access(),
    private val files: StaticFiles,
    /** Quién atiende a los volantes de la carrera. Sin esto, la ruta no existe. */
    private val race: SocketHandler? = null
) {

    /** Una a la vez: varias en paralelo pasarían cada una por separado el control de espacio. */
    private val uploading = AtomicBoolean()

    /** Una subida autorizada tarda lo que tarde el archivo. Ningún otro pedido tiene por qué demorar. */
    fun isLong(r: HttpRequest): Boolean =
        r.path == "/api/upload" && pairing.authorized(r.header("authorization"))

    /**
     * Si el pedido es un volante que quiere dejar la conexión abierta, quién lo atiende. No lleva
     * token: un navegador no puede ponerle cabeceras a un WebSocket, así que el código de la sala
     * va en el primer mensaje. El origen sí se exige, para que otra página no hable por el usuario.
     */
    fun socket(r: HttpRequest): SocketHandler? {
        if (race == null || r.path != SOCKET_PATH || !WebSocket.wanted(r)) return null
        if (r.header("origin") == null || !sameOrigin(r)) return null
        return race
    }

    fun handle(request: HttpRequest): HttpResponse = try {
        route(request)
    } catch (e: HttpError) {
        HttpResponse.error(e.status, e.message ?: "error")
    } catch (e: JSONException) {
        HttpResponse.error(400, "json")
    }

    private fun route(r: HttpRequest): HttpResponse {
        if (!r.path.startsWith("/api/")) {
            if (r.method != "GET") return HttpResponse.error(405, "method")
            return files.open(r.path) ?: HttpResponse.error(404, "not_found")
        }
        if (r.method != "POST" && r.path !in READS) return HttpResponse.error(405, "method")
        if (!sameOrigin(r)) return HttpResponse.error(403, "origin")
        if (r.path == "/api/pair") return pair(r)
        // El token va en una cabecera, nunca en una cookie: otra página no puede usarlo sin saberlo.
        val header = r.header("authorization")
        if (r.path == "/api/access/ask") return ask(r, header)
        val owner = pairing.authorized(header)
        if (owner) access.claim()
        if (r.path == "/api/access/me") {
            val status = if (owner) OWNER else access.status(header) ?: return HttpResponse.error(401, "unauthorized")
            return HttpResponse.ok(JSONObject().put("level", status))
        }
        // Un pase sin aprobar no abre nada. Aprobado, llega hasta donde el dueño dijo.
        val level = if (owner) null else access.level(header) ?: return HttpResponse.error(401, "unauthorized")
        if (party != null && r.path.startsWith(JuntadaRoutes.PREFIX)) {
            return party.handle(r.path.removePrefix(JuntadaRoutes.PREFIX), json(r), owner)
        }
        if (!owner && (level != Access.Level.CONTROL || r.path !in CONTROL)) return HttpResponse.error(403, "owner")
        // Con el control prestado se maneja lo que se ve, salvo las pantallas que son solo del dueño.
        val hands = { leaving: Boolean -> if (!owner && !leaving && device.privateScreen()) throw HttpError(403, "private") }
        return when (r.path) {
            "/api/state" -> HttpResponse.ok(device.state())
            "/api/apps" -> HttpResponse.ok(device.apps())
            "/api/open" -> result(open(json(r).getString("package"), owner))
            "/api/tap" -> json(r).let {
                hands(false)
                result(device.tap(spot(it, "x"), spot(it, "y")))
            }
            "/api/swipe" -> json(r).let {
                hands(false)
                result(device.swipe(spot(it, "x1"), spot(it, "y1"), spot(it, "x2"), spot(it, "y2")))
            }
            "/api/key" -> json(r).getString("name").let {
                hands(it in LEAVING)
                result(device.key(it))
            }
            "/api/text" -> json(r).let {
                hands(false)
                result(device.text(it.getString("text").take(MAX_TEXT), it.optBoolean("submit")))
            }
            "/api/access/list" -> HttpResponse.ok(devices())
            "/api/access/decide" -> json(r).let {
                val wanted = it.getString("level")
                val to = Access.Level.of(wanted)
                if (to == null && wanted != NONE) throw HttpError(400, "level")
                if (!access.decide(it.getInt("id"), to)) throw HttpError(404, "gone")
                HttpResponse.ok(devices())
            }
            "/api/link" -> result(link(json(r).getString("url")))
            "/api/upload" -> upload(r)
            "/api/claude/key" -> claudeKey(json(r).getString("key"))
            "/api/claude/ask" -> result(device.askClaude(json(r).getString("text").take(MAX_TEXT)))
            "/api/claude/state" -> HttpResponse.ok(device.claudeState())
            "/api/claude/stop" -> {
                device.stopClaude()
                HttpResponse.ok()
            }
            "/api/pointer" -> json(r).let {
                device.pointer(
                    it.getDouble("x").toFloat().coerceIn(0f, 1f),
                    it.getDouble("y").toFloat().coerceIn(0f, 1f),
                    it.optBoolean("visible", true)
                )
                HttpResponse.ok()
            }
            else -> HttpResponse.error(404, "not_found")
        }
    }

    /** Un punto de la pantalla, de 0 a 1. Un toque que cae afuera no se corrige: no se hace. */
    private fun spot(body: JSONObject, name: String): Float {
        val value = body.getDouble(name)
        if (value !in 0.0..1.0) throw HttpError(400, "range")
        return value.toFloat()
    }

    private fun open(pkg: String, owner: Boolean): RemoteDevice.Result {
        if (!PACKAGE.matches(pkg)) throw HttpError(400, "app")
        if (RemoteGuard.needsPerson(pkg)) return RemoteDevice.Result.NEEDS_PERSON
        // Un invitado no abre los ajustes del sistema ni la tienda: ahí no podría hacer nada.
        if (!owner && RemoteGuard.handsOff(pkg)) throw HttpError(403, "private")
        return device.open(pkg)
    }

    /** Pedir permiso: hace falta el código de la pared. Devuelve el pase, que todavía no abre nada. */
    private fun ask(r: HttpRequest, header: String?): HttpResponse {
        if (!access.canAsk(header)) return HttpResponse.error(401, "unauthorized")
        return when (val asked = access.ask(json(r).getString("name"), r.remote)) {
            is Access.Asked.Pass -> HttpResponse.ok(JSONObject().put("pass", asked.value))
            Access.Asked.BadName -> HttpResponse.error(400, "name")
            Access.Asked.Full -> HttpResponse.error(409, "full")
        }
    }

    /** Para el dueño: quién espera y quién ya entró. Nunca lleva un pase. */
    private fun devices(): JSONObject {
        val row = { d: Access.Device -> JSONObject().put("id", d.id).put("name", d.name).put("level", d.level?.wire ?: Access.PENDING) }
        return JSONObject()
            .put("pending", JSONArray(access.pending().map(row)))
            .put("allowed", JSONArray(access.allowed().map(row)))
    }

    /** Un navegador siempre manda Origin en un POST ajeno: si no coincide, no pasa. */
    private fun sameOrigin(r: HttpRequest): Boolean {
        val origin = r.header("origin") ?: return true
        return origin == (if (r.secure) "https://" else "http://") + r.header("host")
    }

    private fun json(r: HttpRequest): JSONObject {
        val type = r.header("content-type").orEmpty()
        // Un formulario ajeno no puede mandar este tipo sin un permiso previo que no damos.
        if (!type.startsWith("application/json")) throw HttpError(415, "json")
        return JSONObject(r.text(MAX_JSON))
    }

    private fun pair(r: HttpRequest): HttpResponse =
        when (val attempt = pairing.tryPin(json(r).getString("pin"), r.remote)) {
            is Pairing.Attempt.Paired -> HttpResponse.ok(JSONObject().put("token", attempt.token))
            is Pairing.Attempt.Wrong -> HttpResponse.json(401, JSONObject().put("error", "pin").put("left", attempt.left))
            is Pairing.Attempt.Locked -> HttpResponse.json(429, JSONObject().put("error", "locked").put("seconds", attempt.seconds))
            Pairing.Attempt.Closed -> HttpResponse.error(423, "closed")
        }

    private fun link(url: String): RemoteDevice.Result {
        val uri = runCatching { java.net.URI(url.trim()) }.getOrNull() ?: throw HttpError(400, "url")
        val web = uri.scheme.equals("https", true) || uri.scheme.equals("http", true)
        if (!web || uri.host.isNullOrEmpty()) throw HttpError(400, "url")
        return device.link(url.trim())
    }

    private fun upload(r: HttpRequest): HttpResponse {
        val name = Uploads.safeName(r.query["name"].orEmpty()) ?: throw HttpError(400, "name")
        if (r.contentLength <= 0) throw HttpError(411, "length")
        if (!device.fits(r.contentLength)) throw HttpError(507, "space")
        if (!uploading.compareAndSet(false, true)) throw HttpError(409, "busy")
        try {
            return HttpResponse.ok(JSONObject().put("name", device.upload(name, r.contentLength, r.body)))
        } finally {
            uploading.set(false)
        }
    }

    private fun claudeKey(key: String): HttpResponse {
        val clean = key.trim()
        if (!clean.startsWith("sk-ant-") || clean.length !in 24..512) throw HttpError(400, "key")
        return HttpResponse.ok(JSONObject().put("stored", device.saveClaudeKey(clean)))
    }

    private fun result(result: RemoteDevice.Result): HttpResponse = when (result) {
        RemoteDevice.Result.OK -> HttpResponse.ok()
        RemoteDevice.Result.NEEDS_ACCESSIBILITY -> HttpResponse.error(409, "accessibility")
        RemoteDevice.Result.NEEDS_PERSON -> HttpResponse.error(403, "person")
        RemoteDevice.Result.NO_FIELD -> HttpResponse.error(409, "no_field")
        RemoteDevice.Result.NOT_INSTALLED -> HttpResponse.error(404, "not_installed")
        RemoteDevice.Result.UNKNOWN -> HttpResponse.error(400, "unknown")
        RemoteDevice.Result.BUSY -> HttpResponse.error(409, "claude_busy")
    }

    private companion object {
        const val MAX_JSON = 16 * 1024
        const val MAX_TEXT = 4000
        const val OWNER = "owner"
        const val NONE = "none"
        const val SOCKET_PATH = "/api/carrera/socket"
        val READS = setOf("/api/state", "/api/apps", "/api/claude/state", "/api/access/list")

        /** Lo que alcanza un invitado con control: lo mismo que el control remoto, y nada más. */
        val CONTROL = setOf("/api/state", "/api/apps", "/api/open", "/api/tap", "/api/swipe", "/api/key", "/api/text", "/api/pointer")

        /** Salir se puede siempre, también de una pantalla que no se maneja. */
        val LEAVING = setOf("back", "home")
        val PACKAGE = Regex("[A-Za-z][A-Za-z0-9_]*(\\.[A-Za-z][A-Za-z0-9_]*)+")
    }
}
