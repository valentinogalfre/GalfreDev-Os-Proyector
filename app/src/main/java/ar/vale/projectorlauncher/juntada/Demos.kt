package ar.vale.projectorlauncher.juntada

import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.MediaTypes
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * Lo que la fila de presentaciones le pide a la pared. Siempre se llama fuera del candado de la
 * juntada: abrir una pantalla puede tardar, y la pared también le habla a la juntada.
 */
interface Stage {
    /** Pone en la pared lo que se va a mostrar. Devuelve false si no pudo: la presentación no empieza. */
    fun open(demo: Demos.Shown): Boolean

    /** Saca de la pared lo que estaba mostrando y vuelve al tablero. */
    fun close(id: Int)

    /** Una tecla de quien presenta: [Demos.KEYS]. False si la pared está en otra cosa. */
    fun key(id: Int, name: String): Boolean

    fun pointer(id: Int, x: Float, y: Float, visible: Boolean)

    /** Por dónde puede entrar la pantalla de quien muestra la suya: los [Demos.SOURCES] que hay acá. */
    fun sources(): List<String> = emptyList()

    /** Pone la pared a recibir esa pantalla. False si este equipo no tiene esa entrada. */
    fun source(id: Int, name: String): Boolean = false

    /** Se cumplió el tiempo. Se avisa una sola vez y no se corta a nadie. */
    fun timeUp(name: String)
}

/**
 * La fila de presentaciones de una muestra de demos: quién muestra qué, en qué orden, quién está
 * en escena y qué le pareció a la sala.
 *
 * Hay una sola persona en escena por vez. Mientras presenta, la pared la manejan ella y el dueño
 * del proyector, y nadie más. Los archivos no se pisan: cada presentación guarda el suyo aparte, y
 * recién aparece en la pared cuando le llega el turno.
 *
 * No tiene candado propio: [Juntada] la usa con el suyo.
 */
class Demos(private val now: () -> Long) {

    enum class Kind(val wire: String) {
        /** Manda un archivo y la pared lo muestra. */
        FILE("file"),

        /** Muestra su propia pantalla, por HDMI o duplicándola: la pared solo le guarda el turno. */
        SCREEN("screen");

        companion object {
            fun of(wire: String): Kind? = values().firstOrNull { it.wire == wire }
        }
    }

    enum class Media(val wire: String) {
        PDF("pdf"), IMAGE("image"), VIDEO("video");

        companion object {
            fun of(wire: String?): Media? = values().firstOrNull { it.wire == wire }

            /** Lo que la pared sabe mostrar, por la extensión. Lo demás no entra a la fila. */
            fun ofName(name: String): Media? = when (MediaTypes.kindOf(File(name))) {
                FileKind.PDF -> PDF
                FileKind.IMAGE -> IMAGE
                FileKind.VIDEO -> VIDEO
                else -> null
            }
        }
    }

    enum class State(val wire: String) { WAITING("waiting"), LIVE("live"), DONE("done") }

    class Entry(val id: Int, val by: String, val name: String, val title: String, val kind: Kind) {
        var file: String? = null
        var media: Media? = null
        var size = 0L
        var state = State.WAITING
        var startedAt = 0L
        var endedAt = 0L
        var warned = false

        /** Aplausos de cada persona. Tienen tope: un celular no decide el podio a fuerza de toques. */
        val claps = HashMap<String, Int>()

        /** El voto de cada persona, de 1 a 5. */
        val stars = HashMap<String, Int>()

        val applause: Int get() = claps.values.sum()
        val average: Double get() = if (stars.isEmpty()) 0.0 else stars.values.sum().toDouble() / stars.size
    }

    /** Lo que la pared necesita para mostrarla. */
    class Shown(val id: Int, val name: String, val title: String, val file: String?, val media: Media?)

    private val entries = ArrayList<Entry>()
    private var next = 1

    /** Con la fila cerrada no se anota nadie más: lo decide el dueño cuando arranca la muestra. */
    var open = true
        private set

    /** Minutos por presentación. Cero es sin límite. */
    var limitMin = 0
        private set

    val live: Entry? get() = entries.firstOrNull { it.state == State.LIVE }

    /**
     * De quién es el archivo que está entrando ahora. Los demás esperan su turno, y sus celulares
     * lo dicen así en vez de mostrar una barra quieta. No se guarda: un apagón corta la subida.
     */
    var receiving: Int? = null

    val ids: List<Int> get() = entries.map { it.id }

