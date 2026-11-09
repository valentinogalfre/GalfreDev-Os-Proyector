package ar.vale.projectorlauncher.store

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import ar.vale.projectorlauncher.ApkInstaller
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.LineProgress
import ar.vale.projectorlauncher.ui.Notice

/** Ficha de una app: qué hace, qué limitaciones tiene y la instalación comprobada. */
class StoreDetailActivity : GdActivity() {

    private lateinit var app: CatalogApp
    private lateinit var status: TextView
    private lateinit var line: LineProgress
    private lateinit var actions: LinearLayout
    private var release: Release? = null
    private var working = false
    @Volatile private var cancelled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_detail)
        val id = intent.getStringExtra(EXTRA_ID)
        val found = Catalog.load(this).apps.firstOrNull { it.id == id }
        if (found == null) {
            finish()
            return
        }
        app = found
        status = findViewById(R.id.detail_status)
        line = findViewById(R.id.detail_line)
        line.useTheme()
        actions = findViewById(R.id.detail_actions)
        setHead(app.name)
        findViewById<TextView>(R.id.detail_label).text = getString(
            R.string.store_label,
            getString(if (app.tvFirst) R.string.store_tv_first else R.string.store_tv_adapted),
            app.license
        )
        findViewById<TextView>(R.id.detail_lead).text = app.summary
        findViewById<TextView>(R.id.detail_body).text = app.details
        findViewById<TextView>(R.id.detail_caveat).apply {
            text = app.caveat
            visibility = if (app.caveat == null) View.GONE else View.VISIBLE
        }
        lookup()
    }

    override fun onResume() {
        super.onResume()
        if (::actions.isInitialized && !working) render()
    }

    override fun onDestroy() {
        cancelled = true
        super.onDestroy()
    }

    private fun installedVersion(): String? =
        runCatching { packageManager.getPackageInfo(app.packageName, 0).versionName ?: "" }.getOrNull()

    /** Consulta la última versión sin bloquear: la ficha se puede leer sin internet. */
    private fun lookup() {
        status.setText(R.string.store_checking)
        Thread {
            val result = runCatching { Resolver.resolve(app, Build.SUPPORTED_ABIS.toList(), Net) }
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                release = result.getOrNull()
                render()
            }
        }.start()
    }

    private fun render() {
        val current = installedVersion()
        val latest = release
        status.text = when {
            Build.VERSION.SDK_INT < app.minSdk -> getString(R.string.store_needs_android, app.minSdk)
            latest == null -> getString(R.string.store_no_network)
            current != null && latest.version != null -> getString(R.string.store_versions, current, latest.version)
            latest.version != null -> getString(R.string.store_version, latest.version)
            else -> getString(R.string.store_ready)
        }
        val keep = actions.focusedChild != null
        actions.removeAllViews()
        val hasUpdate = current != null && latest?.version != null && Versions.isNewer(latest.version, current)
        if (current != null) {
            action(getString(R.string.store_open)) { openApp() }
            if (hasUpdate) action(getString(R.string.store_update)) { install() }
            action(getString(R.string.uninstall)) { uninstall() }
        } else if (latest != null && Build.VERSION.SDK_INT >= app.minSdk) {
            action(getString(R.string.store_install)) { install() }
        } else {
            action(getString(R.string.store_retry)) { lookup() }
        }
        if (keep || window.decorView.findFocus() == null) actions.getChildAt(0)?.requestFocusFromTouch()
    }

    private fun action(label: String, run: () -> Unit) {
        val view = layoutInflater.inflate(R.layout.item_action, actions, false) as TextView
        view.text = label
        view.setOnClickListener { run() }
        actions.addView(view)
    }

    private fun openApp() {
        val intent = AppRepository.launchIntent(packageManager, app.packageName)?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        if (intent == null) Notice.show(this, getString(R.string.cant_open), Notice.Kind.ERROR)
        else openExternal(intent, app.name)
    }

    private fun uninstall() {
        @Suppress("DEPRECATION")
        openExternal(Intent(Intent.ACTION_UNINSTALL_PACKAGE, Uri.parse("package:${app.packageName}")), null)
    }

    private fun install() {
        val target = release ?: return
        if (working) return
        working = true
        actions.removeAllViews()
        line.value = 0f
        line.visibility = View.VISIBLE
        status.text = getString(R.string.store_downloading, app.name)
        Thread {
            val result = runCatching {
                Downloader.fetch(applicationContext, app, target, ::onProgress) { cancelled }
            }
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                working = false
                line.visibility = View.INVISIBLE
                result.onSuccess { ApkInstaller.install(this, it) }
                    .onFailure { Notice.show(this, message(it), Notice.Kind.ERROR) }
                render()
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
            StoreFailure.Reason.WRONG_SIGNER -> R.string.store_err_signer
            StoreFailure.Reason.TOO_NEW -> R.string.store_err_too_new
            StoreFailure.Reason.UNREADABLE -> R.string.store_err_unreadable
            else -> R.string.store_err_network
        }
    )

    companion object {
        const val EXTRA_ID = "id"
        private const val PROGRESS_MS = 120L
    }
}
