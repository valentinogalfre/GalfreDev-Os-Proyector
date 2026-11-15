package ar.vale.projectorlauncher.remote

import android.app.Instrumentation
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import ar.vale.projectorlauncher.carrera.CarreraFiles
import ar.vale.projectorlauncher.ApkInstaller
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.LauncherActivity
import ar.vale.projectorlauncher.MediaTypes
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.apps.Streaming
import ar.vale.projectorlauncher.apps.StreamingLauncher
import ar.vale.projectorlauncher.claude.ClaudeActivity
import ar.vale.projectorlauncher.claude.ClaudeRuntime
import ar.vale.projectorlauncher.claude.ClaudeSettings
import ar.vale.projectorlauncher.claude.KeyVault
import ar.vale.projectorlauncher.device.BlackoutActivity
import ar.vale.projectorlauncher.device.Casting
import ar.vale.projectorlauncher.device.DeviceReport
import ar.vale.projectorlauncher.juntada.JuntadaHub
import ar.vale.projectorlauncher.media.CineActivity
import ar.vale.projectorlauncher.media.Storage
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Screen
import ar.vale.projectorlauncher.ui.Sheet
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.IOException
import java.io.InputStream
import java.util.Locale

/** Conecta los pedidos del celular con el equipo. */
class AndroidRemote(private val context: Context) : RemoteDevice {

    private val main = Handler(Looper.getMainLooper())
    private val audio = context.getSystemService(AudioManager::class.java)
    private val instrumentation = Instrumentation()

    override fun state(): JSONObject {
        val size = Screen.realSize(context)
        return JSONObject()
            .put("name", DeviceName.of(context))
            .put("resolution", "${size.x} × ${size.y}")
            .put("full_control", RemoteAccessibility.instance != null)
            .put("claude_key", KeyVault.has(context))
            .put("secure_port", RemoteState.securePort)
    }

    override fun privateScreen(): Boolean {
        GdActivity.current?.let { return it.ownerOnly }
        return RemoteGuard.handsOff(RemoteAccessibility.instance?.window()?.packageName)
    }

