package ar.vale.projectorlauncher

import android.content.Intent
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import android.view.KeyEvent
import android.widget.ListView
import ar.vale.projectorlauncher.claude.ClaudeSettings
import ar.vale.projectorlauncher.device.BlackoutActivity
import ar.vale.projectorlauncher.device.CalibrationActivity
import ar.vale.projectorlauncher.device.Functions
import ar.vale.projectorlauncher.device.HomeRole
import ar.vale.projectorlauncher.device.SleepTimer
import ar.vale.projectorlauncher.device.SystemScreens
import ar.vale.projectorlauncher.media.Time
import ar.vale.projectorlauncher.remote.RemoteService
import ar.vale.projectorlauncher.ui.Device
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Row
import ar.vale.projectorlauncher.ui.RowAdapter
import ar.vale.projectorlauncher.ui.Screen
import ar.vale.projectorlauncher.ui.Sheet
import ar.vale.projectorlauncher.ui.bindRows

/** Ajustes: lo del proyector, lo del sistema y lo de galfredev OS, en una sola lista. */
class SettingsActivity : GdActivity() {

    /** Acá están la clave y los pedidos que se cobran: un invitado con el control prestado no entra. */
    override val ownerOnly: Boolean get() = true

    private lateinit var adapter: RowAdapter
    private lateinit var list: ListView
    private lateinit var audio: AudioManager
    private var functions: List<Functions.Found> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_list)
        audio = getSystemService(AudioManager::class.java)
        adapter = RowAdapter(this)
        list = findViewById(R.id.screen_list)
        list.bindRows(adapter)
        setHead(getString(R.string.word_ajustes), Device.networkLabel(this))
        Thread {
            val found = Installed.functions(applicationContext)
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                functions = found
                render()
            }
        }.start()
    }

    override fun onResume() {
        super.onResume()
        render()
    }

    private fun render() {
        val rows = ArrayList<Row>()
        projector(rows)
        system(rows)
        os(rows)
        about(rows)
        adapter.submit(rows)
    }

    private fun projector(rows: MutableList<Row>) {
        rows.add(Row.header(getString(R.string.set_projector)))
        functions.forEach { fn ->
            rows.add(Row(getString(fn.kind.label), icon = fn.kind.icon) {
                if (fn.broadcast) sendBroadcast(fn.intent) else openExternal(fn.intent, getString(fn.kind.label))
            })
        }
        rows.add(Row(getString(R.string.cal_title), subtitle = getString(R.string.cal_sub), icon = R.drawable.ic_target) {
            openScreen(Intent(this, CalibrationActivity::class.java), getString(R.string.cal_title))
        })
        rows.add(Row(getString(R.string.set_blackout), subtitle = getString(R.string.set_blackout_sub), icon = R.drawable.ic_moon) {
            openScreen(Intent(this, BlackoutActivity::class.java), null)
        })
        val left = SleepTimer.remainingMinutes(this)
        rows.add(Row(
            getString(R.string.set_sleep),
            subtitle = getString(if (SleepTimer.canLock(this)) R.string.set_sleep_lock else R.string.set_sleep_black),
            value = left?.let { getString(R.string.set_minutes, it) } ?: getString(R.string.value_off),
            icon = R.drawable.ic_power
        ) { showSleep() })
    }

    private fun system(rows: MutableList<Row>) {
        rows.add(Row.header(getString(R.string.set_system)))
        system(rows, R.string.set_wifi, R.drawable.ic_wifi, SystemScreens.wifi(this))
        system(rows, R.string.set_bluetooth, R.drawable.ic_bluetooth, SystemScreens.bluetooth(this))
        rows.add(Row(
            getString(R.string.set_volume),
            subtitle = getString(R.string.set_volume_sub),
            value = "${volumePercent()}%",
            icon = R.drawable.ic_sound
        ) { adjustVolume(1) })
        system(rows, R.string.set_display, R.drawable.ic_display, SystemScreens.display(this))
        system(rows, R.string.set_date, R.drawable.ic_time, SystemScreens.date(this))
        system(rows, R.string.set_language, R.drawable.ic_globe, SystemScreens.language(this))
        system(rows, R.string.set_storage, R.drawable.ic_storage, SystemScreens.storage(this))
        system(rows, R.string.set_apps, R.drawable.ic_apps, SystemScreens.apps(this))
        system(rows, R.string.set_all, R.drawable.ic_system, SystemScreens.all(this))
        system(rows, R.string.set_sys_about, R.drawable.ic_info, SystemScreens.about(this))
        system(rows, R.string.set_sys_dev, R.drawable.ic_shield, SystemScreens.developer(this), R.string.set_sys_dev_sub)
    }

    private fun system(rows: MutableList<Row>, label: Int, icon: Int, intent: Intent?, subtitle: Int? = null) {
        if (intent == null) return
        rows.add(Row(getString(label), subtitle = subtitle?.let(::getString), icon = icon) {
            openExternal(intent, getString(label))
        })
    }

    private fun os(rows: MutableList<Row>) {
        rows.add(Row.header(getString(R.string.set_home_section)))
        val home = HomeRole.isDefault(this)
        rows.add(Row(
            getString(R.string.set_home),
            value = getString(if (home) R.string.value_yes else R.string.value_no),
            icon = R.drawable.ic_home
        ) { if (!home) requestHome() })
        rows.add(Row(
            getString(R.string.set_primary_app),
            value = prefs.primaryPkg?.let(::labelOf) ?: getString(R.string.value_none),
            icon = R.drawable.ic_star
        ) { pickPrimary() })
        rows.add(toggle(R.string.set_auto_boot, R.string.set_auto_boot_sub, R.drawable.ic_power, prefs.autoLaunchOnBoot) {
            prefs.autoLaunchOnBoot = it
        })
        rows.add(toggle(R.string.set_sort_usage, null, R.drawable.ic_apps, prefs.sortByUsage) { prefs.sortByUsage = it })
        rows.add(Row(getString(R.string.set_theme), value = themeLabel(), icon = R.drawable.ic_moon) { nextTheme() })
        rows.add(Row(getString(R.string.set_motion), subtitle = motionSubtitle(), value = motionLabel(), icon = R.drawable.ic_play) { nextMotion() })
        rows.add(toggle(R.string.set_boot_anim, null, R.drawable.ic_video, prefs.bootAnimation) { prefs.bootAnimation = it })
        rows.add(Row(getString(R.string.set_replay_boot), icon = R.drawable.ic_refresh) {
            startActivity(
                Intent(this, LauncherActivity::class.java)
                    .putExtra(LauncherActivity.EXTRA_REPLAY_BOOT, true)
                    .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            )
            noTransition()
        })
        rows.add(Row(
            getString(R.string.set_wall_idle),
            value = if (prefs.wallIdleMinutes == 0) getString(R.string.value_off) else getString(R.string.set_minutes, prefs.wallIdleMinutes.toLong()),
            icon = R.drawable.ic_wall
        ) { nextIdle() })
        rows.add(Row(getString(R.string.word_claude), subtitle = getString(R.string.set_claude_sub), value = ClaudeSettings.modelLabel(this), icon = R.drawable.ic_ai) {
            ClaudeSettings.show(this) { render() }
        })
        rows.add(toggle(R.string.set_remote, R.string.set_remote_sub, R.drawable.ic_phone, prefs.remoteEnabled) {
            prefs.remoteEnabled = it
            if (it) RemoteService.start(this) else RemoteService.stop(this)
        })
    }

    private fun about(rows: MutableList<Row>) {
        rows.add(Row.header(getString(R.string.set_about)))
        val size = Screen.realSize(this)
        val measured = prefs.measuredFrameMs
        rows.add(Row(
            getString(R.string.set_version),
            value = BuildInfo.versionName(this),
            icon = R.drawable.ic_info
        ) { Sheet.show(this, getString(R.string.app_name), listOf(Sheet.Option(getString(R.string.back)) {}), getString(R.string.set_about_body)) })
        rows.add(Row(
            getString(R.string.set_device),
            subtitle = "${Build.MANUFACTURER} ${Build.MODEL}",
            value = "${size.x} × ${size.y}",
            icon = R.drawable.ic_projector
        ) {})
        rows.add(Row(
            getString(R.string.set_platform),
            subtitle = getString(R.string.set_abi, Build.SUPPORTED_ABIS.firstOrNull().orEmpty()),
            value = "Android ${Build.VERSION.RELEASE}",
            icon = R.drawable.ic_system
        ) {})
        if (measured > 0f) {
            rows.add(Row(getString(R.string.set_measured), value = getString(R.string.set_ms, measured), icon = R.drawable.ic_time) {})
        }
        val free = filesDir.usableSpace
        rows.add(Row(getString(R.string.set_free), value = Time.size(free), icon = R.drawable.ic_storage) {})
        rows.add(Row(getString(R.string.set_licenses), icon = R.drawable.ic_file) { showLicenses() })
    }

    private fun toggle(title: Int, subtitle: Int?, icon: Int, value: Boolean, apply: (Boolean) -> Unit) =
        Row(
            getString(title),
            subtitle = subtitle?.let(::getString),
            value = getString(if (value) R.string.value_on else R.string.value_off),
            icon = icon
        ) {
            apply(!value)
            render()
        }

    private fun labelOf(pkg: String): String =
        runCatching { packageManager.getApplicationLabel(packageManager.getApplicationInfo(pkg, 0)).toString() }.getOrDefault(pkg)

    // --- Volumen ---

    private fun volumePercent(): Int {
        val max = audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC).coerceAtLeast(1)
        return audio.getStreamVolume(AudioManager.STREAM_MUSIC) * 100 / max
    }

    private fun adjustVolume(direction: Int) {
        audio.adjustStreamVolume(
            AudioManager.STREAM_MUSIC,
            if (direction > 0) AudioManager.ADJUST_RAISE else AudioManager.ADJUST_LOWER,
            0
        )
        render()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val row = list.selectedItem as? Row
        val onVolume = row?.title == getString(R.string.set_volume)
        if (onVolume && keyCode == KeyEvent.KEYCODE_DPAD_LEFT) {
            adjustVolume(-1)
            return true
        }
        if (onVolume && keyCode == KeyEvent.KEYCODE_DPAD_RIGHT) {
            adjustVolume(1)
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    // --- Elecciones ---

    private fun requestHome() {
        val intent = HomeRole.requestIntent(this)
        if (intent != null) {
            openExternal(intent, null)
        } else {
            Sheet.show(this, getString(R.string.set_home), listOf(Sheet.Option(getString(R.string.back)) {}),
                getString(R.string.set_home_adb, HomeRole.adbCommand(this)))
        }
    }

    private fun pickPrimary() {
        Thread {
            val apps = AppRepository.loadApps(applicationContext)
            runOnUiThread {
                if (isDestroyed) return@runOnUiThread
                val options = ArrayList<Sheet.Option>()
                options.add(Sheet.Option(getString(R.string.value_none)) {
                    prefs.primaryPkg = null
                    render()
                })
                apps.forEach { app ->
                    options.add(Sheet.Option(app.label) {
                        prefs.primaryPkg = app.packageName
                        render()
                    })
                }
                Sheet.show(this, getString(R.string.set_primary_app), options)
            }
        }.start()
    }

    private fun themeLabel() = getString(when (prefs.theme) {
        Prefs.THEME_DAY -> R.string.theme_day
        Prefs.THEME_AUTO -> R.string.theme_auto
        else -> R.string.theme_carbon
    })

    private fun nextTheme() {
        prefs.theme = when (prefs.theme) {
            Prefs.THEME_CARBON -> Prefs.THEME_DAY
            Prefs.THEME_DAY -> Prefs.THEME_AUTO
            else -> Prefs.THEME_CARBON
        }
        recreate()
    }

    private fun motionLabel() = getString(when (prefs.motion) {
        Prefs.MOTION_FULL -> R.string.motion_full
        Prefs.MOTION_REDUCED -> R.string.motion_reduced
        else -> R.string.motion_auto
    })

    private fun motionSubtitle(): String? =
        if (prefs.motion == Prefs.MOTION_AUTO) getString(R.string.motion_auto_sub) else null

    private fun nextMotion() {
        prefs.motion = when (prefs.motion) {
            Prefs.MOTION_AUTO -> Prefs.MOTION_FULL
            Prefs.MOTION_FULL -> Prefs.MOTION_REDUCED
            else -> Prefs.MOTION_AUTO
        }
        ar.vale.projectorlauncher.ui.Motion.load(prefs)
        render()
    }

    private fun nextIdle() {
        val steps = listOf(0, 5, 10, 30)
        prefs.wallIdleMinutes = steps[(steps.indexOf(prefs.wallIdleMinutes) + 1) % steps.size]
        render()
    }

    private fun showSleep() {
        val options = ArrayList<Sheet.Option>()
        listOf(15, 30, 60, 90, 120).forEach { minutes ->
            options.add(Sheet.Option(getString(R.string.set_minutes, minutes.toLong()), R.drawable.ic_time) {
                SleepTimer.start(this, minutes)
                Notice.show(this, getString(R.string.set_sleep_on, minutes))
                render()
            })
        }
        if (SleepTimer.remainingMinutes(this) != null) {
            options.add(Sheet.Option(getString(R.string.set_sleep_cancel), R.drawable.ic_trash) {
                SleepTimer.cancel(this)
                render()
            })
        }
        if (!SleepTimer.canLock(this)) {
            options.add(Sheet.Option(getString(R.string.set_sleep_admin), R.drawable.ic_shield) {
                openExternal(SleepTimer.requestLockIntent(this, getString(R.string.set_sleep_admin_why)), null) {
                    Notice.show(this, getString(R.string.set_sleep_admin_missing), Notice.Kind.WARN)
                }
            })
        }
        Sheet.show(this, getString(R.string.set_sleep), options, getString(R.string.set_sleep_body))
    }

    private fun showLicenses() {
        val text = assets.open("licenses/README.txt").bufferedReader().use { it.readText() }
        Sheet.show(this, getString(R.string.set_licenses), listOf(Sheet.Option(getString(R.string.back)) {}), text)
    }
}

/** Sin BuildConfig para no generar otra clase por una versión. */
object BuildInfo {
    fun versionName(context: android.content.Context): String =
        runCatching { context.packageManager.getPackageInfo(context.packageName, 0).versionName.orEmpty() }.getOrDefault("")
}
