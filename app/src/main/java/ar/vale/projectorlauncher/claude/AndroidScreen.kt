package ar.vale.projectorlauncher.claude

import android.content.Context
import android.graphics.Rect
import android.os.Handler
import android.os.Looper
import android.view.accessibility.AccessibilityNodeInfo
import ar.vale.projectorlauncher.remote.AndroidRemote
import ar.vale.projectorlauncher.remote.RemoteAccessibility
import ar.vale.projectorlauncher.remote.RemoteDevice
import ar.vale.projectorlauncher.ui.Screen
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * La pantalla de verdad, a través del mismo permiso de Control total que usa el celular.
 * Corre en el hilo de la conversación: leer el árbol de otra app tarda, y no puede ser en el principal.
 */
class AndroidScreen(private val context: Context) : ScreenDriver {

    private val main = Handler(Looper.getMainLooper())
    private val remote = AndroidRemote(context)

    override val available: Boolean get() = RemoteAccessibility.instance != null

    override fun snapshot(): ScreenDriver.Snapshot? {
        val service = RemoteAccessibility.instance ?: return null
        val root = runCatching { service.window() }.getOrNull() ?: return null
        val pkg = root.packageName?.toString().orEmpty()
        val size = Screen.realSize(context)
        return ScreenDriver.Snapshot(appName(pkg), pkg, Place(root), size.x, size.y)
    }

    private fun appName(pkg: String): String = runCatching {
        val pm = context.packageManager
        pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString()
    }.getOrDefault(pkg)

    /** El puntero va primero al lugar y se queda un instante: en la pared se ve dónde toca Claude. */
    override fun tap(node: ScreenText.Node): Boolean {
        val service = RemoteAccessibility.instance ?: return false
        val size = Screen.realSize(context)
        if (size.x <= 1 || size.y <= 1) return false
        val x = ((node.left + node.right) / 2f / (size.x - 1)).coerceIn(0f, 1f)
        val y = ((node.top + node.bottom) / 2f / (size.y - 1)).coerceIn(0f, 1f)
        remote.pointer(x, y, visible = true)
        pause(POINT_MS)
        val done = CountDownLatch(1)
        val sent = service.tap(x, y) { done.countDown() }
        if (sent) done.await(GESTURE_WAIT_MS, TimeUnit.MILLISECONDS)
        return sent
    }

    override fun type(node: ScreenText.Node?, text: String): Boolean {
        val service = RemoteAccessibility.instance ?: return false
        val field = (node as? Place)?.info
        return runCatching { if (field != null) service.setText(field, text) else service.setText(text) }.getOrDefault(false)
    }

    override fun key(name: String): Boolean {
        val key = KEYS[name] ?: return false
        return remote.key(key) == RemoteDevice.Result.OK
    }

    /** El dedo va al revés que el contenido: para ver lo de abajo, se arrastra hacia arriba. */
    override fun swipe(direction: String): Boolean {
        val service = RemoteAccessibility.instance ?: return false
        val (fromX, fromY, toX, toY) = when (direction) {
            "abajo" -> listOf(0.5f, 0.72f, 0.5f, 0.28f)
            "arriba" -> listOf(0.5f, 0.28f, 0.5f, 0.72f)
            "derecha" -> listOf(0.75f, 0.5f, 0.25f, 0.5f)
            "izquierda" -> listOf(0.25f, 0.5f, 0.75f, 0.5f)
            else -> return false
        }
        val done = CountDownLatch(1)
        val sent = service.swipe(fromX, fromY, toX, toY) { done.countDown() }
        if (sent) done.await(GESTURE_WAIT_MS, TimeUnit.MILLISECONDS)
        return sent
    }

    override fun pause(milliseconds: Long) {
        runCatching { Thread.sleep(milliseconds) }
    }

    /** Una vista, tal como la informa accesibilidad. Los bordes se leen una sola vez. */
    private class Place(val info: AccessibilityNodeInfo) : ScreenText.Node {
        private val box = Rect().also(info::getBoundsInScreen)

        override val text get() = info.text?.toString()
        override val description get() = info.contentDescription?.toString()
        override val idName get() = info.viewIdResourceName?.substringAfterLast('/')
        override val className get() = info.className?.toString()
        override val visible get() = info.isVisibleToUser
        override val clickable get() = info.isClickable
        override val editable get() = info.isEditable
        override val scrollable get() = info.isScrollable
        override val checkable get() = info.isCheckable
        override val checked get() = info.isChecked
        override val focused get() = info.isFocused
        override val selected get() = info.isSelected
        override val password get() = info.isPassword
        override val left get() = box.left
        override val top get() = box.top
        override val right get() = box.right
        override val bottom get() = box.bottom
        override val children: List<ScreenText.Node> by lazy {
            (0 until info.childCount).mapNotNull { runCatching { info.getChild(it) }.getOrNull() }.map(::Place)
        }
    }

    private companion object {
        const val POINT_MS = 350L
        const val GESTURE_WAIT_MS = 1500L

        val KEYS = mapOf(
            "arriba" to "up",
            "abajo" to "down",
            "izquierda" to "left",
            "derecha" to "right",
            "ok" to "ok",
            "atras" to "back",
            "inicio" to "home",
            "play_pausa" to "playpause"
        )
    }
}
