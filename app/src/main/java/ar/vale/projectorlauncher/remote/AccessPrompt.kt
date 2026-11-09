package ar.vale.projectorlauncher.remote

import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Sheet

/**
 * El pedido de un celular, en la pared. Lo contesta quien tiene el control en la mano; el dueño
 * también puede contestarlo desde su celular, y entonces el panel se cierra solo.
 */
class AccessPrompt(private val activity: GdActivity) {

    private val access = AccessHub.get(activity)
    private var sheet: Sheet? = null
    private var asking = -1

    /** Pedidos que alguien cerró con «atrás»: siguen esperando, pero la pared no insiste. */
    private val later = HashSet<Int>()

    /** Se llama en cada vuelta de la pantalla. */
    fun check() {
        val first = access.pending().firstOrNull { it.id !in later }
        if (first?.id == asking) return
        sheet?.dismiss()
        sheet = null
        asking = -1
        // No se le saca el teclado ni otro panel a quien está en medio de algo.
        if (first == null || activity.hasOverlay) return
        asking = first.id
        val decide = { level: Access.Level? -> access.decide(first.id, level); Unit }
        sheet = Sheet.show(
            activity,
            activity.getString(R.string.access_ask, first.name),
            listOf(
                Sheet.Option(activity.getString(R.string.access_party)) { decide(Access.Level.PARTY) },
                Sheet.Option(activity.getString(R.string.access_control)) { decide(Access.Level.CONTROL) },
                Sheet.Option(activity.getString(R.string.access_no)) { decide(null) }
            ),
            activity.getString(R.string.access_body)
        ).also { it.onClosed = { later.add(first.id) } }
    }

    fun close() {
        sheet?.dismiss()
        sheet = null
        asking = -1
    }
}
