package ar.vale.projectorlauncher.ui

import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import ar.vale.projectorlauncher.R

/**
 * Panel lateral con opciones: reemplaza a los AlertDialog del sistema.
 *
 * El fondo va en una capa y las filas en otra, sin fondo: así la cinta puede dibujar el texto
 * de las filas en carbón sin arrastrar la superficie del panel.
 */
class Sheet private constructor(
    private val activity: GdActivity,
    title: CharSequence,
    body: CharSequence?,
    options: List<Option>
) : GdActivity.Overlay {

    class Option(val label: CharSequence, val icon: Int? = null, val action: () -> Unit)

    private val inflater = LayoutInflater.from(activity)
    private val density = activity.resources.displayMetrics.density
    private val width = (336 * density).toInt()
    private val backdrop = inflater.inflate(R.layout.view_sheet_backdrop, activity.rootFrame, false)
    private val layer = FrameLayout(activity)
    private val previous: View? = activity.currentFocus
    private var closed = false

    /** Corre al cerrarse por cualquier motivo, también con «atrás». */
    var onClosed: (() -> Unit)? = null

    init {
        val scroll = ScrollView(activity).apply {
            isVerticalScrollBarEnabled = false
            isFillViewport = true
        }
        val column = inflater.inflate(R.layout.view_sheet, scroll, false) as LinearLayout
        column.findViewById<TextView>(R.id.sheet_title).text = title
        column.findViewById<TextView>(R.id.sheet_body).apply {
            text = body
            visibility = if (body == null) View.GONE else View.VISIBLE
        }
        val rows = column.findViewById<LinearLayout>(R.id.sheet_rows)
        options.forEach { option ->
            val row = inflater.inflate(R.layout.item_sheet_row, rows, false)
            row.findViewById<TextView>(R.id.tape_anchor).text = option.label
            row.findViewById<ImageView>(R.id.row_icon).apply {
                if (option.icon != null) setImageResource(option.icon) else visibility = View.GONE
            }
            row.setOnClickListener {
                dismiss()
                option.action()
            }
            rows.addView(row)
        }
        scroll.addView(column)
        layer.addView(
            scroll,
            FrameLayout.LayoutParams(width, ViewGroup.LayoutParams.MATCH_PARENT, Gravity.END)
        )
        activity.addLayer(backdrop)
        activity.addLayer(layer)
        activity.pushOverlay(this)
        (activity.content as? ViewGroup)?.descendantFocusability = ViewGroup.FOCUS_BLOCK_DESCENDANTS
        rows.getChildAt(0)?.requestFocus()
        val panel = backdrop.findViewById<View>(R.id.sheet_panel)
        if (Motion.full) {
            backdrop.alpha = 0f
            // Un contenedor a medio transparentar se dibuja aparte en cada cuadro, salvo que tenga su capa.
            backdrop.animate().alpha(1f).setDuration(Motion.BASE).setInterpolator(Motion.out).withLayer().start()
            panel.translationX = width.toFloat()
            layer.translationX = width.toFloat()
            panel.animate().translationX(0f).setDuration(Motion.BASE).setInterpolator(Motion.out).start()
            layer.animate().translationX(0f).setDuration(Motion.BASE).setInterpolator(Motion.out).start()
        }
    }

    override fun dismiss() {
        if (closed) return
        closed = true
        onClosed?.invoke()
        activity.popOverlay(this)
        (activity.content as? ViewGroup)?.descendantFocusability = ViewGroup.FOCUS_AFTER_DESCENDANTS
        previous?.requestFocus()
        activity.rootFrame.removeView(layer)
        if (Motion.full) {
            backdrop.animate().alpha(0f).setDuration(Motion.FAST).withLayer()
                .withEndAction { activity.rootFrame.removeView(backdrop) }
                .start()
        } else {
            activity.rootFrame.removeView(backdrop)
        }
    }

    companion object {
        fun show(activity: GdActivity, title: CharSequence, options: List<Option>, body: CharSequence? = null): Sheet =
            Sheet(activity, title, body, options)

        /** Pide confirmación para algo que no se deshace solo. */
        fun confirm(
            activity: GdActivity,
            title: CharSequence,
            body: CharSequence?,
            yes: CharSequence,
            no: CharSequence = activity.getString(R.string.cancel),
            action: () -> Unit
        ): Sheet = Sheet(activity, title, body, listOf(Option(no) {}, Option(yes, action = action)))
    }
}
