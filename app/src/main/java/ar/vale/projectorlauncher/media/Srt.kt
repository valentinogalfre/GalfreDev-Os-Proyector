package ar.vale.projectorlauncher.media

import java.io.File
import java.nio.ByteBuffer
import java.nio.charset.CharacterCodingException
import java.nio.charset.Charset
import java.nio.charset.CodingErrorAction

/** Subtítulos .srt: los que suelen venir al lado del video en un USB. */
object Srt {

    data class Cue(val startMs: Long, val endMs: Long, val text: String)

    private val TIME = Regex("""(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})""")
    private val TAGS = Regex("""</?[a-zA-Z][^>]*>|\{\\[^}]*\}""")

    fun parse(content: String): List<Cue> {
        val cues = ArrayList<Cue>()
        val lines = content.removePrefix("\uFEFF").replace("\r\n", "\n").replace('\r', '\n').split('\n')
        var i = 0
        while (i < lines.size) {
            val match = TIME.find(lines[i])
            if (match == null) {
                i++
                continue
            }
            val g = match.groupValues
            val start = millis(g[1], g[2], g[3], g[4])
            val end = millis(g[5], g[6], g[7], g[8])
            i++
            val text = StringBuilder()
            while (i < lines.size && lines[i].isNotBlank() && !TIME.containsMatchIn(lines[i])) {
                if (text.isNotEmpty()) text.append('\n')
                text.append(lines[i].replace(TAGS, "").trim())
                i++
            }
            if (end > start && text.isNotBlank()) cues.add(Cue(start, end, text.toString()))
        }
        return cues.sortedBy { it.startMs }
    }

    private fun millis(h: String, m: String, s: String, frac: String): Long =
        h.toLong() * 3_600_000 + m.toLong() * 60_000 + s.toLong() * 1_000 + frac.padEnd(3, '0').toLong()

    /** El subtítulo que corresponde a [ms], o null si en ese momento no hay ninguno. */
    fun at(cues: List<Cue>, ms: Long): Cue? {
        var lo = 0
        var hi = cues.size - 1
        while (lo <= hi) {
            val mid = (lo + hi) ushr 1
            val cue = cues[mid]
            when {
                ms < cue.startMs -> hi = mid - 1
                ms >= cue.endMs -> lo = mid + 1
                else -> return cue
            }
        }
        return null
    }

    /** Decodifica en UTF-8 y, si no lo es, en Windows-1252: casi todos los .srt en español son una de las dos. */
    fun decode(bytes: ByteArray): String = try {
        Charsets.UTF_8.newDecoder()
            .onMalformedInput(CodingErrorAction.REPORT)
            .onUnmappableCharacter(CodingErrorAction.REPORT)
            .decode(ByteBuffer.wrap(bytes))
            .toString()
    } catch (e: CharacterCodingException) {
        String(bytes, Charset.forName("windows-1252"))
    }

    /** Busca `pelicula.srt` o `pelicula.es.srt` junto a `pelicula.mkv`. */
    fun findFor(video: File): File? {
        val base = video.nameWithoutExtension
        return video.parentFile?.listFiles()
            ?.filter { it.extension.equals("srt", ignoreCase = true) && it.name.startsWith(base) }
            ?.minByOrNull { it.name.length }
    }
}
