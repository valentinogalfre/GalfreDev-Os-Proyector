package ar.vale.projectorlauncher

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import java.io.File

/** Abre el instalador del sistema para un .apk (sideload). */
object ApkInstaller {

    fun install(activity: GdActivity, file: File) {
        // Android 8+: la app debe tener permitido "instalar apps desconocidas".
        if (!activity.packageManager.canRequestPackageInstalls()) {
            Notice.show(activity, activity.getString(R.string.apk_need_unknown_sources), Notice.Kind.WARN)
            runCatching {
                activity.startActivity(
                    Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:${activity.packageName}")
                    )
                )
            }
            return
        }
        val intent = Intent(Intent.ACTION_VIEW)
            .setDataAndType(ApkProvider.uriFor(activity, file), ApkProvider.MIME)
            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        runCatching { activity.startActivity(intent) }
            .onFailure { Notice.show(activity, activity.getString(R.string.apk_install_error), Notice.Kind.ERROR) }
    }
}
