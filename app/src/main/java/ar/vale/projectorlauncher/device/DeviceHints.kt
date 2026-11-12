package ar.vale.projectorlauncher.device

/**
 * Reconoce, por el nombre, las apps de fábrica que importan para ver algo desde el celular: las
 * que reciben la pantalla (AirPlay, Miracast, DLNA) y las que cambian a la entrada HDMI. Cada
 * fabricante las llama distinto, así que se busca por las palabras que casi todos usan.
 */
object DeviceHints {

    /**
     * «cast» suelto también está en podcast, broadcast y forecast: solo vale como palabra entera,
     * o pegado a algo que no deja dudas.
     */
    private val CAST = Regex(
        "air ?play|air ?pin|air ?screen|air ?receiver|mira ?cast|\\bwfd|wi-?fi ?display|hpplay|happy ?cast|\\blebo|" +
            "\\be ?share|dlna|chrome ?cast|google ?cast|screen ?cast|cast ?bay|cast ?receiver|ios ?cast|\\bcast\\b|" +
            "mirror|multi ?screen|screen ?share|duplicar",
        RegexOption.IGNORE_CASE
    )
    private val INPUT = Regex("hdmi|tv ?input|tvinput|source|signal|entrada|fuente", RegexOption.IGNORE_CASE)

    /** Nuestras y del sistema, que coinciden con las palabras y no reciben nada. */
    private val NOT_CAST = setOf("com.google.android.gms", "com.android.providers.media", "ar.vale.projectorlauncher")

    fun casts(pkg: String, label: String): Boolean =
        pkg !in NOT_CAST && !pkg.startsWith("com.android.") && (CAST.containsMatchIn(pkg) || CAST.containsMatchIn(label))

    fun switchesInput(pkg: String, label: String): Boolean =
        pkg != "ar.vale.projectorlauncher" && (INPUT.containsMatchIn(pkg) || INPUT.containsMatchIn(label)) &&
            !pkg.startsWith("com.android.providers") && !pkg.contains("resource", ignoreCase = true)
}
