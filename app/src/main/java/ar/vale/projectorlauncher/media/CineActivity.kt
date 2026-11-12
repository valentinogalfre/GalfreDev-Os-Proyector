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
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.apps.Streaming
import ar.vale.projectorlauncher.apps.StreamingLauncher
import ar.vale.projectorlauncher.device.Casting
import ar.vale.projectorlauncher.device.Functions
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Row
import ar.vale.projectorlauncher.ui.RowAdapter
import ar.vale.projectorlauncher.ui.Sheet
import ar.vale.projectorlauncher.ui.bindRows
import ar.vale.projectorlauncher.ui.selectFirst
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

    /** True mientras se ve «Más servicios»: lo que falta instalar y lo que se sacó de la lista. */
    private var more = false

    /** La fila que estaba elegida al volver a esta pantalla, y a qué altura, o null si la lista es otra. */
    private var keep: Spot? = null

    /** Desde qué fila se entró a «Más servicios»: al salir, se vuelve a ella. */
    private var moreFrom: Spot? = null

    private class Spot(val position: Int, val top: Int)

    private fun spot() = Spot(list.selectedItemPosition, (list.selectedView?.top ?: list.paddingTop) - list.paddingTop)

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

    /**
     * A la vista quedan los servicios instalados. Lo que falta, y lo que se sacó porque en este
     * equipo no anda, va detrás de «Más servicios»: la lista de Cine muestra lo que funciona.
     */
    private fun addServices(rows: MutableList<Row>) {
        val (shown, rest) = Streaming.split(Prefs(this).hiddenServices) { StreamingLauncher.isInstalled(this, it) }
        rows.add(Row.header(getString(R.string.cine_services)))
        shown.forEach { rows.add(serviceRow(it, manage = false)) }
        // Siempre está: es donde se arregla un servicio que no abre, y donde se suman los que faltan.
        val free = rest.count { it.free }
        rows.add(Row(
            getString(R.string.cine_more),
            subtitle = getString(R.string.cine_more_sub),
            value = if (free > 0) getString(R.string.cine_more_free, free) else null,
            icon = R.drawable.ic_store
        ) {
            moreFrom = spot()
            showMore()
        })
        rows.add(Row.header(getString(R.string.cine_other)))
        val receiver = Casting.best(this)
        rows.add(Row(
            getString(R.string.cast_title),
            subtitle = if (receiver != null) getString(R.string.cast_sub, receiver.name) else getString(R.string.cast_sub_none),
            icon = R.drawable.ic_phone
        ) { Casting.offer(this) })
        Installed.functions(this).firstOrNull { it.kind == Functions.Kind.HDMI }?.let { hdmi ->
            rows.add(Row(
                getString(hdmi.kind.label),
                subtitle = getString(R.string.streaming_hdmi_sub),
                icon = hdmi.kind.icon
            ) { openExternal(hdmi.intent, getString(hdmi.kind.label)) })
        }
    }

    /**
     * En Cine, OK lo abre, y mantener OK o Menú da las salidas: actualizarlo, la otra versión,
     * sacarlo de la lista. En «Más servicios» ([manage]), OK ya da las salidas.
     */
    private fun serviceRow(service: Streaming.Service, manage: Boolean): Row {
        val prefs = Prefs(this)
        val installed = Streaming.installed(service) { StreamingLauncher.isInstalled(this, it) } != null
        val hidden = service.name in prefs.hiddenServices
        val value = when {
            !installed -> getString(if (service.free) R.string.streaming_missing_free else R.string.streaming_missing)
            hidden -> getString(R.string.streaming_hidden)
            service.free -> getString(R.string.streaming_free)
            else -> null
        }
        val toggle = Sheet.Option(getString(if (hidden) R.string.streaming_show else R.string.streaming_hide), R.drawable.ic_display) {
            prefs.hiddenServices = if (hidden) prefs.hiddenServices - service.name else prefs.hiddenServices + service.name
            refresh()
        }
        val options = { StreamingLauncher.options(this, service, if (installed) listOf(toggle) else emptyList()) }
        return Row(service.name, value = value, icon = R.drawable.ic_play, longAction = options) {
            if (manage) options() else StreamingLauncher.open(this, service)
        }
    }

    private fun showMore() {
        if (!more) keep = null
        more = true
        setHead(getString(R.string.cine_more), title())
        val (shown, rest) = Streaming.split(Prefs(this).hiddenServices) { StreamingLauncher.isInstalled(this, it) }
        val rows = ArrayList<Row>()
        // Primero lo que falta y se ve sin pagar: es lo que más suma donde lo pago anda a medias.
        listOf(
            R.string.cine_more_free_head to rest.filter { it.free },
            R.string.cine_more_paid_head to rest.filter { !it.free },
            R.string.cine_more_listed to shown
        ).forEach { (head, group) ->
            if (group.isEmpty()) return@forEach
            rows.add(Row.header(getString(head)))
            group.forEach { rows.add(serviceRow(it, manage = true)) }
        }
        setNote(getString(R.string.cine_more_note))
        adapter.submit(rows)
        place()
    }

    /** Vuelve a armar la misma lista, sin mover la elección. */
    private fun refresh() {
        keep = spot()
        when {
            more -> showMore()
            dir != null -> showDir(dir!!)
            else -> showRoots()
        }
    }

    /**
     * Una lista nueva arranca arriba. La misma lista, al volver de otra pantalla, queda donde
     * estaba: quien probó un servicio que no abrió no tiene que bajar de nuevo hasta él.
     */
    private fun place() {
        val at = keep
        keep = null
        if (at != null && at.position > 0 && at.position < adapter.count && adapter.isEnabled(at.position)) {
            list.setSelectionFromTop(at.position, at.top)
        } else {
            list.selectFirst()
        }
    }

    private fun showRoots() {
        dir = null
        more = false
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
        place()
    }

    private fun showDir(target: File) {
        dir = target
        // Lo recibido va primero: vive dentro de la memoria interna y si no se lo confundiría con una carpeta más.
        val inbox = FileItem(Storage.inbox(this), FileKind.DIR, getString(R.string.cine_inbox))
        val place = Storage.place(target, listOf(inbox) + Storage.roots(this))
        setHead(place.title.ifEmpty { title() }, place.where)
        val items = Storage.list(target, apkOnly)
        setNote(if (items.isEmpty()) getString(if (apkOnly) R.string.apk_empty_dir else R.string.files_empty_dir) else null)
        adapter.submit(items.map(::rowFor))
        place()
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
        if (more && !hasOverlay) {
            keep = moreFrom
            showRoots()
            return
        }
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
