package ar.vale.projectorlauncher.update

import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import ar.vale.projectorlauncher.ApkInstaller
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.device.SystemScreens
import ar.vale.projectorlauncher.store.Release
import ar.vale.projectorlauncher.store.StoreFailure
import ar.vale.projectorlauncher.ui.Device
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.LineProgress
import ar.vale.projectorlauncher.ui.Notice

/**
 * Actualizar galfredev OS desde el control remoto: mira que haya red, consulta la última versión
 * publicada, la baja comprobada y abre el instalador del sistema. Los ajustes y la clave de Claude
 * se conservan, porque Android instala encima de la misma app.
 */
class UpdateActivity : GdActivity() {

    private lateinit var status: TextView
    private lateinit var line: LineProgress
    private lateinit var actions: LinearLayout
    private var release: Release? = null
    private var phase = UpdatePlan.Phase.CHECKING
    private var working = false
    @Volatile private var cancelled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_detail)
        status = findViewById(R.id.detail_status)
        line = findViewById(R.id.detail_line)
        line.useTheme()
        actions = findViewById(R.id.detail_actions)
        setHead(getString(R.string.update_title))
        findViewById<TextView>(R.id.detail_label).text = getString(R.string.update_label, SelfUpdate.repo(this))
        findViewById<TextView>(R.id.detail_lead).text = getString(R.string.update_lead, SelfUpdate.installedVersion(this))
        findViewById<TextView>(R.id.detail_body).text = getString(R.string.update_body)
        findViewById<TextView>(R.id.detail_caveat).visibility = View.GONE
        lookup()
    }

    override fun onResume() {
        super.onResume()
        // Al volver de los ajustes de wifi se consulta de nuevo, sin pedirle a nadie que reintente.
        if (::actions.isInitialized && !working) {
            if (phase != UpdatePlan.Phase.CHECKING && release == null && Device.isOnline(this)) lookup() else render()
        }
    }

    override fun onDestroy() {
        cancelled = true
        super.onDestroy()
    }

    private fun lookup() {
        if (!Device.isOnline(this)) {
            phase = UpdatePlan.Phase.FAILED
            render()
            return
        }
        phase = UpdatePlan.Phase.CHECKING
        render()
        Thread {
            val result = runCatching { SelfUpdate.latest(applicationContext) }
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                release = result.getOrNull()
                phase = if (release != null) UpdatePlan.Phase.DONE else UpdatePlan.Phase.FAILED
                Prefs(this).apply {
                    updateCheckedAt = System.currentTimeMillis()
                    release?.version?.let { updateLatest = it }
                }
                render()
            }
        }.start()
    }

    private fun render() {
        val installed = SelfUpdate.installedVersion(this)
        val plan = UpdatePlan.plan(Device.isOnline(this), installed, phase, release)
        status.text = when (plan.status) {
            UpdatePlan.Status.OFFLINE -> getString(R.string.update_offline)
            UpdatePlan.Status.CHECKING -> getString(R.string.store_checking)
            UpdatePlan.Status.FAILED -> getString(R.string.store_no_network)
            UpdatePlan.Status.UP_TO_DATE -> getString(R.string.update_up_to_date, installed)
            UpdatePlan.Status.AVAILABLE -> getString(R.string.store_versions, installed, release?.version)
        }
        val keep = actions.focusedChild != null
        actions.removeAllViews()
        plan.actions.forEach { act ->
            when (act) {
                UpdatePlan.Action.UPDATE -> action(getString(R.string.update_now, release?.version)) { install() }
                UpdatePlan.Action.RETRY -> action(getString(R.string.update_check_again)) { lookup() }
                UpdatePlan.Action.WIFI -> SystemScreens.wifi(this)?.let { wifi ->
                    action(getString(R.string.set_wifi)) { openExternal(wifi, getString(R.string.set_wifi)) }
                }
            }
        }
        if (keep || window.decorView.findFocus() == null) actions.getChildAt(0)?.requestFocusFromTouch()
    }

    private fun action(label: String, run: () -> Unit) {
        val view = layoutInflater.inflate(R.layout.item_action, actions, false) as TextView
        view.text = label
        view.setOnClickListener { run() }
        actions.addView(view)
    }

    private fun install() {
        val target = release ?: return
        if (working) return
        working = true
        actions.removeAllViews()
        line.value = 0f
        line.visibility = View.VISIBLE
        status.text = getString(R.string.store_downloading, target.version)
        Thread {
            val result = runCatching { SelfUpdate.download(applicationContext, target, ::onProgress) { cancelled } }
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                working = false
                line.visibility = View.INVISIBLE
                result.onSuccess { ApkInstaller.install(this, it) }
                    .onFailure { Notice.show(this, message(it), Notice.Kind.ERROR) }
                render()
                // Si se cancela el instalador, el botón vuelve a estar para probar de nuevo.
                if (result.isSuccess) status.text = getString(R.string.update_installing)
            }
        }.start()
    }

    private var lastShown = 0L

    private fun onProgress(value: Float?) {
        val now = System.currentTimeMillis()
        if (now - lastShown < PROGRESS_MS) return
        lastShown = now
        runOnUiThread { if (value != null) line.value = value }
    }

    private fun message(error: Throwable): String = getString(
        when ((error as? StoreFailure)?.reason) {
            StoreFailure.Reason.NO_SPACE -> R.string.store_err_space
            StoreFailure.Reason.CORRUPT -> R.string.store_err_corrupt
            StoreFailure.Reason.WRONG_PACKAGE -> R.string.store_err_package
            // La copia instalada no es una versión oficial (un fork o una compilación propia).
            StoreFailure.Reason.WRONG_SIGNER -> R.string.update_err_signer
            StoreFailure.Reason.TOO_NEW -> R.string.store_err_too_new
            StoreFailure.Reason.UNREADABLE -> R.string.store_err_unreadable
            else -> R.string.store_err_network
        }
    )

    companion object {
        private const val PROGRESS_MS = 120L
    }
}
