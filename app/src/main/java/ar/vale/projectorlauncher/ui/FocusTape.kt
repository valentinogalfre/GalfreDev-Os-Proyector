package ar.vale.projectorlauncher.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.PorterDuff
import android.graphics.RectF
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.view.animation.AnimationUtils
import android.widget.AbsListView
import android.widget.TextView
import ar.vale.projectorlauncher.R
import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.min

/**
 * La cinta: el único acento de la pantalla, y es el foco del control remoto.
 *
 * La marca pide un solo elemento cinta por pieza, y en una interfaz de control remoto
 * hay exactamente un elemento enfocado: la regla de marca y la necesidad de uso son la
 * misma cosa. Por eso hay una sola cinta por pantalla, que viaja de un elemento al otro.
 *
 * - Va arriba del contenido, y debajo de ella vuelve a dibujar el contenido en carbón
 *   recortado a su forma ("encima de la cinta solo va carbón"): el texto cambia de color
 *   exactamente sobre el borde que avanza, sin que cada vista tenga que saber nada.
 * - Cuando abrís algo, la cinta crece hasta cubrir la pantalla, muestra el título y se
 *   encoge sobre el primer foco de la pantalla nueva: es el mismo objeto entre pantallas.
 *
 * Para que el recorte funcione, lo que queda bajo la cinta no puede tener fondo opaco.
 * Una vista puede pedir que la cinta se apoye en un hijo con el id `tape_anchor`.
 */
class FocusTape(context: Context) : View(context) {

    private enum class Mode { CHASE, COVER, COVERED, UNCOVER }

    private val cur = RectF()
    private val dst = RectF()
    private val from = RectF()
    private val tmp = RectF()
    private val full = RectF()
    private val xy = IntArray(2)
    private val own = IntArray(2)

    private var mode = Mode.CHASE
    private var tweenStart = 0L
    private var tweenMs = 0L
    private var lastFrame = 0L
    private var onCovered: (() -> Unit)? = null
    private var pendingUncover = false
    private var arrivedCovered = false

