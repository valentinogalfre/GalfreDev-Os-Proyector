package ar.vale.projectorlauncher

import android.animation.ObjectAnimator
import android.app.Activity
import android.app.AlertDialog
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.BatteryManager
import android.os.Bundle
import android.provider.Settings
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.view.animation.LinearInterpolator
import android.widget.EditText
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Pantalla de inicio (HOME) de Galfré Launcher.
 *
 * Reúne: reloj + fecha, estado de red/batería, app principal destacada,
 * atajos rápidos a ajustes del sistema, buscador y grilla de apps con
 * favoritos, orden por uso y animaciones de entrada.
 */
class LauncherActivity : Activity() {

    private lateinit var prefs: Prefs
    private lateinit var adapter: AppTileAdapter
    private lateinit var grid: GridView
    private lateinit var clock: TextView
    private lateinit var dateText: TextView
    private lateinit var statusText: TextView
    private lateinit var search: EditText
    private lateinit var appsCount: TextView
    private lateinit var heroIcon: ImageView
    private lateinit var heroTitle: TextView
    private lateinit var heroSub: TextView
    private lateinit var defaultChip: View

    private val allApps = ArrayList<AppInfo>()
    private var displayApps = ArrayList<AppInfo>()
    private var batteryPct = -1

    private val locale = Locale("es", "AR")

