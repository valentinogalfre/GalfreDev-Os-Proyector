package ar.vale.projectorlauncher.remote

/**
 * El celular maneja el proyector, pero hay cosas que confirma una persona que esté enfrente.
 * Quien tenga el token no puede instalar nada solo: el instalador del sistema no acepta teclas
 * que vengan del celular. Salir sí se puede.
 */
object RemoteGuard {
    fun needsPerson(packageName: CharSequence?): Boolean =
        packageName?.contains("packageinstaller", ignoreCase = true) == true

    /**
     * Lo que Claude no toca. Es más estricto que el celular: el celular lo maneja una persona, y a
     * Claude lo puede querer manejar una página o un texto en pantalla. Ni instalaciones, ni
     * permisos, ni la tienda donde se compra, ni los ajustes del sistema: ahí están el borrado de
     * fábrica, el Wi-Fi y la depuración, que en estos equipos deja sin red. Abrirlos sí puede.
     */
    fun handsOff(packageName: CharSequence?): Boolean {
        val name = packageName?.toString()?.lowercase() ?: return false
        return needsPerson(name) || HANDS_OFF.any { it in name }
    }

    private val HANDS_OFF = listOf("permissioncontroller", "com.android.vending", "com.google.android.gms", ".settings")
}
