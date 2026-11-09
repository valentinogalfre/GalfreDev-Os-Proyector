package ar.vale.projectorlauncher.ui

import android.view.Gravity
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import ar.vale.projectorlauncher.R

/**
 * Teclado en pantalla para el control remoto. Es propio porque el del sistema en estos
 * proyectores suele ser el de un celular: no se usa con flechas y tapa media pantalla.
 *
 * Como en todos los paneles, el fondo va en una capa y las teclas en otra.
 */
class Keyboard private constructor(
    private val activity: GdActivity,
    private val title: CharSequence,
    initial: String,
    private val secret: Boolean,
    private val onChange: (String) -> Unit,
    private val onDone: (String) -> Unit
) : GdActivity.Overlay {

    private val density = activity.resources.displayMetrics.density
    private val backdrop = View(activity).apply { setBackgroundColor(activity.getColor(R.color.surface)) }
    private val layer = LinearLayout(activity).apply {
        orientation = LinearLayout.VERTICAL
        gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    }
    private val field = TextView(activity, null, 0, R.style.Gd_Display_Headline).apply { maxLines = 1 }
    private val keysHost = LinearLayout(activity).apply { orientation = LinearLayout.VERTICAL }
    private val previous: View? = activity.currentFocus
    private val text = StringBuilder(initial)
    private var layout = Layout.LETTERS
    private var upper = false
    private var closed = false

    private enum class Layout { LETTERS, SYMBOLS }

    init {
        val height = (336 * density).toInt()
        activity.addLayer(backdrop)
        (backdrop.layoutParams as FrameLayout.LayoutParams).apply {
            this.height = height
            gravity = Gravity.BOTTOM
        }
        activity.addLayer(layer)
        (layer.layoutParams as FrameLayout.LayoutParams).apply {
            this.height = height
            gravity = Gravity.BOTTOM
        }
        val pad = (56 * density).toInt()
        val label = TextView(activity, null, 0, R.style.Gd_Label).apply { this.text = title }
        layer.setPadding(pad, (18 * density).toInt(), pad, (20 * density).toInt())
        layer.addView(label, fullWidth())
        layer.addView(field, fullWidth().apply { topMargin = (6 * density).toInt() })
        layer.addView(keysHost, fullWidth().apply { topMargin = (12 * density).toInt() })
        activity.pushOverlay(this)
        (activity.content as? ViewGroup)?.descendantFocusability = ViewGroup.FOCUS_BLOCK_DESCENDANTS
        buildKeys()
        render()
        if (Motion.full) {
            val from = height.toFloat()
            for (v in listOf(backdrop, layer)) {
                v.translationY = from
                v.animate().translationY(0f).setDuration(Motion.BASE).setInterpolator(Motion.out).start()
            }
        }
    }

    private fun fullWidth() =
        LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)

    private fun rows(): List<String> = when (layout) {
        Layout.LETTERS -> listOf("1234567890", "qwertyuiop", "asdfghjklñ", "zxcvbnm-_.")
        Layout.SYMBOLS -> listOf("1234567890", "@#$%&*()/:", "¿?¡!\"'=+;,", "áéíóúü~<>\\")
    }

    private fun buildKeys() {
        val focusIndex = keysHost.focusedChild?.let { keysHost.indexOfChild(it) }
        keysHost.removeAllViews()
        rows().forEach { chars ->
            val row = LinearLayout(activity).apply { orientation = LinearLayout.HORIZONTAL }
            chars.forEach { c ->
                row.addView(charKey(if (upper) c.uppercaseChar() else c), keyParams(1f))
            }
            keysHost.addView(row, fullWidth())
        }
        val row = LinearLayout(activity).apply { orientation = LinearLayout.HORIZONTAL }
        row.addView(wordKey(activity.getString(R.string.key_shift)) {
            upper = !upper
            buildKeys()
        }, keyParams(2f))
        row.addView(wordKey(activity.getString(if (layout == Layout.LETTERS) R.string.key_symbols else R.string.key_letters)) {
            layout = if (layout == Layout.LETTERS) Layout.SYMBOLS else Layout.LETTERS
            buildKeys()
        }, keyParams(2f))
        row.addView(iconKey(R.drawable.ic_space, R.string.key_space) { type(' ') }, keyParams(3f))
        row.addView(iconKey(R.drawable.ic_backspace, R.string.key_delete) { delete() }, keyParams(1.5f))
        row.addView(wordKey(activity.getString(R.string.key_done)) { finish() }, keyParams(1.5f))
        keysHost.addView(row, fullWidth())
        val target = (keysHost.getChildAt(focusIndex ?: 1) as? ViewGroup)?.getChildAt(0)
        target?.requestFocusFromTouch()
    }

    private fun keyParams(weight: Float) =
        LinearLayout.LayoutParams(0, (39 * density).toInt(), weight)

    private fun charKey(c: Char): View = wordKey(c.toString()) { type(c) }

    private fun wordKey(label: String, action: () -> Unit): View =
        TextView(activity, null, 0, R.style.Gd_Text_Medium).apply {
            text = label
            textSize = 19f
            gravity = Gravity.CENTER
            isFocusable = true
            isClickable = true
            // Una letra sola es poca cinta para leerla de lejos: acá va la tecla entera.
            setTag(R.id.tape_block, true)
            setOnClickListener { action() }
        }

    private fun iconKey(icon: Int, description: Int, action: () -> Unit): View =
        ImageView(activity).apply {
            setImageResource(icon)
            contentDescription = activity.getString(description)
            scaleType = ImageView.ScaleType.CENTER_INSIDE
            val pad = (8 * density).toInt()
            setPadding(pad, pad, pad, pad)
            isFocusable = true
            isClickable = true
            setOnClickListener { action() }
        }

    private fun type(c: Char) {
        text.append(c)
        if (upper && c.isLetter()) {
            upper = false
            buildKeys()
        }
        changed()
    }

    private fun delete() {
        if (text.isNotEmpty()) text.deleteCharAt(text.length - 1)
        changed()
    }

    private fun changed() {
        render()
        onChange(text.toString())
    }

    private fun render() {
        val shown = if (secret) "•".repeat(text.length.coerceAtMost(40)) else text.takeLast(52)
        field.text = if (shown.isEmpty()) " " else shown
    }

    /** Reemplaza lo escrito: lo usa el celular, que escribe y dicta mucho más rápido que las flechas. */
    fun replace(value: String) {
        text.setLength(0)
        text.append(value)
        changed()
    }

    fun submit() = finish()

    private fun finish() {
        val value = text.toString()
        dismiss()
        onDone(value)
    }

    /** Teclas físicas: un teclado USB o Bluetooth escribe directo. */
    fun onKey(event: KeyEvent): Boolean {
        if (event.action != KeyEvent.ACTION_DOWN) return false
        when (event.keyCode) {
            KeyEvent.KEYCODE_DEL -> delete()
            KeyEvent.KEYCODE_ENTER -> finish()
            else -> {
                val code = event.unicodeChar
                if (code == 0 || Character.isISOControl(code)) return false
                text.append(code.toChar())
                changed()
            }
        }
        return true
    }

    override fun dismiss() {
        if (closed) return
        closed = true
        activity.popOverlay(this)
        (activity.content as? ViewGroup)?.descendantFocusability = ViewGroup.FOCUS_AFTER_DESCENDANTS
        previous?.requestFocus()
        activity.rootFrame.removeView(layer)
        activity.rootFrame.removeView(backdrop)
    }

    companion object {
        fun show(
            activity: GdActivity,
            title: CharSequence,
            initial: String = "",
            secret: Boolean = false,
            onChange: (String) -> Unit = {},
            onDone: (String) -> Unit
        ): Keyboard = Keyboard(activity, title, initial, secret, onChange, onDone)
    }
}
