package ar.vale.projectorlauncher.device

import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings

/** Ser la pantalla de inicio del equipo. No hay una sola forma: depende del firmware. */
object HomeRole {

    fun isDefault(context: Context): Boolean {
        val home = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
        val resolved = context.packageManager.resolveActivity(home, PackageManager.MATCH_DEFAULT_ONLY)
        return resolved?.activityInfo?.packageName == context.packageName
    }

    /** La pantalla del sistema para elegirnos, o null si este equipo no ofrece ninguna. */
    fun requestIntent(context: Context): Intent? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val roles = context.getSystemService(RoleManager::class.java)
            if (roles != null && roles.isRoleAvailable(RoleManager.ROLE_HOME) && !roles.isRoleHeld(RoleManager.ROLE_HOME)) {
                return roles.createRequestRoleIntent(RoleManager.ROLE_HOME)
            }
        }
        return SystemScreens.first(context, Intent(Settings.ACTION_HOME_SETTINGS))
    }

    /** Lo que funciona en todos los equipos con ADB. */
    fun adbCommand(context: Context): String =
        "adb shell cmd package set-home-activity ${context.packageName}/.LauncherActivity"
}
