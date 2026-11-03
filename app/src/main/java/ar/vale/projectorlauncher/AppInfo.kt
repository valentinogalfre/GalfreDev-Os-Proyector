package ar.vale.projectorlauncher

import android.graphics.drawable.Drawable

/** Una app lanzable de la grilla. */
data class AppInfo(
    val label: String,
    val packageName: String,
    val icon: Drawable
)
