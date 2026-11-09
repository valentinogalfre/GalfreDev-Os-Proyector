package ar.vale.projectorlauncher.remote

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.math.BigInteger
import java.net.ServerSocket
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.cert.X509Certificate
import java.security.spec.ECGenParameterSpec
import java.util.Date
import javax.net.ssl.KeyManagerFactory
import javax.net.ssl.SSLContext
import javax.security.auth.x500.X500Principal

/**
 * La misma página, por HTTPS. Hace falta por una sola razón: los navegadores solo le dan el
 * micrófono a una página segura, y sin micrófono no se le puede hablar a Claude con un toque.
 *
 * El certificado lo firma el propio equipo, así que el navegador avisa la primera vez y hay que
 * aceptarlo. La clave privada vive en el almacén del sistema y no se puede sacar. Si el firmware
 * no lo soporta, no hay HTTPS y todo lo demás sigue igual: se dicta con el teclado del celular.
 */
object Tls {

    private const val PROVIDER = "AndroidKeyStore"
    private const val ALIAS = "gd_remote_tls"
    private const val DAY_MS = 24L * 60 * 60 * 1000

    /** Los navegadores rechazan certificados de más de 398 días, aun aceptando el aviso. */
    private const val VALID_DAYS = 390L
    private const val RENEW_DAYS = 30L

    /** Devuelve cómo abrir un puerto cifrado, o null si este equipo no puede. */
    fun sockets(): ((Int) -> ServerSocket)? = runCatching {
        val store = KeyStore.getInstance(PROVIDER).apply { load(null) }
        val current = store.getCertificate(ALIAS) as? X509Certificate
        val expiring = current == null || current.notAfter.time - System.currentTimeMillis() < RENEW_DAYS * DAY_MS
        if (expiring) generate()
        val keys = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm())
        keys.init(store, null)
        val factory = SSLContext.getInstance("TLS").apply { init(keys.keyManagers, null, null) }.serverSocketFactory
        val open: (Int) -> ServerSocket = { port -> factory.createServerSocket(port) }
        open
    }.getOrNull()

    private fun generate() {
        val now = System.currentTimeMillis()
        val spec = KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_SIGN)
            .setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1"))
            // La capa de TLS firma un resumen que ya calculó: por eso también va «ninguno».
            .setDigests(KeyProperties.DIGEST_NONE, KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA384, KeyProperties.DIGEST_SHA512)
            .setCertificateSubject(X500Principal("CN=galfredev OS"))
            .setCertificateSerialNumber(BigInteger.valueOf(now))
            .setCertificateNotBefore(Date(now - DAY_MS))
            .setCertificateNotAfter(Date(now + VALID_DAYS * DAY_MS))
            .build()
        KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_EC, PROVIDER).apply { initialize(spec) }.generateKeyPair()
    }
}