    override fun key(name: String): RemoteDevice.Result {
        NAVIGATION[name]?.let { return navigate(it) }
        MEDIA[name]?.let {
            audio.dispatchMediaKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, it))
            audio.dispatchMediaKeyEvent(KeyEvent(KeyEvent.ACTION_UP, it))
            return RemoteDevice.Result.OK
        }
        return when (name) {
            "volup" -> volume(AudioManager.ADJUST_RAISE)
            "voldown" -> volume(AudioManager.ADJUST_LOWER)
            "mute" -> volume(AudioManager.ADJUST_TOGGLE_MUTE)
            // La tecla Home inyectada no llega a la política del sistema: se abre el inicio directo.
            "home" -> start(Intent(context, LauncherActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP))
            "blackout" -> start(Intent(context, BlackoutActivity::class.java))
            else -> RemoteDevice.Result.UNKNOWN
        }
    }

    private fun volume(direction: Int): RemoteDevice.Result {
        audio.adjustStreamVolume(AudioManager.STREAM_MUSIC, direction, AudioManager.FLAG_SHOW_UI)
        return RemoteDevice.Result.OK
    }

    /**
     * Una app solo puede inyectar teclas en sus propias ventanas. Con una pantalla nuestra delante
     * alcanza con eso; para el resto hace falta el permiso de accesibilidad.
     */
    private fun navigate(code: Int): RemoteDevice.Result {
        if (GdActivity.current != null) {
            val sent = runCatching { instrumentation.sendKeyDownUpSync(code) }.isSuccess
            if (sent) return RemoteDevice.Result.OK
        }
        val service = RemoteAccessibility.instance ?: return RemoteDevice.Result.NEEDS_ACCESSIBILITY
        // Si no hay adónde ir, no pasa nada: igual que apretar abajo al final de una lista.
        return if (service.press(code)) RemoteDevice.Result.OK else RemoteDevice.Result.NEEDS_PERSON
    }

    override fun text(value: String, submit: Boolean): RemoteDevice.Result {
        val activity = GdActivity.current
        if (activity != null) {
            if (activity.keyboard == null) return RemoteDevice.Result.NO_FIELD
            main.post {
                activity.keyboard?.let { keyboard ->
                    keyboard.replace(value)
                    if (submit) keyboard.submit()
                }
            }
            return RemoteDevice.Result.OK
        }
        val service = RemoteAccessibility.instance ?: return RemoteDevice.Result.NEEDS_ACCESSIBILITY
        return if (service.setText(value)) RemoteDevice.Result.OK else RemoteDevice.Result.NO_FIELD
    }

    override fun link(url: String): RemoteDevice.Result =
        start(Intent(Intent.ACTION_VIEW, Uri.parse(url)))

    /** Android no deja abrir pantallas desde segundo plano si hay otra app delante, salvo con accesibilidad. */
    private fun start(intent: Intent): RemoteDevice.Result {
        if (GdActivity.current == null && RemoteAccessibility.instance == null) {
            return RemoteDevice.Result.NEEDS_ACCESSIBILITY
        }
        main.post { runCatching { context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) } }
        return RemoteDevice.Result.OK
    }

    override fun fits(length: Long): Boolean =
        Uploads.fits(Storage.inbox(context).usableSpace, length, SPACE_MARGIN)

    override fun upload(name: String, length: Long, body: InputStream): String {
        val dir = Storage.inbox(context)
        val target = Uploads.unique(dir, name)
        val partial = File(dir, "${target.name}.part")
        try {
            val copied = partial.outputStream().use { body.copyTo(it) }
            if (copied != length) throw IOException("llegó incompleto")
            if (!partial.renameTo(target)) throw IOException("no se pudo guardar")
        } catch (e: IOException) {
            partial.delete()
            throw HttpError(400, "incomplete")
        }
        main.post { announce(target) }
        return target.name
    }

    /**
     * Lo que llega se ofrece en pantalla. Un APK no se instala solo: el panel lo puede aceptar el
     * celular, pero el instalador del sistema solo lo confirma una persona (ver [RemoteGuard]).
     */
    private fun announce(file: File) {
        val activity = GdActivity.current ?: return
        // Con alguien presentando, lo que llega se guarda en Cine sin aparecer encima de su pantalla.
        if (JuntadaHub.get(context).staged) return
        val kind = MediaTypes.kindOf(file)
        val options = ArrayList<Sheet.Option>()
        when (kind) {
            FileKind.APK -> options.add(Sheet.Option(activity.getString(R.string.remote_got_install), R.drawable.ic_install) {
                ApkInstaller.install(activity, file)
            })
            FileKind.OTHER, FileKind.DIR -> {
                Notice.show(activity, activity.getString(R.string.remote_got_saved, file.name), Notice.Kind.OK)
                return
            }
            else -> options.add(Sheet.Option(activity.getString(R.string.remote_got_open), R.drawable.ic_play) {
                activity.openScreen(CineActivity.player(activity, file, kind), file.name)
            })
        }
        options.add(Sheet.Option(activity.getString(R.string.remote_got_later)) {})
        Sheet.show(activity, file.name, options, activity.getString(R.string.remote_got_body))
    }

    override fun saveClaudeKey(key: String): Boolean = KeyVault.save(context, key)

    override fun askClaude(text: String): RemoteDevice.Result {
        if (ClaudeRuntime.snapshot.busy) return RemoteDevice.Result.BUSY
        val screen = Intent(context, ClaudeActivity::class.java)
            .putExtra(ClaudeActivity.EXTRA_ASK, text)
            .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        // Con otra app delante, lo más probable es que el pedido sea sobre esa app: pausá, buscá,
        // poné el siguiente. Traer nuestra pantalla al frente se la sacaría de las manos a Claude,
        // así que trabaja ahí mismo y lo cuenta en un renglón encima.
        // El celular consulta el estado apenas recibe el OK, y el pedido recién arranca en el hilo
        // principal o cuando abre la pantalla: hasta entonces el estado tiene que decir que ya está en curso.
        if (KeyVault.has(context)) ClaudeRuntime.announce(text)
        val result = if (GdActivity.current == null && RemoteAccessibility.instance != null) {
            main.post {
                val asked = ClaudeRuntime.ask(context, text)
                if (!asked) runCatching { context.startActivity(screen.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
            }
            RemoteDevice.Result.OK
        } else {
            start(screen)
        }
        if (result != RemoteDevice.Result.OK) main.post { ClaudeRuntime.unannounce() }
        return result
    }

    override fun claudeState(): JSONObject {
        val state = ClaudeRuntime.snapshot
        return JSONObject()
            .put("busy", state.busy)
            .put("question", state.question)
            .put("status", ClaudeSettings.status(context, state) ?: JSONObject.NULL)
            // Cómo terminó: el celular lee en voz alta una respuesta, y no un error.
            .put("end", state.end?.name?.lowercase(Locale.ROOT) ?: JSONObject.NULL)
    }

    override fun stopClaude() {
        main.post { ClaudeRuntime.cancel() }
    }

    override fun newClaude() {
        main.post { ClaudeRuntime.reset() }
    }

    override fun report(): JSONObject = DeviceReport.json(context)

    override fun pointer(x: Float, y: Float, visible: Boolean) = WallPointer.move(x, y, visible)

    override fun tap(x: Float, y: Float): RemoteDevice.Result = touching { it.tap(x, y) }

    override fun swipe(fromX: Float, fromY: Float, toX: Float, toY: Float): RemoteDevice.Result =
        touching { it.swipe(fromX, fromY, toX, toY) }

    private fun touching(gesture: (RemoteAccessibility) -> Boolean): RemoteDevice.Result {
        val service = RemoteAccessibility.instance ?: return RemoteDevice.Result.NEEDS_ACCESSIBILITY
        return if (gesture(service)) RemoteDevice.Result.OK else RemoteDevice.Result.NEEDS_PERSON
    }

    override fun apps(): JSONObject {
        val pm = context.packageManager
        val others = JSONArray()
        AppRepository.names(context)
            .filter { (_, pkg) -> Streaming.byPackage(pkg) == null }
            .forEach { (name, pkg) -> others.put(JSONObject().put("name", name).put("package", pkg)) }
        // Si el equipo recibe la pantalla de un celular, se dice con qué: el celular ofrece abrirlo.
        val receiver = Casting.best(context)
        return JSONObject()
            .put("services", Streaming.forPhone({ Prefs(context).serviceApp(it) }) { StreamingLauncher.isInstalled(context, it) })
            .put("apps", others)
            .put("cast", receiver?.let { JSONObject().put("name", it.name) } ?: JSONObject.NULL)
    }

    override fun cast(): RemoteDevice.Result {
        val receiver = Casting.best(context) ?: return RemoteDevice.Result.NOT_INSTALLED
        return start(receiver.intent)
    }

    /** Un servicio que no está se busca en el proyector: la instalación la confirma una persona. */
    override fun open(pkg: String): RemoteDevice.Result {
        val intent = AppRepository.launchIntent(context.packageManager, pkg)
            ?: Streaming.byPackage(pkg)?.let { StreamingLauncher.fetchIntent(context, it) }
            ?: return RemoteDevice.Result.NOT_INSTALLED
        return start(intent)
    }

    private companion object {
        const val SPACE_MARGIN = 150L * 1024 * 1024

        val NAVIGATION = mapOf(
            "up" to KeyEvent.KEYCODE_DPAD_UP,
            "down" to KeyEvent.KEYCODE_DPAD_DOWN,
            "left" to KeyEvent.KEYCODE_DPAD_LEFT,
            "right" to KeyEvent.KEYCODE_DPAD_RIGHT,
            "ok" to KeyEvent.KEYCODE_DPAD_CENTER,
            "back" to KeyEvent.KEYCODE_BACK,
            "menu" to KeyEvent.KEYCODE_MENU
        )

        val MEDIA = mapOf(
            "playpause" to KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
            "next" to KeyEvent.KEYCODE_MEDIA_NEXT,
            "prev" to KeyEvent.KEYCODE_MEDIA_PREVIOUS,
            "stop" to KeyEvent.KEYCODE_MEDIA_STOP
        )
    }
}

/** La página y sus fuentes. Es una lista cerrada: no hay forma de pedir otro archivo. */
class RemotePage(private val context: Context) : StaticFiles {

    override fun open(path: String): HttpResponse? = when (path) {
        "/", "/index.html" -> asset("remote/index.html", "text/html; charset=utf-8", cacheSeconds = 0)
        "/logo.svg" -> asset("remote/logo.svg", "image/svg+xml", CACHE_SECONDS)
        "/fonts/archivo.ttf" -> font(R.font.archivo_extrabold)
        "/fonts/sans.ttf" -> font(R.font.instrument_sans)
        "/fonts/sans-medium.ttf" -> font(R.font.instrument_sans_medium)
        "/fonts/mono.ttf" -> font(R.font.geist_mono_medium)
        else -> game(path)
    }

    /** La carrera: el volante que abre cada celular y, en una notebook, también la pared. */
    private fun game(path: String): HttpResponse? {
        if (!path.startsWith(GAME)) return null
        val file = CarreraFiles(context).open(path.substring(GAME.length)) ?: return null
        return HttpResponse(200, file.type, bytes = file.bytes, cacheSeconds = if (file.fixed) CACHE_SECONDS else 0, policy = HttpResponse.GAME_POLICY)
    }

    private fun asset(name: String, type: String, cacheSeconds: Int) =
        HttpResponse(200, type, bytes = context.assets.open(name).use { it.readBytes() }, cacheSeconds = cacheSeconds)

    private fun font(id: Int) = HttpResponse(
        200, "font/ttf",
        bytes = context.resources.openRawResource(id).use { it.readBytes() },
        cacheSeconds = CACHE_SECONDS
    )

    private companion object {
        const val CACHE_SECONDS = 86400
        const val GAME = "/carrera/"
    }
}
