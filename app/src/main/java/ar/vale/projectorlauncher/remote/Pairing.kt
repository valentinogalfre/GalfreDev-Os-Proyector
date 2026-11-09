package ar.vale.projectorlauncher.remote

import java.security.MessageDigest
import java.security.SecureRandom

/**
 * Quién puede manejar el proyector.
 *
 * Hay dos formas de entrar y las dos piden estar en la sala: escanear el QR, que trae el token, o
 * escribir el PIN que se ve en pantalla. El PIN solo se acepta mientras se está mostrando, se
 * cambia con cada uso y los errores se castigan con esperas que se duplican.
 */
class Pairing(
    storedToken: String?,
    private val saveToken: (String) -> Unit,
    private val now: () -> Long = System::currentTimeMillis,
    private val random: SecureRandom = SecureRandom()
) {

    sealed interface Attempt {
        data class Paired(val token: String) : Attempt
        data class Wrong(val left: Int) : Attempt
        data class Locked(val seconds: Int) : Attempt
        data object Closed : Attempt
    }

    @Volatile var token: String = storedToken?.takeIf { it.length >= TOKEN_CHARS } ?: newToken().also(saveToken)
        private set

    @Volatile var pin: String = newPin()
        private set

    /** Lo abre la pantalla Celular mientras muestra el PIN. */
    @Volatile var open = false

    private class Strikes {
        var failures = 0
        var locks = 0
        var lockedUntil = 0L
        var last = 0L
    }

    /** Por dirección: un equipo que insiste se traba solo y no le saca el PIN al dueño. */
    private val strikes = LinkedHashMap<String, Strikes>()

    private fun strikesOf(address: String): Strikes? {
        val known = strikes[address]
        if (known != null) {
            // Quien dejó de insistir arranca de nuevo. Mientras esté trabado no se olvida nada.
            if (now() - known.last > FORGET_MS && now() >= known.lockedUntil) {
                known.failures = 0
                known.locks = 0
            }
            return known
        }
        if (strikes.size >= MAX_ADDRESSES) {
            // Se olvida a quien no esté trabado. Si no, inundar el mapa levantaría las trabas.
            // Con todos trabados, la dirección nueva espera. El QR sigue funcionando.
            val free = strikes.entries.firstOrNull { now() >= it.value.lockedUntil } ?: return null
            strikes.remove(free.key)
        }
        return Strikes().also { strikes[address] = it }
    }

    @Synchronized
    fun tryPin(candidate: String, from: String = ""): Attempt {
        val mine = strikesOf(from) ?: return Attempt.Locked(BASE_LOCK_SECONDS)
        val left = mine.lockedUntil - now()
        if (left > 0) return Attempt.Locked(((left + 999) / 1000).toInt())
        if (!open) return Attempt.Closed
        if (same(candidate, pin)) {
            strikes.remove(from)
            pin = newPin()
            return Attempt.Paired(token)
        }
        mine.last = now()
        mine.failures++
        if (mine.failures < MAX_FAILURES) return Attempt.Wrong(MAX_FAILURES - mine.failures)
        mine.failures = 0
        val seconds = (BASE_LOCK_SECONDS shl mine.locks.coerceAtMost(MAX_DOUBLINGS)).toLong()
        mine.locks++
        mine.lockedUntil = now() + seconds * 1000
        pin = newPin()
        return Attempt.Locked(seconds.toInt())
    }

    fun authorized(header: String?): Boolean {
        if (header == null || !header.startsWith(BEARER)) return false
        return same(header.substring(BEARER.length).trim(), token)
    }

    /** Desconecta a todos los celulares que ya estaban emparejados. */
    @Synchronized
    fun rotate() {
        token = newToken().also(saveToken)
        pin = newPin()
    }

    /** Compara sin revelar por el tiempo cuántos caracteres coinciden. */
    private fun same(a: String, b: String) =
        MessageDigest.isEqual(a.toByteArray(Charsets.UTF_8), b.toByteArray(Charsets.UTF_8))

    private fun newToken(): String {
        val bytes = ByteArray(TOKEN_BYTES).also(random::nextBytes)
        return bytes.joinToString("") { "%02x".format(it) }
    }

    private fun newPin(): String = random.nextInt(PIN_RANGE).toString().padStart(PIN_DIGITS, '0')

    companion object {
        const val PIN_DIGITS = 6
        const val MAX_FAILURES = 5
        const val BASE_LOCK_SECONDS = 30
        private const val PIN_RANGE = 1_000_000
        private const val MAX_DOUBLINGS = 7
        private const val FORGET_MS = 10L * 60 * 1000
        private const val MAX_ADDRESSES = 64
        private const val TOKEN_BYTES = 24
        private const val TOKEN_CHARS = TOKEN_BYTES * 2
        private const val BEARER = "Bearer "
    }
}
