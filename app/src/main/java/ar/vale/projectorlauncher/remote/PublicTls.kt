package ar.vale.projectorlauncher.remote

import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.net.ServerSocket
import java.net.URL
import java.security.KeyFactory
import java.security.KeyStore
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import java.security.spec.PKCS8EncodedKeySpec
import java.util.Base64
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.KeyManagerFactory
import javax.net.ssl.SSLContext

/**
 * Un certificado que los celulares aceptan sin avisos, para la página del volante. El sensor de
 * inclinación solo se entrega a páginas seguras, y el certificado propio del equipo ([Tls]) hace
 * que el navegador muestre una advertencia. local-ip.sh publica un certificado de Let's Encrypt
 * para `*.local-ip.sh` y resuelve `192-168-0-27.local-ip.sh` a `192.168.0.27`.
 *
 * La clave de ese certificado es pública: cualquiera puede hacerse pasar por ese nombre. Por eso
 * este puerto atiende únicamente la carrera, que no lleva secretos, y nunca el control del equipo.
 * Si no hay internet o el servicio no responde, no hay puerto y el volante sigue con botones.
 */
object PublicTls {

    private const val SOURCE = "https://local-ip.sh/"
    private const val DOMAIN = "local-ip.sh"
    private const val DAY_MS = 24L * 60 * 60 * 1000
    private const val MAX_BYTES = 64 * 1024

    /** El nombre con que los celulares llegan a [address] bajo ese certificado. */
    fun host(address: String): String = "${address.replace('.', '-')}.$DOMAIN"

    /** Devuelve cómo abrir el puerto con ese certificado, o null si hoy no se puede. */
    fun sockets(dir: File, now: Long = System.currentTimeMillis()): ((Int) -> ServerSocket)? = runCatching {
        val chain = File(dir, "server.pem")
        val key = File(dir, "server.key")
        val stale = !chain.exists() || !key.exists() || now - chain.lastModified() > 3 * DAY_MS
        if (stale) runCatching { download(dir) }
        val context = context(chain.readText(), key.readText(), now) ?: run {
            // Lo guardado venció: un último intento antes de quedarse sin página segura.
            download(dir)
            context(chain.readText(), key.readText(), now)
        } ?: return@runCatching null
        val factory = context.serverSocketFactory
        val open: (Int) -> ServerSocket = { port -> factory.createServerSocket(port) }
        open
    }.getOrNull()

    /** Arma el contexto de TLS con la cadena y la clave en PEM, o null si el certificado no sirve hoy. */
    fun context(chainPem: String, keyPem: String, now: Long): SSLContext? {
        // Certificado por certificado: leído de una vez, hay equipos que se quedan solo con el primero y el
        // celular, sin los intermedios, no puede comprobar la cadena.
        val factory = CertificateFactory.getInstance("X.509")
        val certs = Regex("-----BEGIN CERTIFICATE-----[\\s\\S]*?-----END CERTIFICATE-----").findAll(chainPem)
            .map { factory.generateCertificate(ByteArrayInputStream(it.value.toByteArray())) as X509Certificate }
            .toList()
        val leaf = certs.firstOrNull() ?: return null
        if (now < leaf.notBefore.time || now > leaf.notAfter.time - DAY_MS) return null
        val private = KeyFactory.getInstance("RSA").generatePrivate(PKCS8EncodedKeySpec(pkcs8(keyPem) ?: return null))
        val store = KeyStore.getInstance(KeyStore.getDefaultType()).apply { load(null, null) }
        store.setKeyEntry("volante", private, CharArray(0), certs.toTypedArray())
        val keys = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm()).apply { init(store, CharArray(0)) }
        return SSLContext.getInstance("TLS").apply { init(keys.keyManagers, null, null) }
    }

    /**
     * La clave RSA en el formato que entiende Java (PKCS#8). El servicio la publica en el formato
     * viejo (PKCS#1, «RSA PRIVATE KEY»), que es lo mismo sin el sobre que dice de qué tipo es.
     */
    fun pkcs8(pem: String): ByteArray? {
        val old = pem.contains("BEGIN RSA PRIVATE KEY")
        if (!old && !pem.contains("BEGIN PRIVATE KEY")) return null
        val body = pem.lineSequence().filterNot { it.startsWith("-----") }.joinToString("")
        val der = Base64.getMimeDecoder().decode(body)
        if (!old) return der
        val algorithm = byteArrayOf(0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86.toByte(), 0x48, 0x86.toByte(), 0xf7.toByte(), 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00)
        val inner = byteArrayOf(0x02, 0x01, 0x00) + algorithm + tlv(0x04, der)
        return tlv(0x30, inner)
    }

    private fun tlv(tag: Int, value: ByteArray): ByteArray {
        val out = ByteArrayOutputStream()
        out.write(tag)
        val n = value.size
        when {
            n < 0x80 -> out.write(n)
            n < 0x100 -> { out.write(0x81); out.write(n) }
            n < 0x10000 -> { out.write(0x82); out.write(n shr 8); out.write(n and 0xff) }
            else -> { out.write(0x83); out.write(n shr 16); out.write((n shr 8) and 0xff); out.write(n and 0xff) }
        }
        out.write(value)
        return out.toByteArray()
    }

    private fun download(dir: File) {
        dir.mkdirs()
        // Primero se bajan los dos: si falla el segundo, no queda una cadena nueva con una clave vieja.
        val fresh = listOf("server.pem", "server.key").map { name ->
            val link = URL(SOURCE + name).openConnection() as HttpsURLConnection
            link.connectTimeout = 8000
            link.readTimeout = 8000
            try {
                check(link.responseCode == 200)
                name to link.inputStream.use { it.readBytes() }.also { check(it.size in 1..MAX_BYTES) }
            } finally {
                link.disconnect()
            }
        }
        fresh.forEach { (name, bytes) -> File(dir, name).writeBytes(bytes) }
    }
}
