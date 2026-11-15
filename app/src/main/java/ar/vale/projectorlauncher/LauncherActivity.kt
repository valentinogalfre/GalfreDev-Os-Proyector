package ar.vale.projectorlauncher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.RectF
import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import ar.vale.projectorlauncher.apps.AppOptions
import ar.vale.projectorlauncher.apps.AppsActivity
import ar.vale.projectorlauncher.claude.ClaudeActivity
import ar.vale.projectorlauncher.claude.ClaudeRuntime
import ar.vale.projectorlauncher.claude.ClaudeSettings
import ar.vale.projectorlauncher.claude.KeyVault
import ar.vale.projectorlauncher.device.CalibrationActivity
import ar.vale.projectorlauncher.carrera.CarreraActivity
import ar.vale.projectorlauncher.juntada.JuntadaActivity
import ar.vale.projectorlauncher.device.SystemScreens
import ar.vale.projectorlauncher.apps.Streaming
import ar.vale.projectorlauncher.apps.StreamingLauncher
import ar.vale.projectorlauncher.media.CineActivity
import ar.vale.projectorlauncher.media.ResumeStore
import ar.vale.projectorlauncher.media.Time
import ar.vale.projectorlauncher.remote.RemoteActivity
import ar.vale.projectorlauncher.remote.RemoteService
import ar.vale.projectorlauncher.remote.RemoteState
import ar.vale.projectorlauncher.store.Catalog
import ar.vale.projectorlauncher.store.Recommendations
import ar.vale.projectorlauncher.store.StoreActivity
import ar.vale.projectorlauncher.store.StoreDetailActivity
import ar.vale.projectorlauncher.ui.BootView
import ar.vale.projectorlauncher.ui.Device
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Motion
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Screen
import ar.vale.projectorlauncher.ui.Wordmark
import ar.vale.projectorlauncher.wall.WallActivity
import ar.vale.projectorlauncher.wall.WordClock
import java.io.File
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

/**
 * Pantalla de inicio: un índice editorial a la izquierda y, a la derecha, el contenido de la
 * palabra activa. Su nombre de clase no cambia: los equipos guardan esta actividad como inicio.
 */
class LauncherActivity : GdActivity() {

    private enum class Section(val word: Int) {
        APPS(R.string.word_apps),
        CINE(R.string.word_cine),
        TIENDA(R.string.word_tienda),
        CLAUDE(R.string.word_claude),
        JUNTADA(R.string.word_juntada),
        PARED(R.string.word_pared),
        CELULAR(R.string.word_celular),
        AJUSTES(R.string.word_ajustes)
    }

    private lateinit var index: LinearLayout
    private lateinit var panel: FrameLayout
    private lateinit var status: TextView
    private lateinit var logo: ImageView
    private val words = ArrayList<TextView>()
    private var active = Section.APPS
    private var apps: List<AppInfo> = emptyList()
    private var boot: BootView? = null

    private val locale = Locale.forLanguageTag("es-AR")
    private val dateFormat = SimpleDateFormat("EEE d MMM · HH:mm", locale)

