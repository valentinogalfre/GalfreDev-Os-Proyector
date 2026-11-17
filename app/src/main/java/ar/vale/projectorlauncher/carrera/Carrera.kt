package ar.vale.projectorlauncher.carrera

import ar.vale.projectorlauncher.juntada.Juntada
import ar.vale.projectorlauncher.remote.Channel
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.security.MessageDigest
import java.security.SecureRandom

/**
 * La sala de la carrera. No sabe nada del juego: lleva quién está, le pasa a la pared lo que
 * manda cada volante y a los volantes lo que dice la pared. La carrera en sí corre en la pared.
 *
 * Hay dos maneras de entrar y ninguna abre nada más que esto:
 * - la pared, con un secreto que solo conoce la pantalla Carrera y solo desde el mismo equipo;
 * - un celular, con el código del QR, que vale mientras la pantalla Carrera está abierta.
 *
 * El celular del dueño del proyector entra además con un pase de mando, que solo sirve acá: lo deja manejar
 * la sala aunque no haya sido el primero en entrar. No es su clave del control remoto ni se parece a ella.
 */
class Carrera(private val random: SecureRandom = SecureRandom(), private val now: () -> Long = System::currentTimeMillis) {

    class Room(val code: String, val hostSecret: String, val leadTicket: String)

    private class Player(val id: Int, var name: String, val key: String, val from: String) {
        var channel: Channel? = null
        /** Entró con el pase de mando: es el celular del dueño del proyector. */
        var boss = false
        var leftAt = 0L
        /** Para no dejar pasar más mensajes por segundo de los que un volante necesita. */
        var windowStart = 0L
        var inWindow = 0
    }

    @Volatile var room: Room? = null
        private set
    private val players = ArrayList<Player>()
    private var host: Channel? = null
    private var nextId = 1
    /** Lo último que la pared le dijo a todos: quien entra tarde lo recibe al llegar. */
    private var lastForAll: String? = null

    /** Abre una sala nueva. La anterior, si había, se cierra con todos adentro. */
    fun open(): Room {
        close()
        return Room(secret(CODE_BYTES), secret(SECRET_BYTES), secret(SECRET_BYTES)).also { room = it }
    }

    fun close() {
        val gone = synchronized(this) {
            room = null
            lastForAll = null
            nextId = 1
            (players.mapNotNull { it.channel } + listOfNotNull(host)).also {
                players.clear()
                host = null
            }
        }
        gone.forEach { it.close() }
    }

    /** Atiende una conexión hasta que se corta. El primer mensaje dice quién es. */
    fun serve(channel: Channel, remote: String) {
        try {
            val hello = parse(channel.read()) ?: return
            when (hello.optString("t")) {
                "host" -> host(channel, hello, remote)
                "join" -> phone(channel, hello, remote)
            }
        } finally {
            channel.close()
        }
    }

    private fun host(channel: Channel, hello: JSONObject, remote: String) {
        val current = room ?: return
        if (!loopback(remote) || !same(hello.optString("secret"), current.hostSecret)) return
        val old = synchronized(this) { host.also { host = channel } }
        old?.close()
        channel.send(roster().toString())
        tellPhones(JSONObject().put("t", "host").put("on", true).toString())
        try {
            while (true) {
                val message = parse(channel.read() ?: break) ?: continue
                when (message.optString("t")) {
                    "all" -> message.optJSONObject("d")?.let { data ->
                        val text = JSONObject().put("t", "all").put("d", data).toString()
                        synchronized(this) { lastForAll = text }
                        tellPhones(text)
                    }
                    // La carrera cuadro a cuadro, para que cada celular la dibuje. Va como texto ya armado: son
                    // muchos por segundo y no se guardan, al que entra tarde le llega el siguiente.
                    "st" -> message.optString("d").takeIf { it.isNotEmpty() && it.length <= STATE_CHARS }?.let { state ->
                        tellPhones(JSONObject().put("t", "st").put("d", state).toString())
                    }
                    "to" -> message.optJSONObject("d")?.let { data ->
                        val to = synchronized(this) { players.firstOrNull { it.id == message.optInt("id") }?.channel }
                        to?.send(JSONObject().put("t", "you").put("d", data).toString())
                    }
                    "drop" -> drop(message.optInt("id"))
                }
            }
        } finally {
            val mine = synchronized(this) { (host === channel).also { if (it) host = null } }
            if (mine) tellPhones(JSONObject().put("t", "host").put("on", false).toString())
        }
    }

