package ar.vale.projectorlauncher.remote

/** Control total en los equipos que no traen la pantalla de Accesibilidad. */
internal object FullControl {

    /** Los mismos dos comandos de la guía, que son los que se probaron en Android 9. */
    fun adbCommands(component: String): String =
        "adb shell settings put secure enabled_accessibility_services $component\n" +
            "adb shell settings put secure accessibility_enabled 1"
}