    /** Cada presentación con archivo, y cuál es. */
    fun files(): List<Pair<Int, String>> = entries.mapNotNull { e -> e.file?.let { e.id to it } }

    private fun find(id: Int): Entry = entries.firstOrNull { it.id == id } ?: throw JuntadaError("gone")

    /** La maneja quien la presenta, y el dueño del proyector. */
    fun mine(entry: Entry, person: Juntada.Person?, owner: Boolean) = owner || (person != null && entry.by == person.id)

    // --- Anotarse ---

    /** Cada persona tiene una sola presentación esperando: la fila es de todos. */
    fun signUp(person: Juntada.Person, owner: Boolean, rawTitle: String, kind: Kind): Entry {
        if (!open && !owner) throw JuntadaError("demo_closed")
        if (entries.any { it.by == person.id && it.state != State.DONE }) throw JuntadaError("demo_have")
        if (entries.size >= MAX_DEMOS) throw JuntadaError("full")
        val title = Juntada.clean(rawTitle, MAX_TITLE).ifEmpty { throw JuntadaError("invalid") }
        return Entry(next++, person.id, person.name, title, kind).also(entries::add)
    }

    /** Se baja quien se anotó, o lo saca el dueño. A quien está en escena primero hay que terminarle el turno. */
    fun withdraw(person: Juntada.Person?, owner: Boolean, id: Int): Entry {
        val entry = find(id)
        if (!mine(entry, person, owner)) throw JuntadaError("not_allowed")
        if (entry.state == State.LIVE) throw JuntadaError("demo_live")
        entries.remove(entry)
        return entry
    }

    /** Si esta presentación puede recibir un archivo ahora: es de quien lo manda y todavía espera. */
    fun uploadable(person: Juntada.Person?, owner: Boolean, id: Int): Entry {
        val entry = find(id)
        if (!mine(entry, person, owner)) throw JuntadaError("not_allowed")
        if (entry.kind != Kind.FILE) throw JuntadaError("invalid")
        if (entry.state != State.WAITING) throw JuntadaError("demo_live")
        return entry
    }

    /** El archivo ya está guardado. Reemplaza al anterior: cada presentación muestra uno solo. */
    fun attach(person: Juntada.Person?, owner: Boolean, id: Int, file: String, media: Media, size: Long) {
        val entry = uploadable(person, owner, id)
        entry.file = file
        entry.media = media
        entry.size = size
    }

    /** El archivo ya no está en el disco: la presentación sigue en la fila, y hay que mandarlo de nuevo. */
    fun detach(id: Int) {
        entries.firstOrNull { it.id == id }?.let {
            it.file = null
            it.media = null
            it.size = 0
        }
    }

    // --- El escenario ---

    /** Empieza la que se pide o, sin pedir ninguna, la primera que espera. Nunca hay dos en escena. */
    fun start(id: Int?): Entry {
        if (live != null) throw JuntadaError("stage_busy")
        val entry = if (id != null) find(id) else entries.firstOrNull { it.state == State.WAITING } ?: throw JuntadaError("demo_none")
        if (entry.state != State.WAITING) throw JuntadaError("closed")
        if (entry.kind == Kind.FILE && entry.file == null) throw JuntadaError("demo_no_file")
        entry.state = State.LIVE
        entry.startedAt = now()
        entry.warned = false
        return entry
    }

    /** La pared no pudo abrirla: vuelve a su lugar en la fila, como si nada. */
    fun unstart(id: Int) {
        entries.firstOrNull { it.id == id && it.state == State.LIVE }?.state = State.WAITING
    }

    /** Termina el turno quien presenta o el dueño. */
    fun finish(person: Juntada.Person?, owner: Boolean): Entry {
        val entry = live ?: throw JuntadaError("closed")
        if (!mine(entry, person, owner)) throw JuntadaError("stage")
        entry.state = State.DONE
        entry.endedAt = now()
        return entry
    }

    /**
     * Se cortó antes de tiempo, o la quieren ver otra vez: vuelve a esperar, primera en la fila,
     * con su archivo y con los votos que ya tenía.
     */
    fun requeue(id: Int) {
        val entry = find(id)
        if (entry.state != State.DONE) throw JuntadaError("closed")
        if (entries.any { it.by == entry.by && it.state != State.DONE }) throw JuntadaError("demo_have")
        entry.state = State.WAITING
        entry.startedAt = 0
        entry.endedAt = 0
        entry.warned = false
        entries.remove(entry)
        val first = entries.indexOfFirst { it.state == State.WAITING }
        entries.add(if (first < 0) entries.size else first, entry)
    }

