package ar.vale.projectorlauncher.remote

import ar.vale.projectorlauncher.juntada.Juntada
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.security.SecureRandom

/**
 * Quién más puede conectarse, además del dueño.
 *
 * El código que se ve en la pared ya no abre nada: solo sirve para pedir permiso. Cada celular
 * que pide recibe un pase propio, que no vale hasta que el dueño lo aprueba. Al aprobar se elige
 * hasta dónde llega: la juntada sola, o también el control. Ningún pase llega a la clave de
 * Claude, a los pedidos a Claude ni a los archivos: eso es solo del dueño.
 */
class Access(
    stored: JSONObject? = null,
    private val now: () -> Long = System::currentTimeMillis,
    private val random: SecureRandom = SecureRandom()
) {

    enum class Level(val wire: String) {
        /** Jugar, votar y anotar gastos. */
        PARTY("party"),

        /** Además, lo que hace el control remoto: flechas, puntero, teclado y abrir apps. */
        CONTROL("control");

        companion object {
            fun of(wire: String): Level? = values().firstOrNull { it.wire == wire }
        }
    }

    /** Un celular que pidió entrar. Sin [level] todavía espera la respuesta. */
    class Device(val id: Int, val name: String, internal val hash: String, val level: Level?, val at: Long, val from: String)

    sealed interface Asked {
        class Pass(val value: String) : Asked
        data object BadName : Asked
        data object Full : Asked
    }

    var onChange: () -> Unit = {}

    /** Va en el código de la pared. Quien no lo vio no puede ni pedir. */
    @Volatile var code: String = newSecret()
        private set

    /** Ya hay un celular con el acceso del dueño: la pantalla Celular deja de mostrar ese código. */
    @Volatile var claimed = false
        private set

    private val devices = ArrayList<Device>()
    private var nextId = 1

    init {
        stored?.let(::restore)
    }

    fun canAsk(header: String?): Boolean {
        val given = bearer(header) ?: return false
        return MessageDigest.isEqual(given.toByteArray(Charsets.UTF_8), code.toByteArray(Charsets.UTF_8))
    }

    /** Anota el pedido y entrega el pase. El pase se guarda como huella: el archivo no sirve para entrar. */
    fun ask(rawName: String, from: String = ""): Asked {
        val name = Juntada.cleanName(rawName) ?: return Asked.BadName
        val pass = newSecret()
        synchronized(this) {
            expire()
            val waiting = devices.filter { it.level == null }
            // Un solo equipo no llena la fila de pedidos ni tapa a los demás.
            if (waiting.size >= MAX_PENDING || waiting.count { it.from == from } >= MAX_PER_ADDRESS) return Asked.Full
            if (devices.size >= MAX_DEVICES) return Asked.Full
            devices.add(Device(nextId++, name, hash(pass), null, now(), from))
        }
        onChange()
        return Asked.Pass(pass)
    }

    /** Hasta dónde llega este pase, o null si no existe o todavía espera. */
    fun level(header: String?): Level? = find(header)?.level

    /** El número de un pase aprobado. La juntada lo usa para que con cada pase entre una sola persona. */
    fun pass(header: String?): Int? = find(header)?.takeIf { it.level != null }?.id

    /** Para el celular que espera: "pending", el nivel que le dieron, o null si el pase no existe. */
    fun status(header: String?): String? = find(header)?.let { it.level?.wire ?: PENDING }

    @Synchronized
    private fun find(header: String?): Device? {
        val given = bearer(header) ?: return null
        expire()
        val wanted = hash(given)
        return devices.firstOrNull { it.hash == wanted }
    }

    @Synchronized
    fun pending(): List<Device> {
        expire()
        return devices.filter { it.level == null }
    }

    @Synchronized
    fun allowed(): List<Device> = devices.filter { it.level != null }

    /** Aprueba con un nivel, lo cambia, o saca al celular si [level] es null. False si ya no estaba. */
    fun decide(id: Int, level: Level?): Boolean {
        synchronized(this) {
            val index = devices.indexOfFirst { it.id == id }
            if (index < 0) return false
            val old = devices[index]
            if (level == null) devices.removeAt(index)
            else devices[index] = Device(old.id, old.name, old.hash, level, old.at, old.from)
        }
        onChange()
        return true
    }

    /** Lo marca la primera vez que alguien usa el acceso del dueño. */
    fun claim() {
        if (claimed) return
        claimed = true
        onChange()
    }

    /** La juntada empieza de cero: se van los invitados y el código viejo deja de servir. */
    fun clearGuests() {
        synchronized(this) {
            devices.clear()
            code = newSecret()
        }
        onChange()
    }

    /** Desconectar a todos: también el dueño tiene que volver a vincularse. */
    fun forgetAll() {
        claimed = false
        clearGuests()
    }

    /** Un pedido que nadie contestó no queda para siempre. */
    private fun expire() {
        val limit = now() - PENDING_MS
        devices.removeAll { it.level == null && it.at < limit }
    }

    // --- Lo que se guarda: los aprobados. Un pedido sin contestar no sobrevive a un apagón. ---

    fun export(): JSONObject = synchronized(this) {
        JSONObject()
            .put("code", code)
            .put("claimed", claimed)
            .put("next", nextId)
            .put("devices", JSONArray(devices.filter { it.level != null }.map {
                JSONObject().put("id", it.id).put("name", it.name).put("hash", it.hash).put("level", it.level!!.wire).put("at", it.at)
            }))
    }

    private fun restore(json: JSONObject) {
        json.optString("code").takeIf { it.length >= SECRET_BYTES * 2 }?.let { code = it }
        claimed = json.optBoolean("claimed")
        val saved = json.optJSONArray("devices") ?: JSONArray()
        for (i in 0 until saved.length()) {
            val d = saved.optJSONObject(i) ?: continue
            val name = Juntada.cleanName(d.optString("name")) ?: continue
            val level = Level.of(d.optString("level")) ?: continue
            val hash = d.optString("hash").takeIf { it.length == HASH_CHARS } ?: continue
            devices.add(Device(d.optInt("id"), name, hash, level, d.optLong("at"), ""))
        }
        nextId = maxOf(json.optInt("next", 1), (devices.maxOfOrNull { it.id } ?: 0) + 1)
    }

    private fun bearer(header: String?): String? {
        if (header == null || !header.startsWith(BEARER)) return null
        return header.substring(BEARER.length).trim().takeIf { it.isNotEmpty() }
    }

    private fun newSecret(): String =
        ByteArray(SECRET_BYTES).also(random::nextBytes).joinToString("") { "%02x".format(it) }

    private fun hash(text: String): String =
        MessageDigest.getInstance("SHA-256").digest(text.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }

    companion object {
        const val PENDING = "pending"
        const val PENDING_MS = 10L * 60 * 1000
        const val MAX_PENDING = 12
        const val MAX_PER_ADDRESS = 2
        const val MAX_DEVICES = 60
        private const val SECRET_BYTES = 24
        private const val HASH_CHARS = 64
        private const val BEARER = "Bearer "
    }
}
