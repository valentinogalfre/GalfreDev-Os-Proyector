package ar.vale.projectorlauncher.device

import android.app.AlarmManager
import android.app.PendingIntent
import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.SystemClock
import android.view.KeyEvent

/**
 * Apagar a una hora: pausa lo que esté sonando y apaga la imagen.
 *
 * Android no deja que una app apague el equipo. Lo más cerca es bloquear la pantalla, y para eso
 * hace falta que el usuario active el permiso de administrador una vez. Sin eso, queda la
 * pantalla negra: es lo mejor que se puede hacer y lo decimos.
 */
object SleepTimer {

    private const val PREFS = "gd_sleep"
    private const val KEY_AT = "at"

    private fun pending(context: Context): PendingIntent = PendingIntent.getBroadcast(
        context, 0, Intent(context, SleepReceiver::class.java),
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    fun start(context: Context, minutes: Int) {
        val at = SystemClock.elapsedRealtime() + minutes * 60_000L
        val alarms = context.getSystemService(AlarmManager::class.java)
        alarms.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, at, pending(context))
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putLong(KEY_AT, at).apply()
    }

    fun cancel(context: Context) {
        context.getSystemService(AlarmManager::class.java).cancel(pending(context))
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(KEY_AT).apply()
    }

    /** Minutos que faltan, o null si no hay temporizador. */
    fun remainingMinutes(context: Context): Long? {
        val at = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getLong(KEY_AT, 0L)
        val left = at - SystemClock.elapsedRealtime()
        return if (at == 0L || left <= 0) null else (left + 59_999L) / 60_000L
    }

    fun adminComponent(context: Context) = ComponentName(context, SleepAdmin::class.java)

    fun canLock(context: Context): Boolean =
        context.getSystemService(DevicePolicyManager::class.java).isAdminActive(adminComponent(context))

    fun requestLockIntent(context: Context, explanation: String): Intent =
        Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            .putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent(context))
            .putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, explanation)

    /** Se llama al vencer el tiempo. También lo puede pedir Claude. */
    fun fire(context: Context) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(KEY_AT).apply()
        val audio = context.getSystemService(AudioManager::class.java)
        audio.dispatchMediaKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PAUSE))
        audio.dispatchMediaKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_PAUSE))
        if (canLock(context)) {
            context.getSystemService(DevicePolicyManager::class.java).lockNow()
        } else {
            runCatching {
                context.startActivity(Intent(context, BlackoutActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            }
        }
    }
}

class SleepReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) = SleepTimer.fire(context)
}

/** Sin métodos propios: existe solo para que el sistema le permita bloquear la pantalla. */
class SleepAdmin : DeviceAdminReceiver()
