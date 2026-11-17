package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.drawable.Drawable
import android.view.LayoutInflater
import android.view.KeyEvent
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

        /** Posición de la primera fila que se puede elegir. */
        fun firstSelectable(rows: List<Row>): Int = rows.indexOfFirst { !it.isHeader }.coerceAtLeast(0)
    }
}

/** Filas con ícono, título, subtítulo y dato. La cinta se apoya sobre el título. */
class RowAdapter(context: Context) : BaseAdapter() {

    private val inflater = LayoutInflater.from(context)
    private var items: List<Row> = emptyList()

    val rows: List<Row> get() = items

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

/** Cómo se acomoda una lista al moverse con las flechas para no dejar una fila cortada arriba. */
object RowSnap {
    /**
     * Cuántos píxeles correr el contenido hacia arriba (negativo: hacia abajo) para que la fila de
     * arriba [firstTop, firstBottom] no quede cortada contra el borde [viewTop]. Se muestra entera
     * si la fila elegida (que termina en [selBottom]) sigue cabiendo antes de [viewBottom]; si no, se esconde.
     */
    fun correction(firstTop: Int, firstBottom: Int, selBottom: Int, viewTop: Int, viewBottom: Int): Int {
        if (firstTop >= viewTop || firstBottom <= viewTop) return 0
        val reveal = viewTop - firstTop
        return if (selBottom + reveal <= viewBottom) -reveal else firstBottom - viewTop
    }
}

/** Conecta una lista con sus filas: OK corre la acción, y mantener OK o Menú, la secundaria. */
fun ListView.bindRows(adapter: RowAdapter) {
    this.adapter = adapter
    itemsCanFocus = false
    setOnItemClickListener { _, _, position, _ -> adapter.getItem(position).action?.invoke() }
    setOnItemLongClickListener { _, _, position, _ ->
        val long = adapter.getItem(position).longAction ?: return@setOnItemLongClickListener false
        long()
        true
    }
    // Con las flechas la lista corre lo justo para que se vea la fila elegida, y deja la de arriba
    // cortada a la mitad contra el título fijo: después de cada paso se acomoda a filas enteras.
    setOnKeyListener { _, keyCode, event ->
        if (keyCode == KeyEvent.KEYCODE_MENU) {
            val long = (selectedItem as? Row)?.longAction ?: return@setOnKeyListener false
            if (event.action == KeyEvent.ACTION_UP) long()
            return@setOnKeyListener true
        }
        if (event.action != KeyEvent.ACTION_DOWN || (keyCode != KeyEvent.KEYCODE_DPAD_UP && keyCode != KeyEvent.KEYCODE_DPAD_DOWN)) {
            return@setOnKeyListener false
        }
        val handled = onKeyDown(keyCode, event)
        if (handled) snapRows()
        handled
    }
}

private fun ListView.snapRows() {
    val first = getChildAt(0) ?: return
    val selected = selectedView ?: return
    if (first === selected) return
    val move = RowSnap.correction(first.top, first.bottom, selected.bottom, paddingTop, height - paddingBottom)
    if (move != 0) scrollListBy(move)
}

/**
 * Vuelve al principio de la lista. Un encabezado no se puede elegir: `setSelection(0)` deja arriba
 * la primera fila que sí, y el rótulo de la sección queda fuera de vista, sin forma de llegar a él.
 */
fun ListView.selectFirst() {
    val adapter = adapter as RowAdapter
    val first = Row.firstSelectable(adapter.rows)
    setSelection(first)
    if (first == 0) return
    // Recién con la lista medida se sabe cuánto ocupan los encabezados de arriba.
    post {
        var above = 0
        for (i in 0 until first) {
            val header = adapter.getView(i, null, this)
            header.measure(
                View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
            )
            above += header.measuredHeight
        }
        setSelectionFromTop(first, above)
    }
}
