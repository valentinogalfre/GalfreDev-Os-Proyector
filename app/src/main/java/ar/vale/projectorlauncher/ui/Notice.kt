package ar.vale.projectorlauncher.ui

import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import ar.vale.projectorlauncher.R

/**
 * Aviso breve abajo a la izquierda: reemplaza al Toast del sistema, que no respeta ni la
 * tipografía ni el lienzo. El color de estado siempre va con su ícono, como pide el manual.
 */
object Notice {

    enum class Kind(val icon: Int, val color: Int) {
        INFO(R.drawable.ic_info, R.color.info),
        OK(R.drawable.ic_check, R.color.exito),
        WARN(R.drawable.ic_info, R.color.aviso),
        ERROR(R.drawable.ic_info, R.color.error)
    }

    private const val SHOW_MS = 3600L

    fun show(activity: GdActivity, text: CharSequence, kind: Kind = Kind.INFO) {
        val root = activity.rootFrame
        root.findViewWithTag<View>(TAG)?.let { root.removeView(it) }
        val view = LayoutInflater.from(activity).inflate(R.layout.view_notice, root, false)
        view.tag = TAG
        view.findViewById<TextView>(R.id.notice_text).text = text
        view.findViewById<ImageView>(R.id.notice_icon).apply {
            setImageResource(kind.icon)
            imageTintList = activity.getColorStateList(kind.color)
        }
        val lp = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            Gravity.BOTTOM or Gravity.START
        )
        root.addView(view, root.indexOfChild(activity.tape), lp)
        view.alpha = 0f
        view.translationY = 14 * activity.resources.displayMetrics.density
        view.animate().alpha(1f).translationY(0f).setDuration(Motion.BASE).setInterpolator(Motion.out).start()
        view.postDelayed({
            view.animate().alpha(0f).setDuration(Motion.BASE)
                .withEndAction { root.removeView(view) }
                .start()
        }, SHOW_MS)
    }

    private const val TAG = "gd.notice"
}
