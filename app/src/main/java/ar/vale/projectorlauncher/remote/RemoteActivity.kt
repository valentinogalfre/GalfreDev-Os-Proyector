package ar.vale.projectorlauncher.remote

import android.os.Bundle
import android.view.View
import android.widget.ListView
import android.widget.TextView
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.device.SystemScreens
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Row
import ar.vale.projectorlauncher.ui.RowAdapter
import ar.vale.projectorlauncher.ui.Sheet
import ar.vale.projectorlauncher.ui.bindRows

/**
 * Celular: el QR y el PIN para vincular el celular del dueño, solo mientras esta pantalla está a
 * la vista. Cuando ya hay un dueño vinculado, el código que se ve pasa a ser el de pedir permiso:
 * el de acceso total solo aparece si alguien lo pide acá, con el control en la mano.
 */
class RemoteActivity : GdActivity() {

    private lateinit var adapter: RowAdapter
    private lateinit var qr: QrView
    private lateinit var lead: TextView
    private lateinit var label: TextView
    private lateinit var pin: TextView
    private lateinit var url: TextView
    private val access by lazy { AccessHub.get(this) }
    private val prompt by lazy { AccessPrompt(this) }

    /** Mostrar el código de acceso total aunque ya haya un dueño. Dura hasta salir de la pantalla. */
    private var reveal = false

    override val ownerOnly: Boolean get() = true
    private val refresh = object : Runnable {
        override fun run() {
            render()
            qr.postDelayed(this, REFRESH_MS)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_remote)
        setHead(getString(R.string.word_celular))
        qr = findViewById(R.id.remote_qr)
        lead = findViewById(R.id.remote_lead)
        label = findViewById(R.id.remote_label)
        pin = findViewById(R.id.remote_pin)
        url = findViewById(R.id.remote_url)
        adapter = RowAdapter(this)
        findViewById<ListView>(R.id.screen_list).bindRows(adapter)
    }

    override fun onResume() {
        super.onResume()
        qr.post(refresh)
    }

    override fun onPause() {
        RemoteState.pairing?.open = false
        reveal = false
        prompt.close()
        qr.removeCallbacks(refresh)
        super.onPause()
    }

    private fun render() {
        val pairing = RemoteState.pairing
        val full = !access.claimed || reveal
        // El PIN también es acceso total: se acepta solo mientras se muestra.
        pairing?.open = full
        val running = prefs.remoteEnabled && RemoteState.running && pairing != null
        val link = when {
            !running -> null
            full -> RemoteState.pairingUrl(this)
            else -> RemoteState.askUrl(this)
        }
        // Armar el código es caro y esta pantalla se refresca cada dos segundos: solo si cambió.
        if (link != shownLink) {
            shownLink = link
            qr.show(link)
        }
        qr.visibility = if (link == null) View.GONE else View.VISIBLE
        val visible = if (link == null) View.GONE else View.VISIBLE
        val pinVisible = if (link == null || !full) View.GONE else View.VISIBLE
        label.visibility = pinVisible
        pin.visibility = pinVisible
        url.visibility = visible
        lead.setText(
            when {
                !prefs.remoteEnabled -> R.string.remote_off
                link == null -> R.string.remote_no_network
                full -> R.string.remote_lead
                else -> R.string.remote_lead_claimed
            }
        )
        if (link != null && pairing != null) {
            label.setText(R.string.remote_pin_label)
            pin.text = "${pairing.pin.take(3)} ${pairing.pin.drop(3)}"
            url.text = RemoteState.url(this)
        }
        val rows = ArrayList<Row>()
        if (prefs.remoteEnabled) {
            val control = RemoteAccessibility.instance != null
            rows.add(Row(
                getString(R.string.remote_full),
                subtitle = getString(R.string.remote_full_sub),
                value = getString(if (control) R.string.value_on else R.string.value_off),
                icon = R.drawable.ic_shield
            ) { if (!control) askFullControl() })
            if (!full) {
                rows.add(Row(getString(R.string.remote_owner_link), subtitle = getString(R.string.remote_owner_link_sub), icon = R.drawable.ic_phone) {
                    Sheet.confirm(this, getString(R.string.remote_owner_link), getString(R.string.remote_owner_link_body), getString(R.string.remote_owner_link_yes)) {
                        reveal = true
                        render()
                    }
                })
            }
            val guests = access.allowed()
            if (guests.isNotEmpty()) {
                rows.add(Row(getString(R.string.remote_guests), value = guests.size.toString(), icon = R.drawable.ic_phone) { showGuests() })
            }
            rows.add(Row(getString(R.string.remote_disconnect), subtitle = getString(R.string.remote_disconnect_sub), icon = R.drawable.ic_refresh) {
                Sheet.confirm(this, getString(R.string.remote_disconnect), getString(R.string.remote_disconnect_sub), getString(R.string.remote_disconnect_yes)) {
                    RemoteState.pairing?.rotate()
                    access.forgetAll()
                    reveal = false
                    Notice.show(this, getString(R.string.remote_disconnected), Notice.Kind.OK)
                    render()
                }
            })
            rows.add(Row(getString(R.string.remote_turn_off), icon = R.drawable.ic_power) {
                prefs.remoteEnabled = false
                RemoteService.stop(this)
                qr.postDelayed({ render() }, RESTART_MS)
            })
        } else {
            rows.add(Row(getString(R.string.remote_turn_on), subtitle = getString(R.string.remote_turn_on_sub), icon = R.drawable.ic_phone) {
                prefs.remoteEnabled = true
                RemoteService.start(this)
                qr.postDelayed({ render() }, RESTART_MS)
            })
        }
        val signature = rows.joinToString("|") { "${it.title}·${it.value}" }
        if (signature != shownRows) {
            shownRows = signature
            adapter.submit(rows)
        }
        if (running) prompt.check()
    }

    /** Los que ya entraron. Elegir uno lo saca: tiene que volver a pedir permiso. */
    private fun showGuests() {
        val options = access.allowed().map { guest ->
            val level = getString(if (guest.level == Access.Level.CONTROL) R.string.access_level_control else R.string.access_level_party)
            Sheet.Option(getString(R.string.remote_guest_row, guest.name, level)) {
                Sheet.confirm(this, getString(R.string.remote_guest_remove, guest.name), null, getString(R.string.remote_guest_remove_yes)) {
                    access.decide(guest.id, null)
                    render()
                }
            }
        } + Sheet.Option(getString(R.string.back)) {}
        Sheet.show(this, getString(R.string.remote_guests), options, getString(R.string.remote_guests_body))
    }

    private var shownLink: String? = null
    private var shownRows: String? = null

    private fun askFullControl() {
        val settings = SystemScreens.accessibility(this)
        val options = ArrayList<Sheet.Option>()
        if (settings != null) {
            options.add(Sheet.Option(getString(R.string.remote_full_open), R.drawable.ic_arrow) { openExternal(settings, null) })
        }
        options.add(Sheet.Option(getString(R.string.back)) {})
        val component = "$packageName/${RemoteAccessibility::class.java.name}"
        val body = if (settings != null) {
            getString(R.string.remote_full_body)
        } else {
            getString(R.string.remote_full_adb, FullControl.adbCommands(component))
        }
        Sheet.show(this, getString(R.string.remote_full), options, body)
    }

    private companion object {
        const val REFRESH_MS = 2000L
        const val RESTART_MS = 500L
    }
}