    /** Quien presenta ahora, si [person] puede manejar la pared: solo ella y el dueño. */
    fun controlled(person: Juntada.Person?, owner: Boolean): Entry {
        val entry = live ?: throw JuntadaError("closed")
        if (!mine(entry, person, owner)) throw JuntadaError("stage")
        return entry
    }

    /** El nombre de quien presenta, la primera vez que se le cumple el tiempo. Después, null. */
    fun timeUp(): String? {
        val entry = live ?: return null
        if (limitMin == 0 || entry.warned || now() - entry.startedAt < limitMin * MINUTE_MS) return null
        entry.warned = true
        return entry.name
    }

    // --- El orden ---

    /** Sube o baja un lugar entre las que esperan. Las que ya pasaron no se mueven. */
    fun move(id: Int, up: Boolean) {
        val entry = find(id)
        if (entry.state != State.WAITING) throw JuntadaError("closed")
        val waiting = entries.filter { it.state == State.WAITING }
        val other = waiting.getOrNull(waiting.indexOf(entry) + if (up) -1 else 1) ?: return
        val a = entries.indexOf(entry)
        val b = entries.indexOf(other)
        entries[a] = other
        entries[b] = entry
    }

    fun setLimit(minutes: Int) {
        if (minutes !in 0..MAX_LIMIT_MIN) throw JuntadaError("invalid")
        limitMin = minutes
    }

    fun setOpen(value: Boolean) {
        open = value
    }

    // --- La sala ---

    /** Se aplaude a quien está en escena y un rato después de que termina. Nadie se aplaude solo. */
    fun clap(person: Juntada.Person, id: Int, count: Int) {
        val entry = find(id)
        if (entry.by == person.id) throw JuntadaError("demo_own")
        if (!clapping(entry)) throw JuntadaError("closed")
        val added = count.coerceIn(1, CLAP_BATCH)
        entry.claps[person.id] = minOf(CLAP_CAP, (entry.claps[person.id] ?: 0) + added)
    }

    private fun clapping(entry: Entry): Boolean =
        entry.state == State.LIVE || (entry.state == State.DONE && now() - entry.endedAt <= CLAP_MS)

    /** Se vota de 1 a 5 cuando terminó. Se puede cambiar de idea, y nadie se vota solo. */
    fun rate(person: Juntada.Person, id: Int, stars: Int) {
        val entry = find(id)
        if (entry.by == person.id) throw JuntadaError("demo_own")
        if (entry.state != State.DONE) throw JuntadaError("closed")
        if (stars !in 1..MAX_STARS) throw JuntadaError("invalid")
        entry.stars[person.id] = stars
    }

    /** Empieza de cero. Devuelve las que había, para borrar sus archivos. */
    fun clear(): List<Int> {
        val gone = ids
        entries.clear()
        next = 1
        open = true
        limitMin = 0
        return gone
    }

    // --- Lo que se ve ---

    /**
     * El podio: primero el promedio de votos; si empatan, quién tuvo más votos y más aplausos.
     * Sin votos el promedio es cero, y el voto más bajo es uno: quien no fue votado queda al final.
     */
    private fun podium(): List<Entry> = entries.filter { it.state == State.DONE }
        .sortedWith(
            compareByDescending<Entry> { it.average }
                .thenByDescending { it.stars.size }
                .thenByDescending { it.applause }
                .thenBy { it.id }
        )

    fun json(me: Juntada.Person?, owner: Boolean): JSONObject {
        val thanks = entries.filter { it.state == State.DONE && now() - it.endedAt <= CLAP_MS }.maxByOrNull { it.endedAt }
        val out = JSONObject()
            .put("open", open)
            .put("limit_min", limitMin)
            .put("max_mb", MAX_BYTES / MB)
            .put("list", JSONArray(entries.map { entryJson(it, me, owner) }))
            .put("podium", JSONArray(podium().map { it.id }))
            .put("thanks", thanks?.id ?: JSONObject.NULL)
            .put("thanks_left_ms", thanks?.let { CLAP_MS - (now() - it.endedAt) } ?: 0L)
            .put("receiving", receiving ?: JSONObject.NULL)
        val current = live
        out.put(
            "live",
            if (current == null) JSONObject.NULL else JSONObject()
                .put("id", current.id)
                .put("elapsed_ms", now() - current.startedAt)
                .put("limit_ms", limitMin * MINUTE_MS)
                .put("control", mine(current, me, owner))
        )
        return out
    }

