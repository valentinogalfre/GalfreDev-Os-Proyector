package ar.vale.projectorlauncher.media

import ar.vale.projectorlauncher.Installed
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.widget.ListView
import android.widget.TextView
import ar.vale.projectorlauncher.ApkInstaller
import ar.vale.projectorlauncher.FileItem
import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.MediaTypes
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.apps.Streaming
import ar.vale.projectorlauncher.apps.StreamingLauncher
import ar.vale.projectorlauncher.device.Functions
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Row
import ar.vale.projectorlauncher.ui.RowAdapter
import ar.vale.projectorlauncher.ui.bindRows
import java.io.File

/**
 * Cine: lo último que venías viendo, la memoria, los USB y lo que llegó desde el celular.
 * Con [EXTRA_APK_ONLY] es el instalador: muestra solo carpetas y archivos .apk.
 */
class CineActivity : GdActivity() {

    private lateinit var list: ListView
    private lateinit var note: TextView
    private lateinit var adapter: RowAdapter
    private lateinit var resume: ResumeStore
    private var dir: File? = null
    private var apkOnly = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.screen_list)
        apkOnly = intent.getBooleanExtra(EXTRA_APK_ONLY, false)
        resume = ResumeStore(this)
        list = findViewById(R.id.screen_list)
        note = findViewById(R.id.screen_note)
        adapter = RowAdapter(this)
        list.bindRows(adapter)
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        refresh()
    }

    private fun title() = getString(if (apkOnly) R.string.apk_title else R.string.word_cine)

    private fun addServices(rows: MutableList<Row>) {
        rows.add(Row.header(getString(R.string.cine_services)))
        Streaming.ALL.forEach { service ->
            val installed = Streaming.installed(service) { StreamingLauncher.isInstalled(this, it) } != null
            rows.add(Row(
                service.name,
                value = if (installed) null else getString(R.string.streaming_missing),
                icon = R.drawable.ic_play
            ) { StreamingLauncher.open(this, service) })
        }
        Installed.functions(this).firstOrNull { it.kind == Functions.Kind.HDMI }?.let { hdmi ->
            rows.add(Row(
                getString(hdmi.kind.label),
                subtitle = getString(R.string.streaming_hdmi_sub),
                icon = hdmi.kind.icon
            ) { openExternal(hdmi.intent, getString(hdmi.kind.label)) })
        }
    }

    private fun refresh() {
        dir?.let { showDir(it) } ?: showRoots()
    }

    private fun showRoots() {
        dir = null
        setHead(title())
        val rows = ArrayList<Row>()
        val access = Storage.access(this)
        if (!apkOnly) {
            val recent = resume.recent(RECENT).filter { File(it.path).exists() }
            if (recent.isNotEmpty()) {
                rows.add(Row.header(getString(R.string.cine_continue)))
                recent.forEach { entry ->
                    val file = File(entry.path)
                    rows.add(Row(
                        file.nameWithoutExtension,
                        value = getString(R.string.cine_left, Time.short(entry.duration - entry.position)),
                        icon = R.drawable.ic_play
                    ) { play(file, FileKind.VIDEO) })
                }
            }
        }
        if (!apkOnly) addServices(rows)
        rows.add(Row.header(getString(R.string.cine_sources)))
        if (access == Storage.Access.NONE) {
            rows.add(Row(
                getString(R.string.files_grant),
                subtitle = getString(R.string.files_need_permission),
                icon = R.drawable.ic_shield
            ) { requestPermissions(Storage.mediaPermissions(), REQUEST_MEDIA) })
        } else {
            Storage.roots(this).forEach { root ->
                val external = root.file.absolutePath != Environment.getExternalStorageDirectory()?.absolutePath
                rows.add(Row(root.name, icon = if (external) R.drawable.ic_usb else R.drawable.ic_storage) { showDir(root.file) })
            }
        }
        val inbox = Storage.inbox(this)
        if (inbox.list()?.isNotEmpty() == true) {
            rows.add(Row(getString(R.string.cine_inbox), icon = R.drawable.ic_phone) { showDir(inbox) })
        }
        if (access == Storage.Access.MEDIA) {
            val intent = Storage.fullAccessIntent(this)
            rows.add(Row.header(getString(R.string.cine_limited)))
            rows.add(Row(
                getString(R.string.files_full_access),
                subtitle = getString(if (intent != null) R.string.files_full_access_sub else R.string.files_full_access_missing),
                icon = R.drawable.ic_shield
            ) {
                if (intent != null) openExternal(intent, null) else Notice.show(this, getString(R.string.files_full_access_adb, packageName))
            })
        }
        setNote(if (rows.none { !it.isHeader }) getString(R.string.files_empty_roots) else null)
        adapter.submit(rows)
        list.setSelection(0)
    }

    private fun showDir(target: File) {
        dir = target
        if (target == Storage.inbox(this)) {
            setHead(getString(R.string.cine_inbox))
        } else {
            setHead(target.name.ifEmpty { title() }, target.parent)
        }
        val items = Storage.list(target, apkOnly)
        setNote(if (items.isEmpty()) getString(if (apkOnly) R.string.apk_empty_dir else R.string.files_empty_dir) else null)
        adapter.submit(items.map(::rowFor))
        list.setSelection(0)
    }

    private fun rowFor(item: FileItem): Row {
        val icon = when (item.kind) {
            FileKind.DIR -> R.drawable.ic_folder
            FileKind.VIDEO -> R.drawable.ic_video
            FileKind.AUDIO -> R.drawable.ic_audio
            FileKind.IMAGE -> R.drawable.ic_image
            FileKind.PDF -> R.drawable.ic_presentation
            FileKind.APK -> R.drawable.ic_install
            FileKind.OTHER -> R.drawable.ic_file
        }
        val size = if (item.kind == FileKind.DIR) null else Time.size(item.file.length())
        return Row(item.name, value = size, icon = icon) { open(item) }
    }

    private fun open(item: FileItem) {
        when (item.kind) {
            FileKind.DIR -> showDir(item.file)
            FileKind.VIDEO, FileKind.AUDIO, FileKind.IMAGE, FileKind.PDF -> play(item.file, item.kind)
            FileKind.APK -> ApkInstaller.install(this, item.file)
            FileKind.OTHER -> Notice.show(this, getString(R.string.files_cant_open_here))
        }
    }

    private fun play(file: File, kind: FileKind) {
        openScreen(player(this, file, kind), file.nameWithoutExtension)
    }

    private fun setNote(text: String?) {
        note.text = text
        note.visibility = if (text == null) View.GONE else View.VISIBLE
    }

    @Deprecated("Deprecated in Java")
    @Suppress("MissingSuperCall", "DEPRECATION")
    override fun onBackPressed() {
        val current = dir
        if (hasOverlay || current == null) {
            super.onBackPressed()
            return
        }
        val parent = current.parentFile
        val atRoot = parent == null || parent.absolutePath == "/storage" ||
            current.absolutePath == Environment.getExternalStorageDirectory()?.absolutePath ||
            current == Storage.inbox(this)
        if (atRoot) showRoots() else showDir(parent!!)
    }

    companion object {
        const val EXTRA_APK_ONLY = "apk_only"
        private const val REQUEST_MEDIA = 1
        private const val RECENT = 3

        fun player(context: Context, file: File, kind: FileKind = MediaTypes.kindOf(file)): Intent =
            Intent(context, PlayerActivity::class.java)
                .putExtra(PlayerActivity.EXTRA_PATH, file.absolutePath)
                .putExtra(PlayerActivity.EXTRA_KIND, kind.name)
    }
}
