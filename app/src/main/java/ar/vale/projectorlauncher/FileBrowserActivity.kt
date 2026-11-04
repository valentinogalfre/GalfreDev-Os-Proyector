package ar.vale.projectorlauncher

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.Settings
import android.view.View
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import java.io.File

/**
 * Explorador de archivos (USB / memoria) navegable por control remoto.
 * Abre video/música/imagen en PlayerActivity.
 */
class FileBrowserActivity : Activity() {

    private lateinit var list: ListView
    private lateinit var adapter: FileListAdapter
    private lateinit var pathLabel: TextView
    private lateinit var emptyView: TextView
    private lateinit var permissionView: View

    /** Modo "instalar APK": solo muestra carpetas y .apk. */
    private var apkMode = false

    /** null = pantalla de orígenes (raíces); si no, la carpeta actual. */
    private var currentDir: File? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_file_browser)
        apkMode = intent.getStringExtra(EXTRA_MODE) == MODE_APK
        if (apkMode) findViewById<TextView>(R.id.browser_title).setText(R.string.apk_title)
        list = findViewById(R.id.file_list)
        pathLabel = findViewById(R.id.path_label)
        emptyView = findViewById(R.id.empty_view)
        permissionView = findViewById(R.id.permission_view)
        adapter = FileListAdapter(this)
        list.adapter = adapter
        list.setOnItemClickListener { _, _, pos, _ -> onItemClick(adapter.getItem(pos)) }
        findViewById<View>(R.id.btn_grant).setOnClickListener { requestStorageAccess() }
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    /** Re-evalúa el permiso y vuelve a mostrar orígenes o la carpeta actual. */
    private fun refresh() {
        if (hasStorageAccess()) {
            permissionView.visibility = View.GONE
            val dir = currentDir
            if (dir == null) showRoots() else showDir(dir)
        } else {
            permissionView.visibility = View.VISIBLE
            list.visibility = View.GONE
            emptyView.visibility = View.GONE
            pathLabel.text = ""
        }
    }

    private fun hasStorageAccess(): Boolean =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) Environment.isExternalStorageManager()
        else checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED

    private fun requestStorageAccess() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val i = Intent(
                Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION,
                Uri.parse("package:$packageName")
            )
            runCatching { startActivity(i) }.onFailure {
                runCatching { startActivity(Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)) }
                    .onFailure {
                        // Algunos firmwares AOSP/TV no traen la pantalla de "acceso a todos los archivos".
                        Toast.makeText(this, R.string.files_permission_screen_missing, Toast.LENGTH_LONG).show()
                    }
            }
        } else {
            requestPermissions(arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE), REQ_READ)
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        refresh()
    }

    private fun showRoots() {
        currentDir = null
        pathLabel.text = getString(R.string.files_origins)
        val roots = ArrayList<FileItem>()
        val internal = Environment.getExternalStorageDirectory()
        if (internal != null && internal.exists()) {
            roots.add(FileItem(internal, FileKind.DIR, getString(R.string.files_internal)))
        }
        val children = File("/storage").listFiles()
        if (children != null) {
            for (c in children) {
                if (!c.isDirectory) continue
                val n = c.name
                if (n == "emulated" || n == "self") continue
                if (internal != null && c.absolutePath == internal.absolutePath) continue
                if (!c.canRead()) continue
                roots.add(FileItem(c, FileKind.DIR, getString(R.string.files_usb, n)))
            }
        }
        bind(roots, getString(R.string.files_empty_roots))
    }

    private fun showDir(dir: File) {
        currentDir = dir
        pathLabel.text = dir.absolutePath
        val entries = dir.listFiles()
        val items = ArrayList<FileItem>()
        if (entries != null) {
            for (f in entries) {
                if (f.isHidden) continue
                val kind = MediaTypes.kindOf(f)
                if (apkMode && kind != FileKind.DIR && kind != FileKind.APK) continue
                items.add(FileItem(f, kind))
            }
            items.sortWith(
                compareByDescending<FileItem> { it.kind == FileKind.DIR }
                    .thenBy { it.name.lowercase() }
            )
        }
        bind(items, getString(if (apkMode) R.string.apk_empty_dir else R.string.files_empty_dir))
    }

    private fun bind(items: List<FileItem>, emptyMsg: String) {
        adapter.setItems(items)
        list.setSelection(0)   // el cursor del control vuelve al primer ítem al cambiar de carpeta
        val empty = items.isEmpty()
        emptyView.text = emptyMsg
        emptyView.visibility = if (empty) View.VISIBLE else View.GONE
        list.visibility = if (empty) View.GONE else View.VISIBLE
        if (!empty) list.requestFocus()
    }

    private fun onItemClick(item: FileItem) {
        when (item.kind) {
            FileKind.DIR -> showDir(item.file)
            FileKind.VIDEO, FileKind.AUDIO, FileKind.IMAGE -> {
                val i = Intent(this, PlayerActivity::class.java)
                i.putExtra(PlayerActivity.EXTRA_PATH, item.file.absolutePath)
                i.putExtra(PlayerActivity.EXTRA_KIND, item.kind.name)
                startActivity(i)
            }
            FileKind.APK -> ApkInstaller.install(this, item.file)
            FileKind.OTHER ->
                Toast.makeText(this, getString(R.string.files_cant_open_here), Toast.LENGTH_SHORT).show()
        }
    }

    @Deprecated("Deprecated in Java")
    @Suppress("MissingSuperCall")
    override fun onBackPressed() {
        val dir = currentDir ?: run { finish(); return }
        val parent = dir.parentFile
        val internalPath = Environment.getExternalStorageDirectory()?.absolutePath
        if (parent == null || parent.absolutePath == "/storage" || dir.absolutePath == internalPath) {
            showRoots()
        } else {
            showDir(parent)
        }
    }

    companion object {
        private const val REQ_READ = 1
        const val EXTRA_MODE = "mode"
        const val MODE_APK = "apk"
    }
}
