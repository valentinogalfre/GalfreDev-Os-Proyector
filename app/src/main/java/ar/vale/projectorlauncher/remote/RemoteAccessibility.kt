package ar.vale.projectorlauncher.remote

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.Rect
import android.os.Build
import android.os.Bundle
import android.text.TextUtils
import android.view.Gravity
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.TextView
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.Screen
import java.lang.ref.WeakReference

/**
 * Control total: con este permiso el celular maneja también las otras apps.
 *
 * Es opcional y lo activa el usuario. Sin él, una app no puede mandar teclas a otra; es una
 * regla de Android, y el celular se limita a las pantallas del sistema y a la multimedia.
 */
class RemoteAccessibility : AccessibilityService() {

    private var spot: AccessibilityNodeInfo? = null
    private var cursor: View? = null
    private var status: TextView? = null

    override fun onServiceConnected() {
        service = WeakReference(this)
        // Con otra app delante el sistema puede matar el proceso, y entonces no levanta el servidor
        // por su cuenta. A este servicio sí lo vuelve a conectar: desde acá vuelve el celular.
        if (Prefs(this).remoteEnabled) runCatching { RemoteService.start(this) }
    }

    override fun onDestroy() {
        hideCursor()
        showStatus(null)
        service = null
        super.onDestroy()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) = Unit
    override fun onInterrupt() = Unit

