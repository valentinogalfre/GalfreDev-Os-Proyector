package ar.vale.projectorlauncher.claude

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Guarda la clave de la API cifrada con el almacén de claves del sistema.
 *
 * Si el firmware tiene roto ese almacén, la clave queda solo en memoria hasta apagar: nunca se
 * guarda en texto plano. El respaldo automático está apagado en el manifiesto por lo mismo.
 */
object KeyVault {

    private const val PROVIDER = "AndroidKeyStore"
    private const val ALIAS = "gd_claude_api_key"
    private const val TRANSFORM = "AES/GCM/NoPadding"
    private const val PREFS = "gd_claude"
    private const val FIELD = "key"
    private const val IV_BYTES = 12
    private const val TAG_BITS = 128

    @Volatile private var memory: String? = null

    /** Quita espacios y comprueba que parezca una clave, para avisar antes de la primera pregunta. */
    fun clean(text: String): String? {
        val key = text.trim()
        val valid = key.startsWith("sk-ant-") && key.length in 24..512 && key.all { it.code in 33..126 }
        return key.takeIf { valid }
    }

    /** Devuelve true si quedó guardada de forma permanente; false si solo vale hasta apagar. */
    fun save(context: Context, key: String): Boolean {
        memory = key
        return runCatching {
            val cipher = Cipher.getInstance(TRANSFORM)
            cipher.init(Cipher.ENCRYPT_MODE, secret())
            val sealed = cipher.iv + cipher.doFinal(key.toByteArray(Charsets.UTF_8))
            prefs(context).edit().putString(FIELD, Base64.encodeToString(sealed, Base64.NO_WRAP)).apply()
        }.isSuccess
    }

    fun load(context: Context): String? {
        memory?.let { return it }
        val stored = prefs(context).getString(FIELD, null) ?: return null
        return runCatching {
            val sealed = Base64.decode(stored, Base64.NO_WRAP)
            val cipher = Cipher.getInstance(TRANSFORM)
            cipher.init(Cipher.DECRYPT_MODE, secret(), GCMParameterSpec(TAG_BITS, sealed, 0, IV_BYTES))
            String(cipher.doFinal(sealed, IV_BYTES, sealed.size - IV_BYTES), Charsets.UTF_8)
        }.getOrNull()?.also { memory = it }
    }

    fun has(context: Context): Boolean = memory != null || prefs(context).contains(FIELD)

    fun clear(context: Context) {
        memory = null
        prefs(context).edit().remove(FIELD).apply()
        runCatching { store().deleteEntry(ALIAS) }
    }

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    private fun store(): KeyStore = KeyStore.getInstance(PROVIDER).apply { load(null) }

    private fun secret(): SecretKey {
        (store().getEntry(ALIAS, null) as? KeyStore.SecretKeyEntry)?.let { return it.secretKey }
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, PROVIDER)
        generator.init(
            KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build()
        )
        return generator.generateKey()
    }
}
