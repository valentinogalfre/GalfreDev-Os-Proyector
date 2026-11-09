package ar.vale.projectorlauncher.remote

import android.content.Context
import org.json.JSONObject
import java.io.File

/** Los permisos de este equipo: uno solo, compartido por el servidor y las pantallas. Sobrevive a un apagón. */
object AccessHub {

    private const val FILE = "access.json"
    private var instance: Access? = null
    private var saved: String? = null

    @Synchronized
    fun get(context: Context): Access {
        instance?.let { return it }
        val file = File(context.applicationContext.filesDir, FILE)
        val stored = runCatching { JSONObject(file.readText()) }.getOrNull()
        val created = Access(stored)
        saved = stored?.toString()
        created.onChange = { save(created, file) }
        // El código recién creado también se guarda: el de la pared sigue sirviendo al reiniciar.
        save(created, file)
        instance = created
        return created
    }

    /** Solo escribe si cambió algo de lo que se guarda: un pedido sin contestar no toca el disco. */
    @Synchronized
    private fun save(access: Access, file: File) {
        val text = access.export().toString()
        if (text == saved) return
        runCatching {
            val partial = File(file.parentFile, "$FILE.part")
            partial.writeText(text)
            check(partial.renameTo(file))
        }.onSuccess { saved = text }
    }
}