    /** Cómo se llama el archivo lo ven quien lo mandó y el dueño. A los demás les alcanza con saber que está. */
    private fun entryJson(e: Entry, me: Juntada.Person?, owner: Boolean): JSONObject = JSONObject()
        .put("id", e.id)
        .put("by", e.by)
        .put("name", e.name)
        .put("title", e.title)
        .put("kind", e.kind.wire)
        .put("media", e.media?.wire ?: JSONObject.NULL)
        .put("file", e.file?.takeIf { owner || me?.id == e.by } ?: JSONObject.NULL)
        .put("size", e.size)
        .put("state", e.state.wire)
        .put("claps", e.applause)
        .put("votes", e.stars.size)
        .put("stars", if (e.stars.isEmpty()) JSONObject.NULL else Math.round(e.average * 10) / 10.0)
        .put("mine", me != null && me.id == e.by)
        .put("my_stars", me?.let { e.stars[it.id] } ?: JSONObject.NULL)

    // --- Lo que se guarda: la fila, los votos y los aplausos ya cerrados. Quien estaba en escena vuelve a esperar. ---

    fun export(): JSONObject = JSONObject()
        .put("next", next)
        .put("open", open)
        .put("limit", limitMin)
        .put("list", JSONArray(entries.map { e ->
            JSONObject()
                .put("id", e.id).put("by", e.by).put("name", e.name).put("title", e.title).put("kind", e.kind.wire)
                .put("file", e.file ?: JSONObject.NULL).put("media", e.media?.wire ?: JSONObject.NULL).put("size", e.size)
                .put("done", e.state == State.DONE)
                .put("stars", JSONObject(e.stars as Map<*, *>))
                // Mientras se aplaude el número cambia con cada toque: se guarda cuando ya quedó quieto.
                .put("claps", if (e.state == State.DONE && !clapping(e)) JSONObject(e.claps as Map<*, *>) else JSONObject())
        }))

    fun restore(json: JSONObject, people: Map<String, String>) {
        open = json.optBoolean("open", true)
        limitMin = json.optInt("limit").takeIf { it in 0..MAX_LIMIT_MIN } ?: 0
        val saved = json.optJSONArray("list") ?: JSONArray()
        for (i in 0 until saved.length()) {
            val e = saved.optJSONObject(i) ?: continue
            val kind = Kind.of(e.optString("kind")) ?: continue
            val title = Juntada.clean(e.optString("title"), MAX_TITLE)
            val by = e.optString("by")
            val id = e.optInt("id")
            if (id <= 0 || title.isEmpty() || by !in people || entries.any { it.id == id }) continue
            val entry = Entry(id, by, people.getValue(by), title, kind)
            val media = Media.of(e.optString("media"))
            if (kind == Kind.FILE && media != null && !e.isNull("file")) {
                entry.file = e.optString("file")
                entry.media = media
                entry.size = e.optLong("size")
            }
            if (e.optBoolean("done")) entry.state = State.DONE
            readCounts(e.optJSONObject("stars"), people, 1..MAX_STARS, entry.stars)
            readCounts(e.optJSONObject("claps"), people, 1..CLAP_CAP, entry.claps)
            entries.add(entry)
        }
        next = maxOf(json.optInt("next", 1), (entries.maxOfOrNull { it.id } ?: 0) + 1)
    }

    private fun readCounts(json: JSONObject?, people: Map<String, String>, range: IntRange, into: HashMap<String, Int>) {
        json ?: return
        for (id in json.keys()) {
            val value = json.optInt(id)
            if (id in people && value in range) into[id] = value
        }
    }

    companion object {
        const val MAX_DEMOS = 40
        const val MAX_TITLE = 60
        const val MAX_STARS = 5
        const val MAX_LIMIT_MIN = 60
        const val MB = 1024L * 1024
        const val MAX_BYTES = 300 * MB

        /** Cuánto se sigue aplaudiendo después de que alguien termina. */
        const val CLAP_MS = 30_000L
        const val CLAP_CAP = 60
        const val CLAP_BATCH = 20
        private const val MINUTE_MS = 60_000L

        /** Lo que alcanza quien presenta: pasar, volver, pausar y dejar la imagen en negro. */
        val KEYS = setOf("left", "right", "ok", "black")

        /** Sin cable (AirPlay, Miracast) o por el cable HDMI. */
        val SOURCES = setOf("cast", "hdmi")
    }
}
