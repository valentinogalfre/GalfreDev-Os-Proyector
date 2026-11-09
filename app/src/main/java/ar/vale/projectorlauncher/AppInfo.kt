package ar.vale.projectorlauncher

import android.graphics.drawable.Drawable

/** Una app lanzable. [banner] es la imagen 16:9 de las apps de TV, cuando la declaran. */
data class AppInfo(
    val label: String,
    val packageName: String,
    val icon: Drawable,
    val banner: Drawable? = null
)
