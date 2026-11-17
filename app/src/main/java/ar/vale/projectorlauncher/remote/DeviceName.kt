package ar.vale.projectorlauncher.remote

import android.content.Context
import android.os.Build
import android.provider.Settings

/** Nombre del equipo para mostrarle al usuario: el que le puso en Android, y si no hay, el modelo. */
object DeviceName {

    /** Primer candidato que no sea nulo ni vacío ni solo espacios, recortado. */
    fun pick(systemName: String?, model: String?): String =
        listOf(systemName, model).firstNotNullOfOrNull { it?.trim()?.takeIf(String::isNotEmpty) }.orEmpty()

    fun of(context: Context): String = pick(
        runCatching { Settings.Global.getString(context.contentResolver, Settings.Global.DEVICE_NAME) }.getOrNull(),
        Build.MODEL
    )
}
