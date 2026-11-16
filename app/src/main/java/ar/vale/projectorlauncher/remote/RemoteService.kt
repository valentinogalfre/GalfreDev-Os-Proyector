package ar.vale.projectorlauncher.remote

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.net.ConnectivityManager
import android.os.Build
import android.os.IBinder
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.carrera.CarreraHub
import ar.vale.projectorlauncher.juntada.JuntadaHub
import java.io.File
import java.io.IOException
import java.net.Inet4Address

/** Lo que muestra la pantalla Celular. */
object RemoteState {
    @Volatile var pairing: Pairing? = null
    @Volatile var port = 0

    /** El puerto de la misma página por HTTPS, o 0 si este equipo no pudo abrirlo. */
    @Volatile var securePort = 0

    /** El puerto del volante con un certificado que los celulares aceptan sin avisos, o 0 si hoy no lo hay. */
    @Volatile var publicPort = 0

    val running: Boolean get() = port > 0

    /** Dirección de este equipo en la red local, si está conectado a una. */
    fun address(context: Context): String? {
        val cm = context.getSystemService(ConnectivityManager::class.java) ?: return null
        val links = cm.getLinkProperties(cm.activeNetwork) ?: return null
        return links.linkAddresses.map { it.address }.firstOrNull { it is Inet4Address && !it.isLoopbackAddress }?.hostAddress
    }

    fun url(context: Context): String? = address(context)?.let { "http://$it:$port/" }

    /** Para pedir permiso: el código va después del `#`, igual que el del dueño, y no abre nada solo. */
    fun askUrl(context: Context): String? = url(context)?.let { "$it#g=${AccessHub.get(context).code}" }

    /** El token va después del `#`: el navegador no lo manda en el pedido de la página. */
    fun pairingUrl(context: Context): String? {
        val token = pairing?.token ?: return null
        return url(context)?.let { "$it#t=$token" }
    }
}

/** Mantiene el servidor vivo mientras se usa otra app. Solo corre si el usuario lo activó. */
class RemoteService : Service() {

    private var server: RemoteServer? = null
    private var secureServer: RemoteServer? = null
    private var publicServer: RemoteServer? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        goForeground()
        val prefs = Prefs(this)
        val pairing = RemoteState.pairing
            ?: Pairing(prefs.remoteToken, { prefs.remoteToken = it }).also { RemoteState.pairing = it }
        val party = JuntadaRoutes(JuntadaHub.get(this), JuntadaHub.source(this), JuntadaHub.files(this))
        val router = Router(
            pairing, AndroidRemote(applicationContext), party, AccessHub.get(this),
            race = CarreraHub.carrera::serve, securePort = { RemoteState.securePort }, files = RemotePage(applicationContext)
        )
        val created = RemoteServer(router)
        try {
            RemoteState.port = created.start()
            server = created
        } catch (e: IOException) {
            stopSelf()
            return
        }
        // Crear la clave del certificado puede tardar en un equipo lento: no frena el arranque.
        val game = Router(pairing, AndroidRemote(applicationContext), race = CarreraHub.carrera::serve, files = RemotePage(applicationContext), gameOnly = true)
        Thread({
            startSecure(router)
            startPublic(game)
        }, "gd-remote-tls").start()
    }

    private fun startSecure(router: Router) {
        val sockets = Tls.sockets() ?: return
        val created = RemoteServer(router, sockets, secure = true)
        runCatching { created.start(SECURE_PORT) }.onSuccess { port ->
            if (server == null) {
                created.stop()
            } else {
                secureServer = created
                RemoteState.securePort = port
            }
        }
    }

    /** El volante por una dirección segura sin advertencias. Baja el certificado de internet: si no hay, no hay puerto. */
    private fun startPublic(game: Router) {
        val sockets = PublicTls.sockets(File(filesDir, "volante-tls")) ?: return
        val created = RemoteServer(game, sockets, secure = true)
        runCatching { created.start(PUBLIC_PORT) }.onSuccess { port ->
            if (server == null) {
                created.stop()
            } else {
                publicServer = created
                RemoteState.publicPort = port
            }
        }
    }

    override fun onDestroy() {
        publicServer?.stop()
        publicServer = null
        RemoteState.publicPort = 0
        server?.stop()
        server = null
        secureServer?.stop()
        secureServer = null
        RemoteState.port = 0
        RemoteState.securePort = 0
        super.onDestroy()
    }

    private fun goForeground() {
        val channel = NotificationChannel(CHANNEL, getString(R.string.word_celular), NotificationManager.IMPORTANCE_LOW)
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        val notification = Notification.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_phone)
            .setContentTitle(getString(R.string.remote_running))
            .setOngoing(true)
            .build()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    companion object {
        private const val CHANNEL = "gd_remote"
        private const val NOTIFICATION_ID = 8686
        private const val SECURE_PORT = 8696
        private const val PUBLIC_PORT = 8697

        fun start(context: Context) {
            context.startForegroundService(Intent(context, RemoteService::class.java))
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, RemoteService::class.java))
        }
    }
}
