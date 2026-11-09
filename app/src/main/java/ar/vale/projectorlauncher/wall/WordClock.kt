package ar.vale.projectorlauncher.wall

/**
 * La hora dicha en castellano rioplatense, en pasos de cinco minutos.
 * [mark] es la palabra que lleva la cinta.
 */
object WordClock {

    data class Phrase(val text: String, val mark: String)

    private val HOURS = listOf(
        "doce", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once"
    )
    private val PAST = mapOf(
        5 to "y cinco", 10 to "y diez", 15 to "y cuarto", 20 to "y veinte", 25 to "y veinticinco", 30 to "y media"
    )
    private val TO = mapOf(
        35 to "menos veinticinco", 40 to "menos veinte", 45 to "menos cuarto", 50 to "menos diez", 55 to "menos cinco"
    )

    fun phrase(hour24: Int, minute: Int): Phrase {
        val total = (hour24 * 60 + minute + 2) / 5 * 5 % (24 * 60)
        val h = total / 60
        val m = total % 60
        if (total == 0) return Phrase("Es medianoche.", "medianoche")
        if (total == 12 * 60) return Phrase("Son las doce del mediodía.", "doce")

        val shownHour = if (m >= 35) (h + 1) % 24 else h
        val word = HOURS[shownHour % 12]
        val start = if (word == "una") "Es la" else "Son las"
        val part = when {
            h < 6 -> "de la madrugada"
            h < 12 -> "de la mañana"
            h < 13 -> "del mediodía"
            h < 20 -> "de la tarde"
            else -> "de la noche"
        }
        val minutes = PAST[m] ?: TO[m]
        val middle = if (minutes == null) word else "$word $minutes"
        return Phrase("$start $middle $part.", word)
    }
}
