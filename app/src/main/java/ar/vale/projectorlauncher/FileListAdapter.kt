package ar.vale.projectorlauncher

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import java.util.Locale

/** Filas del explorador de archivos (ícono + nombre + tamaño/carpeta). */
class FileListAdapter(private val ctx: Context) : BaseAdapter() {

    private var items: List<FileItem> = emptyList()

    fun setItems(list: List<FileItem>) {
        items = list
        notifyDataSetChanged()
    }

    override fun getCount() = items.size
    override fun getItem(position: Int) = items[position]
    override fun getItemId(position: Int) = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val v = convertView ?: LayoutInflater.from(ctx).inflate(R.layout.item_file, parent, false)
        val item = items[position]
        v.findViewById<ImageView>(R.id.file_icon).setImageResource(iconFor(item.kind))
        v.findViewById<TextView>(R.id.file_name).text = item.name
        v.findViewById<TextView>(R.id.file_meta).text = metaFor(item)
        return v
    }

    private fun iconFor(kind: FileKind): Int = when (kind) {
        FileKind.DIR -> R.drawable.ic_folder
        FileKind.VIDEO -> R.drawable.ic_video
        FileKind.AUDIO -> R.drawable.ic_audio
        FileKind.IMAGE -> R.drawable.ic_image
        FileKind.APK, FileKind.OTHER -> R.drawable.ic_file
    }

    private fun metaFor(item: FileItem): String =
        if (item.kind == FileKind.DIR) ctx.getString(R.string.files_folder) else humanSize(item.file.length())

    private fun humanSize(bytes: Long): String {
        if (bytes < 1024) return "$bytes B"
        val kb = bytes / 1024.0
        if (kb < 1024) return String.format(Locale.ROOT, "%.0f KB", kb)
        val mb = kb / 1024.0
        if (mb < 1024) return String.format(Locale.ROOT, "%.1f MB", mb)
        return String.format(Locale.ROOT, "%.2f GB", mb / 1024.0)
    }
}
