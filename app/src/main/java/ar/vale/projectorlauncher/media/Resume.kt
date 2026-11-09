package ar.vale.projectorlauncher.media

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONObject

/** Reglas de «seguí viendo»: qué vale la pena recordar. Separadas para poder probarlas. */
object ResumePolicy {
    private const val MIN_WATCHED_MS = 30_000L
    private const val MIN_LEFT_MS = 60_000L
    private const val MIN_DURATION_MS = 3 * 60_000L

    /** Devuelve la posición para guardar o null si conviene olvidar ese archivo. */
    fun positionToKeep(positionMs: Long, durationMs: Long): Long? {
        if (durationMs < MIN_DURATION_MS) return null
        if (positionMs < MIN_WATCHED_MS) return null
        if (durationMs - positionMs < MIN_LEFT_MS) return null
        return positionMs
    }
}

/** Guarda por dónde ibas en cada video. */
class ResumeStore(context: Context) {

    class Entry(val path: String, val position: Long, val duration: Long, val at: Long)

    private val sp: SharedPreferences = context.getSharedPreferences("gd_resume", Context.MODE_PRIVATE)

    fun position(path: String): Long = entry(path)?.position ?: 0L

    fun update(path: String, positionMs: Long, durationMs: Long) {
        val keep = ResumePolicy.positionToKeep(positionMs, durationMs)
        if (keep == null) {
            sp.edit().remove(path).apply()
            return
        }
        val json = JSONObject().put("p", keep).put("d", durationMs).put("t", System.currentTimeMillis())
        sp.edit().putString(path, json.toString()).apply()
    }

    fun forget(path: String) = sp.edit().remove(path).apply()

    /** Los más recientes primero. */
    fun recent(limit: Int): List<Entry> =
        sp.all.keys.mapNotNull { entry(it) }.sortedByDescending { it.at }.take(limit)

    private fun entry(path: String): Entry? {
        val raw = sp.getString(path, null) ?: return null
        return runCatching {
            val json = JSONObject(raw)
            Entry(path, json.getLong("p"), json.getLong("d"), json.getLong("t"))
        }.getOrNull()
    }
}