    /** Devuelve false si lo que está delante lo tiene que confirmar una persona en el proyector. */
    fun press(code: Int): Boolean {
        if (code == KeyEvent.KEYCODE_BACK) {
            performGlobalAction(GLOBAL_ACTION_BACK)
            return true
        }
        val root = rootInActiveWindow ?: return true
        if (RemoteGuard.needsPerson(root.packageName)) return false
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) dpad(code) else byFocus(root, code)
        return true
    }

    private fun dpad(code: Int): Boolean = when (code) {
        KeyEvent.KEYCODE_DPAD_UP -> performGlobalAction(GLOBAL_ACTION_DPAD_UP)
        KeyEvent.KEYCODE_DPAD_DOWN -> performGlobalAction(GLOBAL_ACTION_DPAD_DOWN)
        KeyEvent.KEYCODE_DPAD_LEFT -> performGlobalAction(GLOBAL_ACTION_DPAD_LEFT)
        KeyEvent.KEYCODE_DPAD_RIGHT -> performGlobalAction(GLOBAL_ACTION_DPAD_RIGHT)
        KeyEvent.KEYCODE_DPAD_CENTER -> performGlobalAction(GLOBAL_ACTION_DPAD_CENTER)
        else -> false
    }

    /** Antes de Android 13 no hay acción global: se mueve el foco a mano por el árbol de vistas. */
    private fun byFocus(root: AccessibilityNodeInfo, code: Int) {
        val places = ArrayList<AccessibilityNodeInfo>().also { collect(root, it) }
        // Una vista que contiene a otras no es un lugar donde pararse. Compose tampoco siempre
        // informa dónde está el foco, así que se recuerda el último lugar al que se fue.
        val here = root.findFocus(AccessibilityNodeInfo.FOCUS_INPUT)?.takeIf { it in places }
            ?: spot?.takeIf { it in places }
        if (code == KeyEvent.KEYCODE_DPAD_CENTER) {
            here?.let(::click)
            return
        }
        val target = if (here == null) places.firstOrNull() else nextFrom(here, code, places)
        if (target?.performAction(AccessibilityNodeInfo.ACTION_FOCUS) == true) spot = target
    }

    private fun nextFrom(here: AccessibilityNodeInfo, code: Int, places: List<AccessibilityNodeInfo>): AccessibilityNodeInfo? {
        val (direction, way) = when (code) {
            KeyEvent.KEYCODE_DPAD_UP -> View.FOCUS_UP to FocusGeometry.Way.UP
            KeyEvent.KEYCODE_DPAD_DOWN -> View.FOCUS_DOWN to FocusGeometry.Way.DOWN
            KeyEvent.KEYCODE_DPAD_LEFT -> View.FOCUS_LEFT to FocusGeometry.Way.LEFT
            KeyEvent.KEYCODE_DPAD_RIGHT -> View.FOCUS_RIGHT to FocusGeometry.Way.RIGHT
            else -> return null
        }
        here.focusSearch(direction)?.takeIf { it in places && it != here }?.let { return it }
        val others = places.filter { it != here }
        val index = FocusGeometry.next(box(here), way, others.map(::box))
        return others.getOrNull(index)
    }

    private fun box(node: AccessibilityNodeInfo): FocusGeometry.Box {
        val rect = Rect().also(node::getBoundsInScreen)
        return FocusGeometry.Box(rect.left, rect.top, rect.right, rect.bottom)
    }

    /** Devuelve true si este nodo, o algo adentro, es un lugar donde pararse. */
    private fun collect(node: AccessibilityNodeInfo, out: MutableList<AccessibilityNodeInfo>): Boolean {
        var found = false
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            if (collect(child, out)) found = true
        }
        if (found) return true
        if (!node.isFocusable || !node.isVisibleToUser || !node.isEnabled) return false
        out.add(node)
        return true
    }

    private fun click(node: AccessibilityNodeInfo): Boolean {
        var current: AccessibilityNodeInfo? = node
        while (current != null) {
            if (current.isClickable) return current.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            current = current.parent
        }
        return false
    }

    /**
     * Un toque de 0 a 1. Sirve en las apps de celular, que no conocen el control.
     * [done] avisa cuando el toque ya ocurrió, para quien necesita mirar la pantalla después.
     */
    fun tap(x: Float, y: Float, done: () -> Unit = {}): Boolean {
        val size = Screen.realSize(this)
        val px = Touch.pixel(x, size.x)
        val py = Touch.pixel(y, size.y)
        return touch(Path().apply { moveTo(px, py) }, TAP_MS, done) { root ->
            val node = Touch.clickable(Place(root), px.toInt(), py.toInt()) as Place?
            node?.info?.run {
                // Hay que dejarle el foco a un campo de texto para poder escribirle después.
                if (isFocusable) performAction(AccessibilityNodeInfo.ACTION_FOCUS)
                performAction(AccessibilityNodeInfo.ACTION_CLICK)
            }
        }
    }

    fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float, done: () -> Unit = {}): Boolean {
        val size = Screen.realSize(this)
        val x1 = Touch.pixel(fromX, size.x)
        val y1 = Touch.pixel(fromY, size.y)
        val x2 = Touch.pixel(toX, size.x)
        val y2 = Touch.pixel(toY, size.y)
        val path = Path().apply {
            moveTo(x1, y1)
            lineTo(x2, y2)
        }
        return touch(path, SWIPE_MS, done) { root ->
            val axis = Touch.axis(x2 - x1, y2 - y1)
            val node = Touch.scrollable(Place(root), x1.toInt(), y1.toInt(), axis) as Place?
            val action = if (Touch.forward(x2 - x1, y2 - y1)) {
                AccessibilityNodeInfo.ACTION_SCROLL_FORWARD
            } else {
                AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD
            }
            node?.info?.performAction(action)
        }
    }

    /**
     * Primero el gesto, que es lo más parecido a un dedo. En un equipo sin pantalla táctil Android
     * lo cancela sin hacer nada, y ahí se le pide la acción a la vista.
     */
    private fun touch(path: Path, milliseconds: Long, done: () -> Unit, instead: (AccessibilityNodeInfo) -> Unit): Boolean {
        if (front() == null) return false
        val stroke = GestureDescription.StrokeDescription(path, 0, milliseconds)
        val sent = dispatchGesture(
            GestureDescription.Builder().addStroke(stroke).build(),
            object : GestureResultCallback() {
                override fun onCompleted(gesture: GestureDescription?) = done()

                override fun onCancelled(gesture: GestureDescription?) {
                    front()?.let(instead)
                    done()
                }
            },
            null
        )
        if (!sent) {
            front()?.let(instead)
            done()
        }
        return true
    }

    /** Lo que está delante, para que Claude lo lea. Null si no hay ventana. */
    fun window(): AccessibilityNodeInfo? = rootInActiveWindow

    /** Escribe en un campo en particular, dándole antes el foco. */
    fun setText(field: AccessibilityNodeInfo, text: String): Boolean {
        if (!field.isEditable || field.isPassword) return false
        field.performAction(AccessibilityNodeInfo.ACTION_FOCUS)
        val args = Bundle().apply {
            putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text)
        }
        return field.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
    }

    /** Sin saber qué hay delante no se toca: podría ser el instalador. */
    private fun front(): AccessibilityNodeInfo? =
        rootInActiveWindow?.takeUnless { RemoteGuard.needsPerson(it.packageName) }

    /** El puntero sobre cualquier app. Esta ventana no pide otro permiso y deja pasar los toques. */
    fun showCursor(x: Float, y: Float) {
        val screen = Screen.realSize(this)
        val side = (resources.displayMetrics.density * CURSOR_DP).toInt()
        val view = cursor ?: View(this).also { it.setBackgroundColor(getColor(R.color.cinta)) }
        val params = (view.layoutParams as? WindowManager.LayoutParams) ?: WindowManager.LayoutParams(
            side,
            side,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.START }
        params.x = Touch.pixel(x, screen.x).toInt() - side / 2
        params.y = Touch.pixel(y, screen.y).toInt() - side / 2
        val windows = getSystemService(WindowManager::class.java)
        if (cursor == null) {
            windows.addView(view, params)
            cursor = view
        } else {
            windows.updateViewLayout(view, params)
        }
    }

    fun hideCursor() {
        cursor?.let { view -> runCatching { getSystemService(WindowManager::class.java).removeView(view) } }
        cursor = null
    }

    /**
     * Un renglón abajo a la izquierda, sobre cualquier app: lo que Claude está haciendo o lo que
     * respondió. Va en carbón y hueso, sin cinta: la cinta de esa pantalla es el puntero. Con null
     * se saca. Se llama desde el hilo principal.
     */
    fun showStatus(text: CharSequence?) {
        val windows = getSystemService(WindowManager::class.java)
        if (text == null) {
            status?.let { view -> runCatching { windows.removeView(view) } }
            status = null
            return
        }
        val existing = status
        if (existing != null) {
            existing.text = text
            return
        }
        val context = Screen.wrap(this)
        val density = context.resources.displayMetrics.density
        val pad = (STATUS_PAD_DP * density).toInt()
        val view = TextView(context).apply {
            setTextAppearance(R.style.Gd_Text_Medium)
            setTextColor(context.getColor(R.color.hueso))
            setBackgroundColor(context.getColor(R.color.carbon))
            textSize = STATUS_SP
            maxLines = STATUS_LINES
            ellipsize = TextUtils.TruncateAt.END
            setPadding(pad + pad / 2, pad, pad + pad / 2, pad)
            this.text = text
        }
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.START
            x = (STATUS_MARGIN_DP * density).toInt()
            y = (STATUS_MARGIN_DP * density).toInt()
            width = WindowManager.LayoutParams.WRAP_CONTENT
        }
        view.maxWidth = (Screen.realSize(this).x * STATUS_WIDTH).toInt()
        runCatching { windows.addView(view, params) }.onSuccess { status = view }
    }

    fun setText(text: String): Boolean {
        val focused = rootInActiveWindow?.findFocus(AccessibilityNodeInfo.FOCUS_INPUT) ?: return false
        if (!focused.isEditable) return false
        val args = Bundle().apply {
            putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text)
        }
        return focused.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
    }

    /** Una vista de lo que esté delante, tal como la ve accesibilidad. */
    private class Place(val info: AccessibilityNodeInfo) : Touch.Node {
        private val box = Rect().also(info::getBoundsInScreen)

        override val visible get() = info.isVisibleToUser
        override val clickable get() = info.isClickable || info.isEditable
        override val scrollable get() = info.isScrollable
        override val children: List<Touch.Node> by lazy {
            (0 until info.childCount).mapNotNull { info.getChild(it) }.map(::Place)
        }
        override val axis: Touch.Axis?
            get() {
                val actions = info.actionList.map { it.id }
                val grid = info.collectionInfo
                return Touch.axisOf(
                    grid?.rowCount ?: 0,
                    grid?.columnCount ?: 0,
                    info.className,
                    sideways = SIDEWAYS.any { it.id in actions },
                    upDown = UP_DOWN.any { it.id in actions }
                )
            }

        override fun contains(x: Int, y: Int) = box.contains(x, y)

        private companion object {
            val SIDEWAYS = listOf(
                AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_LEFT,
                AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_RIGHT
            )
            val UP_DOWN = listOf(
                AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_UP,
                AccessibilityNodeInfo.AccessibilityAction.ACTION_SCROLL_DOWN
            )
        }
    }

    companion object {
        private const val TAP_MS = 60L
        private const val SWIPE_MS = 260L
        private const val CURSOR_DP = 18
        private const val STATUS_SP = 17f
        private const val STATUS_LINES = 4
        private const val STATUS_PAD_DP = 10
        private const val STATUS_MARGIN_DP = 28
        private const val STATUS_WIDTH = 0.62f

        @Volatile private var service: WeakReference<RemoteAccessibility>? = null

        val instance: RemoteAccessibility? get() = service?.get()
    }
}