    private val timeReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) = updateClock()
    }

    private val batteryReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val level = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            if (level >= 0 && scale > 0) batteryPct = level * 100 / scale
            updateStatus()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = Prefs(this)
        setContentView(R.layout.activity_launcher)
        setupImmersive()

        clock = findViewById(R.id.clock)
        dateText = findViewById(R.id.date)
        statusText = findViewById(R.id.status)
        search = findViewById(R.id.search)
        appsCount = findViewById(R.id.apps_count)
        grid = findViewById(R.id.grid)
        heroIcon = findViewById(R.id.hero_icon)
        heroTitle = findViewById(R.id.hero_title)
        heroSub = findViewById(R.id.hero_sub)
        defaultChip = findViewById(R.id.default_chip)

        adapter = AppTileAdapter(this)
        grid.adapter = adapter
        grid.setOnItemClickListener { _, _, pos, _ -> launch(displayApps[pos]) }
        grid.setOnItemLongClickListener { _, _, pos, _ -> showAppDialog(displayApps[pos]); true }

        findViewById<View>(R.id.hero).setOnClickListener { launchPrimary() }
        findViewById<View>(R.id.btn_settings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
        defaultChip.setOnClickListener { openHomeSettings() }

        wireQuick(R.id.q_wifi, Settings.ACTION_WIFI_SETTINGS)
        wireQuick(R.id.q_bt, Settings.ACTION_BLUETOOTH_SETTINGS)
        wireQuick(R.id.q_display, Settings.ACTION_DISPLAY_SETTINGS)
        wireQuick(R.id.q_sound, Settings.ACTION_SOUND_SETTINGS)
        wireQuick(R.id.q_all, Settings.ACTION_SETTINGS)

        search.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) = filter(s?.toString().orEmpty())
            override fun beforeTextChanged(s: CharSequence?, a: Int, b: Int, c: Int) {}
            override fun onTextChanged(s: CharSequence?, a: Int, b: Int, c: Int) {}
        })

        startGlow(findViewById(R.id.glow))
        loadAppsAsync()
        maybeAutoLaunchOnBoot()
    }

    override fun onStart() {
        super.onStart()
        registerReceiver(timeReceiver, IntentFilter().apply {
            addAction(Intent.ACTION_TIME_TICK)
            addAction(Intent.ACTION_TIME_CHANGED)
            addAction(Intent.ACTION_TIMEZONE_CHANGED)
        })
        registerReceiver(batteryReceiver, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
    }

    override fun onStop() {
        super.onStop()
        runCatching { unregisterReceiver(timeReceiver) }
        runCatching { unregisterReceiver(batteryReceiver) }
    }

    override fun onResume() {
        super.onResume()
        updateClock()
        updateStatus()
        refreshDefaultChip()
        if (allApps.isNotEmpty()) {
            applyOrder()
            filter(search.text?.toString().orEmpty())
            bindHero()
        }
    }

    @Suppress("DEPRECATION")
    private fun setupImmersive() {
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    }

    private fun loadAppsAsync() {
        Thread {
            val list = AppRepository.loadApps(this)
            runOnUiThread {
                allApps.clear()
                allApps.addAll(list)
                applyOrder()
                filter(search.text?.toString().orEmpty())
                bindHero()
                grid.scheduleLayoutAnimation()
            }
        }.start()
    }

    /** Orden: favoritos primero, luego por uso (si está activo) y por nombre. */
    private fun applyOrder() {
        val favs = prefs.favorites
        val byUsage = prefs.sortByUsage
        allApps.sortWith(
            compareByDescending<AppInfo> { favs.contains(it.packageName) }
                .thenByDescending { if (byUsage) prefs.usageCount(it.packageName) else 0 }
                .thenBy { it.label.lowercase(locale) }
        )
    }

    private fun filter(query: String) {
        val q = query.trim().lowercase(locale)
        displayApps = if (q.isEmpty()) ArrayList(allApps)
        else ArrayList(allApps.filter { it.label.lowercase(locale).contains(q) })
        adapter.setItems(displayApps, prefs.primaryPkg, prefs.favorites)
        appsCount.text = getString(R.string.apps_count, displayApps.size)
    }

    private fun bindHero() {
        val pkg = prefs.primaryPkg
        val app = pkg?.let { p -> allApps.firstOrNull { it.packageName == p } }
        if (app != null) {
            heroIcon.setImageDrawable(app.icon)
            heroIcon.visibility = View.VISIBLE
            heroTitle.text = app.label
            heroSub.text = getString(R.string.hero_open)
        } else {
            heroIcon.visibility = View.GONE
            heroTitle.text = getString(R.string.hero_none_title)
            heroSub.text = getString(R.string.hero_none_sub)
        }
    }

    private fun launch(app: AppInfo) {
        val i = packageManager.getLaunchIntentForPackage(app.packageName)
        if (i == null) { toast(getString(R.string.cant_open)); return }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        prefs.incrementUsage(app.packageName)
        runCatching { startActivity(i) }.onFailure { toast(getString(R.string.cant_open)) }
    }

    private fun launchPrimary() {
        val pkg = prefs.primaryPkg ?: return showPrimaryPicker()
        val app = allApps.firstOrNull { it.packageName == pkg }
        if (app != null) { launch(app); return }
        val i = packageManager.getLaunchIntentForPackage(pkg)
        if (i != null) {
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            runCatching { startActivity(i) }
        } else showPrimaryPicker()
    }

    /** Si venimos de un arranque marcado por BootReceiver, abrimos la app principal una sola vez. */
    private fun maybeAutoLaunchOnBoot() {
        if (!prefs.pendingBootLaunch) return
        prefs.pendingBootLaunch = false
        if (!prefs.autoLaunchOnBoot) return
        val pkg = prefs.primaryPkg ?: return
        val i = packageManager.getLaunchIntentForPackage(pkg) ?: return
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        runCatching { startActivity(i) }
    }

    private fun showPrimaryPicker() {
        if (allApps.isEmpty()) return
        val labels = allApps.map { it.label }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle(R.string.pick_primary)
            .setItems(labels) { _, which ->
                prefs.primaryPkg = allApps[which].packageName
                bindHero(); applyOrder(); filter(search.text?.toString().orEmpty())
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun showAppDialog(app: AppInfo) {
        val isPrimary = app.packageName == prefs.primaryPkg
        val isFav = prefs.isFavorite(app.packageName)
        val options = arrayOf(
            if (isPrimary) getString(R.string.unset_primary) else getString(R.string.set_primary),
            if (isFav) getString(R.string.unfavorite) else getString(R.string.favorite),
            getString(R.string.app_info),
            getString(R.string.uninstall)
        )
        AlertDialog.Builder(this)
            .setTitle(app.label)
            .setItems(options) { _, which ->
                when (which) {
                    0 -> { prefs.primaryPkg = if (isPrimary) null else app.packageName; bindHero() }
                    1 -> prefs.toggleFavorite(app.packageName)
                    2 -> openAppInfo(app.packageName)
                    3 -> uninstall(app.packageName)
                }
                applyOrder(); filter(search.text?.toString().orEmpty())
            }
            .show()
    }

    private fun openAppInfo(pkg: String) {
        runCatching {
            startActivity(
                Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:$pkg"))
            )
        }
    }

    @Suppress("DEPRECATION")
    private fun uninstall(pkg: String) {
        runCatching {
            startActivity(Intent(Intent.ACTION_UNINSTALL_PACKAGE, Uri.parse("package:$pkg")))
        }
    }

    private fun wireQuick(id: Int, action: String) {
        findViewById<View>(id).setOnClickListener {
            runCatching { startActivity(Intent(action)) }
                .onFailure { runCatching { startActivity(Intent(Settings.ACTION_SETTINGS)) } }
        }
    }

    private fun updateClock() {
        val now = Date()
        clock.text = SimpleDateFormat("HH:mm", locale).format(now)
        val d = SimpleDateFormat("EEEE d 'de' MMMM", locale).format(now)
        dateText.text = d.replaceFirstChar { it.titlecase(locale) }
    }

    private fun updateStatus() {
        val net = when {
            !isOnline() -> getString(R.string.net_off)
            isWifi() -> getString(R.string.net_wifi)
            else -> getString(R.string.net_data)
        }
        statusText.text =
            if (batteryPct in 0..100) "$net   •   $batteryPct%" else net
    }

    private fun caps(): NetworkCapabilities? {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return null
        return cm.getNetworkCapabilities(cm.activeNetwork)
    }

    private fun isOnline() = caps()?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
    private fun isWifi() = caps()?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true

    private fun refreshDefaultChip() {
        defaultChip.visibility = if (isDefaultHome()) View.GONE else View.VISIBLE
    }

    private fun isDefaultHome(): Boolean {
        val i = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
        val res = packageManager.resolveActivity(i, PackageManager.MATCH_DEFAULT_ONLY)
        return res?.activityInfo?.packageName == packageName
    }

    private fun openHomeSettings() {
        runCatching { startActivity(Intent(Settings.ACTION_HOME_SETTINGS)) }
            .onFailure { runCatching { startActivity(Intent(Settings.ACTION_SETTINGS)) } }
    }

    /** Resplandor animado detrás del encabezado: identidad viva, costo casi nulo. */
    private fun startGlow(glow: View) {
        ObjectAnimator.ofFloat(glow, "alpha", 0.40f, 0.85f).apply {
            duration = 3800; repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE; interpolator = LinearInterpolator(); start()
        }
        ObjectAnimator.ofFloat(glow, "scaleX", 0.9f, 1.18f).apply {
            duration = 5200; repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE; interpolator = LinearInterpolator(); start()
        }
        ObjectAnimator.ofFloat(glow, "scaleY", 0.9f, 1.18f).apply {
            duration = 5200; repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE; interpolator = LinearInterpolator(); start()
        }
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()

    @Deprecated("Deprecated in Java")
    @Suppress("MissingSuperCall")
    override fun onBackPressed() {
        // Es la pantalla de inicio: el botón "atrás" no debe salir del launcher.
    }
}
