package ar.vale.projectorlauncher.update

import ar.vale.projectorlauncher.store.Release
import ar.vale.projectorlauncher.store.Source
import ar.vale.projectorlauncher.store.Versions

/**
 * Las decisiones del actualizador, sin Android: qué mostrar según la red, la versión instalada y lo
 * que respondió GitHub. Así cada caso se prueba en la JVM.
 */
object UpdatePlan {

    /** El APK de cada versión se llama `galfredev-os-<versión>.apk`: lo arma el workflow de releases. */
    const val ASSET = "^galfredev-os-{version}\\.apk$"

    /** Cada cuánto se consulta sola, sin que nadie lo pida. GitHub deja 60 consultas por hora por red. */
    const val AUTO_CHECK_MS = 6L * 60 * 60 * 1000

    fun source(repo: String) = Source.GitHub(repo, emptyMap(), ASSET)

    enum class Phase { CHECKING, DONE, FAILED }

    enum class Status { OFFLINE, CHECKING, FAILED, UP_TO_DATE, AVAILABLE }

    enum class Action { WIFI, RETRY, UPDATE }

    data class Plan(val status: Status, val actions: List<Action>)

    fun plan(online: Boolean, installed: String, phase: Phase, latest: Release?): Plan = when {
        !online -> Plan(Status.OFFLINE, listOf(Action.WIFI, Action.RETRY))
        phase == Phase.CHECKING -> Plan(Status.CHECKING, emptyList())
        phase == Phase.FAILED || latest?.version == null -> Plan(Status.FAILED, listOf(Action.RETRY))
        isNewer(latest.version, installed) -> Plan(Status.AVAILABLE, listOf(Action.UPDATE))
        else -> Plan(Status.UP_TO_DATE, listOf(Action.RETRY))
    }

    /** Solo se ofrece subir de versión: nunca bajar, ni reinstalar la misma. */
    fun isNewer(candidate: String?, installed: String): Boolean =
        candidate != null && Versions.isNewer(candidate, installed)

    /** Para no gastar consultas: una vez cada [AUTO_CHECK_MS], y nunca sin red. */
    fun shouldAutoCheck(now: Long, lastCheck: Long, online: Boolean): Boolean =
        online && (lastCheck <= 0 || now - lastCheck >= AUTO_CHECK_MS || now < lastCheck)
}
