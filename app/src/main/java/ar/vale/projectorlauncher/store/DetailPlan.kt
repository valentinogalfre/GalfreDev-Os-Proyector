package ar.vale.projectorlauncher.store

/**
 * Qué muestra la ficha de una app según lo que se sabe: el estado de la consulta de la última
 * versión, si la app está instalada y si el Android del equipo la soporta. Pura, para poder probarla.
 */
object DetailPlan {

    /** Cómo va la consulta: todavía no respondió, falló o ya hay una versión. */
    enum class Phase { CHECKING, FAILED, DONE }

    enum class Status { NEEDS_ANDROID, CHECKING, NO_NETWORK, VERSIONS, VERSION, READY }

    enum class Action { OPEN, UPDATE, UNINSTALL, INSTALL, RETRY }

    class Plan(val status: Status, val actions: List<Action>)

    fun plan(sdk: Int, minSdk: Int, installed: String?, phase: Phase, latest: Release?): Plan {
        val status = when {
            sdk < minSdk -> Status.NEEDS_ANDROID
            phase == Phase.CHECKING -> Status.CHECKING
            latest == null -> Status.NO_NETWORK
            installed != null && latest.version != null -> Status.VERSIONS
            latest.version != null -> Status.VERSION
            else -> Status.READY
        }
        val checking = phase == Phase.CHECKING
        val hasUpdate = installed != null && latest?.version != null && Versions.isNewer(latest.version, installed)
        val actions = when {
            installed != null -> listOfNotNull(Action.OPEN, Action.UPDATE.takeIf { hasUpdate }, Action.UNINSTALL)
            latest != null && sdk >= minSdk -> listOf(Action.INSTALL)
            // Todavía no respondió: no es un error, así que no hay nada que reintentar.
            checking -> emptyList()
            else -> listOf(Action.RETRY)
        }
        return Plan(status, actions)
    }
}