    private val tick = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) = updateStatus()
    }

    /** Actualizar una app manda tres avisos seguidos: se espera al último y se carga una vez. */
    private val reload = Runnable { loadApps() }
    private val packages = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            Installed.invalidate()
            rootFrame.removeCallbacks(reload)
            rootFrame.postDelayed(reload, RELOAD_MS)
        }
    }

    /** Enchufar un USB lleva a Cine: es lo que se viene a hacer. */
    private val usb = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            Notice.show(this@LauncherActivity, getString(R.string.home_usb), Notice.Kind.OK)
            if (!hasOverlay && boot == null) words[Section.CINE.ordinal].requestFocusFromTouch()
        }
    }

    private val idle = Runnable {
        if (prefs.wallIdleMinutes > 0 && boot == null && !hasOverlay && !ClaudeRuntime.busy) {
            openScreen(Intent(this, WallActivity::class.java), null)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
        index = findViewById(R.id.index)
        panel = findViewById(R.id.panel)
        status = findViewById(R.id.status)
        logo = findViewById(R.id.logo)

        Section.values().forEach { section ->
            val word = layoutInflater.inflate(R.layout.item_word, index, false) as TextView
            word.setText(section.word)
            word.setOnFocusChangeListener { _, focused -> if (focused) activate(section) }
            word.setOnClickListener { open(section) }
            index.addView(word)
            words.add(word)
        }
        words.first().requestFocus()
        showPanel(active)
        loadApps()
        Installed.warm(this)
        if (prefs.remoteEnabled) RemoteService.start(this)
        if (shouldPlayBoot()) playBoot() else consumeBootLaunch()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        // Apretar «inicio» estando en el inicio vuelve al principio del índice.
        if (intent.getBooleanExtra(EXTRA_REPLAY_BOOT, false)) {
            playBoot()
        } else if (!hasOverlay) {
            words.first().requestFocusFromTouch()
        }
    }

    override fun onStart() {
        super.onStart()
        registerReceiver(tick, IntentFilter().apply {
            addAction(Intent.ACTION_TIME_TICK)
            addAction(Intent.ACTION_TIME_CHANGED)
            addAction(Intent.ACTION_TIMEZONE_CHANGED)
        })
        registerReceiver(packages, IntentFilter().apply {
            addAction(Intent.ACTION_PACKAGE_ADDED)
            addAction(Intent.ACTION_PACKAGE_REMOVED)
            addAction(Intent.ACTION_PACKAGE_REPLACED)
            addDataScheme("package")
        })
        registerReceiver(usb, IntentFilter(Intent.ACTION_MEDIA_MOUNTED).apply { addDataScheme("file") })
    }

    override fun onStop() {
        super.onStop()
        unregisterReceiver(tick)
        unregisterReceiver(packages)
        unregisterReceiver(usb)
    }

    override fun onResume() {
        super.onResume()
        updateStatus()
        if (boot == null) refreshPanel()
        scheduleIdle()
    }

    override fun onPause() {
        rootFrame.removeCallbacks(idle)
        rootFrame.removeCallbacks(reload)
        flushPanel()
        super.onPause()
    }

    override fun onUserInteraction() {
        super.onUserInteraction()
        scheduleIdle()
    }

    /** Si nadie toca nada en el inicio, se muestra la pared. Es propio: en estos equipos el protector de pantalla del sistema suele apagarlos. */
    private fun scheduleIdle() {
        rootFrame.removeCallbacks(idle)
        val minutes = prefs.wallIdleMinutes
        if (minutes > 0) rootFrame.postDelayed(idle, minutes * 60_000L)
    }

    // --- Arranque ---

    private fun shouldPlayBoot(): Boolean {
        if (intent.getBooleanExtra(EXTRA_REPLAY_BOOT, false)) return true
        if (!prefs.bootAnimation) return false
        val count = Device.bootCount(this)
        if (count == -1) return !playedThisProcess
        return count != prefs.lastBootShown
    }

    private fun playBoot() {
        if (boot != null) return
        playedThisProcess = true
        prefs.lastBootShown = Device.bootCount(this)
        tape.visibility = View.INVISIBLE
        val view = BootView(this, Wordmark.load(this), bootStatus(), ::logoBounds)
        view.onHandoff = { rect ->
            tape.land(rect)
            revealHome()
        }
        view.onFinished = { frameMs ->
            if (frameMs > 0f) prefs.measuredFrameMs = frameMs
            rootFrame.removeView(view)
            boot = null
            consumeBootLaunch()
        }
        boot = view
        addLayer(view)
    }

    private fun bootStatus(): List<Pair<String, String>> {
        val size = Screen.realSize(this)
        return listOf(
            getString(R.string.boot_label_resolution) to "${size.x} × ${size.y}",
            getString(R.string.boot_label_apps) to apps.size.toString(),
            getString(R.string.boot_label_net) to Device.networkLabel(this)
        )
    }

    private fun logoBounds(): RectF {
        val at = IntArray(2)
        logo.getLocationInWindow(at)
        return RectF(at[0].toFloat(), at[1].toFloat(), (at[0] + logo.width).toFloat(), (at[1] + logo.height).toFloat())
    }

    private fun revealHome() {
        val blocks = ArrayList<View>(words)
        blocks.add(panel)
        blocks.add(status)
        Motion.reveal(blocks)
    }

    /** Si venimos de un arranque marcado por BootReceiver, abrimos la app principal una sola vez. */
    private fun consumeBootLaunch() {
        if (!prefs.pendingBootLaunch) return
        prefs.pendingBootLaunch = false
        if (!prefs.autoLaunchOnBoot) return
        prefs.primaryPkg?.let { launch(it, null) }
    }

    // --- Índice ---

    /**
     * Al bajar por el índice con la tecla apretada no se arma el panel de cada palabra por la que
     * se pasa: la palabra se pinta al instante y el panel aparece cuando el control se detiene.
     */
    private var panelPending = false
    private val buildPanel = Runnable {
        panelPending = false
        showPanel(active)
    }

    private fun activate(section: Section) {
        if (section == active) return
        active = section
        paintWords()
        panel.removeCallbacks(buildPanel)
        panelPending = true
        panel.postDelayed(buildPanel, PANEL_MS)
    }

    /** Antes de entrar al panel tiene que estar el de la palabra actual. */
    private fun flushPanel() {
        if (!panelPending) return
        panel.removeCallbacks(buildPanel)
        buildPanel.run()
    }

    private fun paintWords() {
        val on = getColor(R.color.ink)
        val off = getColor(R.color.ink_2)
        words.forEachIndexed { i, w -> w.setTextColor(if (i == active.ordinal) on else off) }
    }

    private fun open(section: Section) {
        flushPanel()
        val title = getString(section.word)
        when (section) {
            Section.APPS -> openScreen(Intent(this, AppsActivity::class.java), title)
            Section.CINE -> openScreen(Intent(this, CineActivity::class.java), title)
            Section.TIENDA -> openScreen(Intent(this, StoreActivity::class.java), title)
            Section.CLAUDE -> openScreen(Intent(this, ClaudeActivity::class.java), title)
            Section.JUNTADA -> openScreen(Intent(this, JuntadaActivity::class.java), title)
            Section.PARED -> openScreen(Intent(this, WallActivity::class.java), title)
            Section.CELULAR -> openScreen(Intent(this, RemoteActivity::class.java), title)
            Section.AJUSTES -> openScreen(Intent(this, SettingsActivity::class.java), title)
        }
    }

    /** Vuelve a armar el panel al regresar: lo que muestra pudo cambiar. El foco queda donde estaba. */
    private fun refreshPanel() {
        val index = panel.getFocusables(View.FOCUS_FORWARD).indexOf(currentFocus)
        // Sin esto el foco cae en la primera palabra al vaciar el panel, y eso cambiaría de sección.
        if (index >= 0) words[active.ordinal].requestFocus()
        showPanel(active)
        if (index >= 0) {
            val rows = panel.getFocusables(View.FOCUS_FORWARD)
            (rows.getOrNull(index) ?: rows.firstOrNull())?.requestFocus()
        }
    }

    private fun panelHasFocus(): Boolean {
        var v: View? = currentFocus
        while (v != null) {
            if (v === panel) return true
            v = v.parent as? View
        }
        return false
    }

    private fun isInPanel(view: View?): Boolean {
        var v: View? = view
        while (v != null) {
            if (v === panel) return true
            v = v.parent as? View
        }
        return false
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        boot?.let {
            if (event.action == KeyEvent.ACTION_UP) it.skip()
            return true
        }
        if (event.action == KeyEvent.ACTION_DOWN && !hasOverlay && panelKey(event.keyCode)) return true
        return super.dispatchKeyEvent(event)
    }

    /**
     * El foco del sistema elige lo más cercano en pantalla, y entre el índice y el panel eso
     * cambia de sección sin querer. Acá la regla es otra: se entra y se sale por un solo lugar.
     */
    private fun panelKey(code: Int): Boolean {
        val focused = currentFocus
        val inPanel = isInPanel(focused)
        return when (code) {
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                val leaves = inPanel && !isInPanel(focused?.focusSearch(View.FOCUS_LEFT))
                if (leaves) words[active.ordinal].requestFocus()
                leaves
            }
            KeyEvent.KEYCODE_DPAD_UP -> inPanel && !isInPanel(focused?.focusSearch(View.FOCUS_UP))
            KeyEvent.KEYCODE_DPAD_DOWN -> inPanel && !isInPanel(focused?.focusSearch(View.FOCUS_DOWN))
            KeyEvent.KEYCODE_DPAD_RIGHT -> {
                if (!inPanel) flushPanel()
                val first = if (inPanel) null else panel.getFocusables(View.FOCUS_FORWARD).firstOrNull()
                first?.requestFocus() ?: false
            }
            else -> false
        }
    }

    @Deprecated("Deprecated in Java")
    @Suppress("MissingSuperCall", "DEPRECATION")
    override fun onBackPressed() {
        when {
            hasOverlay -> super.onBackPressed()
            panelHasFocus() -> words[active.ordinal].requestFocus()
            // Es la pantalla de inicio: «atrás» no sale a ningún lado.
        }
    }

    // --- Paneles ---

    private fun showPanel(section: Section) {
        paintWords()
        panel.removeAllViews()
        val view = layoutInflater.inflate(R.layout.panel_section, panel, false)
        val label = view.findViewById<TextView>(R.id.panel_label)
        val title = view.findViewById<TextView>(R.id.panel_title)
        val body = view.findViewById<TextView>(R.id.panel_body)
        val extra = view.findViewById<LinearLayout>(R.id.panel_extra)
        when (section) {
            Section.APPS -> {
                label.text = resources.getQuantityString(R.plurals.home_apps_label, apps.size, apps.size)
                title.setText(R.string.home_apps_title)
                body.visibility = View.GONE
                bindTiles(extra)
            }
            Section.CINE -> {
                label.setText(R.string.word_cine)
                title.setText(R.string.home_cine_title)
                body.setText(R.string.home_cine_body)
                bindCine(extra)
            }
            Section.TIENDA -> {
                label.setText(R.string.word_tienda)
                title.setText(R.string.home_store_title)
                body.setText(R.string.home_store_body)
                bindStore(extra)
            }
            Section.CLAUDE -> {
                val ready = KeyVault.has(this)
                label.text = if (ready) ClaudeSettings.modelLabel(this) else getString(R.string.word_claude)
                title.setText(R.string.home_claude_title)
                body.setText(if (ready) R.string.home_claude_body else R.string.home_claude_no_key)
                panelRow(extra, getString(if (ready) R.string.claude_ask else R.string.claude_key_load), null, R.drawable.ic_chat) { open(Section.CLAUDE) }
            }
            Section.JUNTADA -> {
                label.setText(R.string.word_juntada)
                title.setText(R.string.home_party_title)
                body.setText(R.string.home_party_body)
                panelRow(extra, getString(R.string.home_party_open), null, R.drawable.ic_star) { open(Section.JUNTADA) }
                panelRow(extra, getString(R.string.home_race_open), null, R.drawable.ic_play) {
                    openScreen(Intent(this, CarreraActivity::class.java), getString(R.string.home_race_open))
                }
            }
            Section.PARED -> {
                val now = Calendar.getInstance()
                label.setText(R.string.word_pared)
                title.text = WordClock.phrase(now.get(Calendar.HOUR_OF_DAY), now.get(Calendar.MINUTE)).text
                body.setText(R.string.home_wall_body)
                panelRow(extra, getString(R.string.home_wall_open), null, R.drawable.ic_wall) { open(Section.PARED) }
            }
            Section.CELULAR -> {
                label.setText(R.string.word_celular)
                title.setText(R.string.home_remote_title)
                body.setText(R.string.home_remote_body)
                val row = if (prefs.remoteEnabled && RemoteState.running) R.string.home_remote_on else R.string.home_remote_off
                panelRow(extra, getString(row), null, R.drawable.ic_phone) { open(Section.CELULAR) }
            }
            Section.AJUSTES -> {
                label.setText(R.string.word_ajustes)
                title.setText(R.string.home_settings_title)
                body.visibility = View.GONE
                bindSettings(extra)
            }
        }
        panel.addView(view)
        if (Motion.full && boot == null) {
            Motion.reveal(listOf(label, title, body, extra), stagger = 26L, rise = 10f)
        }
    }

    /** Una fila del panel. La cinta se apoya en su título, igual que en las listas. */
    private fun panelRow(host: LinearLayout, title: CharSequence, subtitle: CharSequence?, icon: Int, action: () -> Unit) {
        val row = layoutInflater.inflate(R.layout.item_row, host, false)
        row.findViewById<TextView>(R.id.tape_anchor).text = title
        row.findViewById<TextView>(R.id.row_subtitle).apply {
            text = subtitle
            visibility = if (subtitle == null) View.GONE else View.VISIBLE
        }
        row.findViewById<TextView>(R.id.row_value).visibility = View.GONE
        row.findViewById<ImageView>(R.id.row_icon).setImageResource(icon)
        row.isFocusable = true
        row.isClickable = true
        row.setOnClickListener { action() }
        host.addView(row)
    }

    private fun bindCine(host: LinearLayout) {
        ResumeStore(this).recent(PANEL_ROWS).forEach { entry ->
            val file = File(entry.path)
            if (!file.exists()) return@forEach
            val left = Time.short(entry.duration - entry.position)
            panelRow(host, file.nameWithoutExtension, getString(R.string.home_cine_left, left), R.drawable.ic_video) {
                openScreen(CineActivity.player(this, file), file.nameWithoutExtension)
            }
        }
        val services = Streaming.ALL.filter { service ->
            Streaming.installed(service) { StreamingLauncher.isInstalled(this, it) } != null
        }
        services.take(PANEL_ROWS).forEach { service ->
            panelRow(host, service.name, null, R.drawable.ic_play) { StreamingLauncher.open(this, service) }
        }
        if (services.isEmpty()) {
            panelRow(host, getString(R.string.home_cine_services), null, R.drawable.ic_play) { open(Section.CINE) }
        }
        panelRow(host, getString(R.string.home_cine_browse), null, R.drawable.ic_folder) { open(Section.CINE) }
    }

    private fun bindStore(host: LinearLayout) {
        val catalog = Catalog.load(this)
        val installed = installedOf(catalog)
        val upgrades = Recommendations.upgrades(catalog, installed).take(PANEL_ROWS)
        upgrades.forEach { upgrade ->
            panelRow(host, upgrade.app.name, upgrade.app.summary, R.drawable.ic_store) {
                openScreen(
                    Intent(this, StoreDetailActivity::class.java).putExtra(StoreDetailActivity.EXTRA_ID, upgrade.app.id),
                    upgrade.app.name
                )
            }
        }
        panelRow(host, getString(R.string.home_store_all, catalog.apps.size), null, R.drawable.ic_arrow) { open(Section.TIENDA) }
    }

    private fun installedOf(catalog: Catalog): Set<String> {
        val everything = Installed.packages(this)
        return catalog.apps.flatMap { it.replaces + it.legacy + it.packageName }.filter { it in everything }.toSet()
    }

    private fun bindSettings(host: LinearLayout) {
        SystemScreens.wifi(this)?.let { wifi ->
            val state = getString(if (Device.isOnline(this)) R.string.net_other else R.string.net_off)
            panelRow(host, getString(R.string.set_wifi), state, R.drawable.ic_wifi) {
                openExternal(wifi, getString(R.string.set_wifi))
            }
        }
        panelRow(host, getString(R.string.cal_title), getString(R.string.cal_sub), R.drawable.ic_target) {
            openScreen(Intent(this, CalibrationActivity::class.java), getString(R.string.cal_title))
        }
        panelRow(host, getString(R.string.home_settings_all), null, R.drawable.ic_system) { open(Section.AJUSTES) }
    }

    private fun bindTiles(host: LinearLayout) {
        val shown = AppRepository.ordered(apps, prefs).take(TILES)
        if (shown.isEmpty()) return
        val gap = resources.getDimensionPixelSize(R.dimen.gap)
        shown.chunked(COLUMNS).forEachIndexed { r, rowApps ->
            val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
            rowApps.forEachIndexed { c, app ->
                val tile = tileFor(app, row)
                (tile.layoutParams as ViewGroup.MarginLayoutParams).marginStart = if (c == 0) 0 else gap
                row.addView(tile)
            }
            val lp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            if (r > 0) lp.topMargin = gap + gap / 2
            host.addView(row, lp)
        }
    }

    private fun tileFor(app: AppInfo, parent: ViewGroup): View {
        val tile = LayoutInflater.from(this).inflate(R.layout.item_tile, parent, false)
        AppsActivity.bindTile(tile, app)
        tile.setOnClickListener { launch(app.packageName, app.label) }
        tile.setOnLongClickListener {
            AppOptions.show(this, app) { showPanel(active) }
            true
        }
        val art = tile.findViewById<View>(R.id.tile_art)
        tile.setOnFocusChangeListener { _, focused ->
            if (Motion.full) {
                val s = if (focused) 1.05f else 1f
                art.animate().scaleX(s).scaleY(s).setDuration(Motion.FAST).setInterpolator(Motion.out).start()
            }
        }
        return tile
    }

    private fun launch(pkg: String, label: CharSequence?) {
        val intent = AppRepository.launchIntent(packageManager, pkg)
        if (intent == null) {
            Notice.show(this, getString(R.string.cant_open), Notice.Kind.ERROR)
            return
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        prefs.incrementUsage(pkg)
        openExternal(intent, label) { Notice.show(this, getString(R.string.cant_open), Notice.Kind.ERROR) }
    }

    private fun loadApps() {
        Thread {
            val list = Installed.loadApps(applicationContext)
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                apps = list
                boot?.status = bootStatus()
                if (active == Section.APPS && !panelHasFocus()) showPanel(active)
            }
        }.start()
    }

    private fun updateStatus() {
        val date = dateFormat.format(Date()).replace(".", "")
        status.text = "$date · ${Device.networkLabel(this)}"
    }

    companion object {
        const val EXTRA_REPLAY_BOOT = "gd.replay_boot"
        private const val COLUMNS = 4
        private const val TILES = 8
        private const val PANEL_ROWS = 3
        private const val PANEL_MS = 110L
        private const val RELOAD_MS = 600L

        /** Sin contador de encendidos, se repite solo si el proceso murió: es lo mejor que se puede saber. */
        private var playedThisProcess = false
    }
}
