package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.drawable.Drawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.ListView
import android.widget.TextView
import ar.vale.projectorlauncher.R

/** Una fila de lista. Sin [action], la fila es un encabezado de sección. */
class Row(
    val title: CharSequence,
    val subtitle: CharSequence? = null,
    val value: CharSequence? = null,
    val icon: Int? = null,
    val image: Drawable? = null,
    val longAction: (() -> Unit)? = null,
    val action: (() -> Unit)? = null
) {
    val isHeader: Boolean get() = action == null

    companion object {
        fun header(title: CharSequence) = Row(title)
    }
}

/** Filas con ícono, título, subtítulo y dato. La cinta se apoya sobre el título. */
class RowAdapter(context: Context) : BaseAdapter() {

    private val inflater = LayoutInflater.from(context)
    private var items: List<Row> = emptyList()

    fun submit(rows: List<Row>) {
        items = rows
        notifyDataSetChanged()
    }

    override fun getCount() = items.size
    override fun getItem(position: Int) = items[position]
    override fun getItemId(position: Int) = position.toLong()
    override fun getViewTypeCount() = 2
    override fun getItemViewType(position: Int) = if (items[position].isHeader) 1 else 0
    override fun areAllItemsEnabled() = false
    override fun isEnabled(position: Int) = !items[position].isHeader

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val row = items[position]
        if (row.isHeader) {
            val view = convertView ?: inflater.inflate(R.layout.item_row_header, parent, false)
            (view as TextView).text = row.title
            return view
        }
        val view = convertView ?: inflater.inflate(R.layout.item_row, parent, false)
        view.findViewById<TextView>(R.id.tape_anchor).text = row.title
        view.findViewById<TextView>(R.id.row_subtitle).apply {
            text = row.subtitle
            visibility = if (row.subtitle == null) View.GONE else View.VISIBLE
        }
        view.findViewById<TextView>(R.id.row_value).apply {
            text = row.value
            visibility = if (row.value == null) View.GONE else View.VISIBLE
        }
        view.findViewById<ImageView>(R.id.row_icon).apply {
            when {
                row.image != null -> {
                    imageTintList = null
                    setImageDrawable(row.image)
                    visibility = View.VISIBLE
                }
                row.icon != null -> {
                    setImageResource(row.icon)
                    visibility = View.VISIBLE
                }
                else -> visibility = View.GONE
            }
        }
        return view
    }
}

/** Conecta una lista con sus filas: OK corre la acción y mantener OK, la secundaria. */
fun ListView.bindRows(adapter: RowAdapter) {
    this.adapter = adapter
    itemsCanFocus = false
    setOnItemClickListener { _, _, position, _ -> adapter.getItem(position).action?.invoke() }
    setOnItemLongClickListener { _, _, position, _ ->
        val long = adapter.getItem(position).longAction ?: return@setOnItemLongClickListener false
        long()
        true
    }
}