    private val fill = Paint().apply { color = context.getColor(R.color.cinta) }
    private val ink = context.getColor(R.color.carbon)
    private val titlePaint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        color = ink
        typeface = context.resources.getFont(R.font.archivo_extrabold)
        letterSpacing = -0.038f
    }
    private var titleLayout: StaticLayout? = null
    private var titleText: CharSequence? = null
    private var pinned: (() -> RectF?)? = null
    private var pinKnockout = true

    private val dp = context.resources.displayMetrics.density

    private val preDraw = ViewTreeObserver.OnPreDrawListener {
        track()
        if (pendingUncover && width > 0) {
            pendingUncover = false
            beginUncover()
        }
        true
    }

    private val focusChange = ViewTreeObserver.OnGlobalFocusChangeListener { _, _ -> track() }

    init {
        isFocusable = false
        isClickable = false
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        viewTreeObserver.addOnPreDrawListener(preDraw)
        viewTreeObserver.addOnGlobalFocusChangeListener(focusChange)
    }

    override fun onDetachedFromWindow() {
        viewTreeObserver.removeOnPreDrawListener(preDraw)
        viewTreeObserver.removeOnGlobalFocusChangeListener(focusChange)
        super.onDetachedFromWindow()
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        full.set(0f, 0f, w.toFloat(), h.toFloat())
        titlePaint.textSize = h * 0.2f
        buildTitle()
        if (mode == Mode.COVERED) cur.set(full)
    }

    /** true mientras la cinta tapa la pantalla: se ignoran las teclas. */
    val isBusy: Boolean get() = mode == Mode.COVER || mode == Mode.COVERED

    val isCovered: Boolean get() = mode == Mode.COVERED

    // --- Transición entre pantallas ---

    /** La pantalla arranca tapada (venimos de otra que se fue con la cinta encima). */
    fun startCovered(title: CharSequence?) {
        titleText = title
        buildTitle()
        mode = Mode.COVERED
        cur.set(full)
        arrivedCovered = true
        pendingUncover = true
        invalidate()
    }

    /** El arranque le pasa la cinta: desde acá la mueve el foco. */
    fun land(rect: RectF) {
        cur.set(rect)
        dst.set(rect)
        mode = Mode.CHASE
        visibility = VISIBLE
        track()
        invalidate()
    }

    /** Crece desde el foco actual (o desde [origin]) hasta cubrir todo y después corre [then]. */
    fun cover(title: CharSequence?, origin: RectF? = null, then: () -> Unit) {
        if (!Motion.full) {
            then()
            return
        }
        if (mode == Mode.COVER) return
        titleText = title
        buildTitle()
        origin?.let { cur.set(it) }
        from.set(cur)
        if (from.isEmpty) from.set(0f, 0f, 0f, height.toFloat())
        mode = Mode.COVER
        onCovered = then
        tweenStart = AnimationUtils.currentAnimationTimeMillis()
        tweenMs = COVER_MS
        invalidate()
    }

    /** Se encoge sobre el foco de esta pantalla. Si no hay foco, se va por la izquierda. */
    fun uncover() {
        if (mode != Mode.COVERED) return
        // Al volver a una pantalla que ya estaba abierta no hay título que repetir.
        if (!arrivedCovered) {
            titleText = null
            titleLayout = null
        }
        pendingUncover = true
        invalidate()
    }

    private fun beginUncover() {
        arrivedCovered = false
        from.set(full)
        mode = Mode.UNCOVER
        val target = resolveTarget()
        if (target != null) measure(target, dst) else dst.set(0f, 0f, 0f, height.toFloat())
        tweenStart = AnimationUtils.currentAnimationTimeMillis()
        tweenMs = UNCOVER_MS
        invalidate()
    }

    // --- Lugares que no son el foco ---

    /**
     * Lleva la cinta a otro lugar: una palabra de una respuesta, el puntero del celular. Sigue
     * siendo el mismo objeto, y vuelve al foco con [unpin] o si [target] devuelve null.
     * Con [knockout] en false no redibuja lo de abajo, para pasar por encima de una imagen.
     */
    fun pin(knockout: Boolean = true, target: () -> RectF?) {
        pinned = target
        pinKnockout = knockout
        track()
        invalidate()
    }

    fun unpin() {
        if (pinned == null) return
        pinned = null
        pinKnockout = true
        track()
        invalidate()
    }

    val isPinned: Boolean get() = pinned != null

    /** La cinta está de verdad sobre lo fijado: si salió de la vista, volvió al foco. */
    val isOnPin: Boolean get() = pinned?.invoke() != null

    /** Convierte un rectángulo de [view] a las coordenadas de la cinta. */
    fun toLocal(view: View, rect: RectF): RectF {
        getLocationInWindow(own)
        view.getLocationInWindow(xy)
        rect.offset((xy[0] - own[0]).toFloat(), (xy[1] - own[1]).toFloat())
        return rect
    }

    // --- Seguimiento del foco ---

    private fun track() {
        if (mode != Mode.CHASE) return
        val spot = pinned?.invoke()
        if (spot != null) {
            tmp.set(spot)
        } else {
            val target = resolveTarget()
            if (target == null) {
                if (!dst.isEmpty) {
                    dst.set(cur.left, cur.top, cur.left, cur.bottom)
                    invalidate()
                }
                return
            }
            measure(target, tmp)
        }
        if (tmp == dst) return
        dst.set(tmp)
        if (cur.isEmpty) {
            // Primera aparición: se abre desde el borde izquierdo del elemento.
            cur.set(dst.left, dst.top, dst.left, dst.bottom)
        }
        if (!Motion.full) cur.set(dst)
        invalidate()
    }

    private fun resolveTarget(): View? {
        var focused = rootView?.findFocus() ?: return null
        if (focused is AbsListView) focused = focused.selectedView ?: return null
        return focused.findViewById(R.id.tape_anchor) ?: focused
    }

    /** Rectángulo de la cinta para [v], en coordenadas de esta vista. */
    private fun measure(v: View, out: RectF) {
        getLocationInWindow(own)
        v.getLocationInWindow(xy)
        val x = (xy[0] - own[0]).toFloat()
        val y = (xy[1] - own[1]).toFloat()
        val hug = v.getTag(R.id.tape_block) == null
        val layout = (v as? TextView)?.takeIf { hug && it.lineCount == 1 }?.layout
        if (layout != null && v is TextView) {
            // Como `.mark` de la marca: abraza la palabra, no la caja de la vista.
            val em = v.textSize
            val textLeft = x + v.totalPaddingLeft + layout.getLineLeft(0)
            // Nunca sale de la vista: un texto cortado, o uno centrado con scroll horizontal, cuyo
            // layout mide un millón de píxeles, darían un borde lejísimos de lo que se ve.
            val edge = em * 0.12f
            out.left = (textLeft - em * 0.08f).coerceIn(x - edge, x + v.width)
            out.right = min(textLeft + layout.getLineWidth(0) + edge, x + v.width + edge)
            out.top = y + v.totalPaddingTop + layout.getLineTop(0) - em * 0.04f
            out.bottom = y + v.totalPaddingTop + layout.getLineBottom(0) + em * 0.06f
        } else {
            out.set(x, y, x + v.width * v.scaleX, y + v.height * v.scaleY)
        }
    }

    // --- Dibujo ---

    override fun onDraw(canvas: Canvas) {
        val now = AnimationUtils.currentAnimationTimeMillis()
        val moving = step(now)
        if (!cur.isEmpty) {
            canvas.drawRect(cur, fill)
            if (mode != Mode.CHASE) drawTitle(canvas) else if (pinKnockout) knockout(canvas)
        }
        if (moving) postInvalidateOnAnimation()
    }

    /** Avanza un cuadro. Devuelve true si hay que seguir animando. */
    private fun step(now: Long): Boolean {
        val dt = min((now - lastFrame).coerceAtLeast(0L), 48L) / 1000f
        lastFrame = now
        when (mode) {
            Mode.CHASE -> {
                // Persecución exponencial: no depende de los cuadros por segundo y aguanta que
                // el destino cambie a mitad de camino (mantener apretada una flecha).
                val toRight = dst.centerX() >= cur.centerX()
                val toDown = dst.centerY() >= cur.centerY()
                cur.left = chase(cur.left, dst.left, dt, if (toRight) TRAIL else LEAD)
                cur.right = chase(cur.right, dst.right, dt, if (toRight) LEAD else TRAIL)
                cur.top = chase(cur.top, dst.top, dt, if (toDown) TRAIL else LEAD)
                cur.bottom = chase(cur.bottom, dst.bottom, dt, if (toDown) LEAD else TRAIL)
                val done = abs(cur.left - dst.left) < SNAP && abs(cur.right - dst.right) < SNAP &&
                    abs(cur.top - dst.top) < SNAP && abs(cur.bottom - dst.bottom) < SNAP
                if (done) cur.set(dst)
                return !done
            }
            Mode.COVER -> {
                val t = ((now - tweenStart).toFloat() / tweenMs).coerceIn(0f, 1f)
                val e = Motion.inOut.getInterpolation(t)
                lerpRect(from, full, e)
                if (t >= 1f) {
                    mode = Mode.COVERED
                    val then = onCovered
                    onCovered = null
                    post { then?.invoke() }
                    return false
                }
                return true
            }
            Mode.UNCOVER -> {
                val t = ((now - tweenStart).toFloat() / tweenMs).coerceIn(0f, 1f)
                val e = Motion.inOut.getInterpolation(t)
                lerpRect(from, dst, e)
                if (t >= 1f) {
                    mode = Mode.CHASE
                    titleText = null
                    titleLayout = null
                    // Lo que pidieron durante la transición se ignoró: ahora hay que atenderlo.
                    post { track() }
                    return false
                }
                return true
            }
            Mode.COVERED -> {
                cur.set(full)
                return false
            }
        }
    }

    private fun chase(x: Float, target: Float, dt: Float, k: Float): Float =
        x + (target - x) * (1f - exp(-k * dt))

    private fun lerpRect(a: RectF, b: RectF, t: Float) {
        cur.set(
            Motion.lerp(a.left, b.left, t),
            Motion.lerp(a.top, b.top, t),
            Motion.lerp(a.right, b.right, t),
            Motion.lerp(a.bottom, b.bottom, t)
        )
    }

    /**
     * Vuelve a pintar lo que tiene debajo en carbón, recortado a la cinta. Dibuja solo la capa que
     * tiene el foco: por eso un panel lleva su fondo en una capa aparte de sus filas.
     */
    private fun knockout(canvas: Canvas) {
        val root = parent as? ViewGroup ?: return
        val scope = topLevelOf(root) ?: return
        val save = canvas.saveLayer(cur, null)
        canvas.translate(scope.left.toFloat(), scope.top.toFloat())
        scope.draw(canvas)
        canvas.translate(-scope.left.toFloat(), -scope.top.toFloat())
        canvas.drawColor(ink, PorterDuff.Mode.SRC_IN)
        canvas.restoreToCount(save)
    }

    private fun topLevelOf(root: ViewGroup): View? {
        var v: View = rootView?.findFocus() ?: return null
        while (v.parent !== root) v = v.parent as? View ?: return null
        return v
    }

    private fun buildTitle() {
        val text = titleText
        if (text == null || width == 0) {
            titleLayout = null
            return
        }
        val w = (width - MARGIN_DP * 2 * dp).toInt().coerceAtLeast(1)
        titleLayout = StaticLayout.Builder.obtain(text, 0, text.length, titlePaint, w)
            .setAlignment(Layout.Alignment.ALIGN_NORMAL)
            .setIncludePad(false)
            .setLineSpacing(0f, 0.97f)
            .build()
    }

    private fun drawTitle(canvas: Canvas) {
        val layout = titleLayout ?: return
        val save = canvas.save()
        canvas.clipRect(cur)
        canvas.translate(MARGIN_DP * dp, height - layout.height - MARGIN_V_DP * dp)
        layout.draw(canvas)
        canvas.restoreToCount(save)
    }

    private companion object {
        const val COVER_MS = 280L
        const val UNCOVER_MS = 340L
        const val LEAD = 34f     // el borde que encabeza el movimiento
        const val TRAIL = 19f    // el que lo sigue: la diferencia estira la cinta al viajar
        const val SNAP = 0.6f
        const val MARGIN_DP = 56f
        const val MARGIN_V_DP = 40f
    }
}