    private fun phone(channel: Channel, hello: JSONObject, remote: String) {
        val current = room
        if (current == null || !same(hello.optString("room"), current.code)) {
            channel.send(error("room"))
            return
        }
        val name = Juntada.cleanName(hello.optString("name"))
        if (name == null) {
            channel.send(error("name"))
            return
        }
        val old: Channel?
        val player: Player
        val catchUp: String?
        synchronized(this) {
            // Con su clave, un celular que se cayó vuelve a su mismo auto.
            val known = hello.optString("key").takeIf { it.isNotEmpty() }?.let { key -> players.firstOrNull { same(it.key, key) } }
            if (known == null && !makeRoom(remote)) {
                channel.send(error("full"))
                return
            }
            player = known ?: Player(nextId++, name, secret(SECRET_BYTES), remote).also(players::add)
            player.name = name
            if (same(hello.optString("lead"), current.leadTicket)) player.boss = true
            old = player.channel
            player.channel = channel
            catchUp = lastForAll
        }
        old?.replace()
        channel.send(JSONObject().put("t", "joined").put("id", player.id).put("key", player.key).put("name", player.name).toString())
        catchUp?.let(channel::send)
        tellHost(roster().toString())
        try {
            while (true) {
                val message = parse(channel.read() ?: break) ?: continue
                if (!allow(player)) continue
                when (message.optString("t")) {
                    // El giro llega acotado: la pared no tiene que desconfiar de cada número.
                    "in" -> tellHost(
                        JSONObject().put("t", "in").put("id", player.id)
                            .put("s", message.optDouble("s", 0.0).let { if (it.isNaN()) 0.0 else it.coerceIn(-1.0, 1.0) })
                            .put("b", message.optInt("b") != 0).put("n", message.optInt("n") != 0)
                            .put("k", message.optInt("k") != 0).toString()
                    )
                    "cmd" -> message.optJSONObject("d")?.let { tellHost(JSONObject().put("t", "cmd").put("id", player.id).put("d", it).toString()) }
                    "ping" -> channel.send(JSONObject().put("t", "pong").put("n", message.optLong("n")).toString())
                    // Se va por su cuenta: deja el lugar y su clave ya no vale.
                    // Si otra conexión ya tomó su lugar, la que se despide es la vieja y no se lleva a nadie.
                    "leave" -> {
                        if (synchronized(this) { player.channel === channel }) drop(player.id, told = false)
                        return
                    }
                }
            }
        } finally {
            val mine = synchronized(this) {
                (player.channel === channel).also {
                    if (it) {
                        player.channel = null
                        player.leftAt = now()
                    }
                }
            }
            if (mine) tellHost(roster().toString())
        }
    }

    /** Hace lugar para uno más, si se puede: saca al que hace más tiempo que se fue. */
    private fun makeRoom(remote: String): Boolean {
        if (players.count { it.from == remote && it.channel != null } >= MAX_PER_ADDRESS) return false
        if (players.size < MAX_PLAYERS) return true
        val gone = players.filter { it.channel == null }.minByOrNull { it.leftAt } ?: return false
        return players.remove(gone)
    }

    /** Saca a uno de la sala. Si lo sacó otro se le avisa antes de cortar, para que su celular no vuelva a entrar solo. */
    private fun drop(id: Int, told: Boolean = true) {
        val channel = synchronized(this) {
            val player = players.firstOrNull { it.id == id } ?: return
            players.remove(player)
            player.channel
        }
        if (told) channel?.send(error("out"))
        channel?.close()
        tellHost(roster().toString())
    }

    private fun allow(player: Player): Boolean {
        val time = now()
        if (time - player.windowStart >= 1000) {
            player.windowStart = time
            player.inWindow = 0
        }
        return ++player.inWindow <= MAX_PER_SECOND
    }

    @Synchronized
    private fun roster(): JSONObject = JSONObject().put("t", "roster").put(
        "players", JSONArray(players.map { JSONObject().put("id", it.id).put("name", it.name).put("on", it.channel != null).put("boss", it.boss) })
    )

    private fun tellHost(text: String) {
        synchronized(this) { host }?.send(text)
    }

    private fun tellPhones(text: String) {
        synchronized(this) { players.mapNotNull { it.channel } }.forEach { it.send(text) }
    }

    private fun parse(text: String?): JSONObject? = text?.let {
        try {
            JSONObject(it)
        } catch (e: JSONException) {
            null
        }
    }

    private fun error(code: String) = JSONObject().put("t", "error").put("code", code).toString()

    private fun same(given: String, wanted: String) =
        MessageDigest.isEqual(given.toByteArray(Charsets.UTF_8), wanted.toByteArray(Charsets.UTF_8))

    private fun secret(bytes: Int): String = ByteArray(bytes).also(random::nextBytes).joinToString("") { "%02x".format(it) }

    companion object {
        const val MAX_PLAYERS = 8
        /** Dos volantes por dirección: alcanza para un celular y su reconexión, no para llenar la sala. */
        const val MAX_PER_ADDRESS = 2
        /** Un volante manda treinta por segundo. El resto se descarta. */
        const val MAX_PER_SECOND = 90
        /** Lo más largo que puede ser un cuadro de la carrera: ocho autos entran en menos de la mitad. */
        const val STATE_CHARS = 1024
        private const val CODE_BYTES = 8
        private const val SECRET_BYTES = 24

        fun loopback(address: String) = address == "127.0.0.1" || address == "::1" || address == "0:0:0:0:0:0:0:1"
    }
}
