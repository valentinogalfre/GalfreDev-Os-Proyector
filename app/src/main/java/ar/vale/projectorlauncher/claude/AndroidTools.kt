package ar.vale.projectorlauncher.claude

import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import ar.vale.projectorlauncher.AppInfo
import ar.vale.projectorlauncher.AppRepository
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.apps.Streaming
import ar.vale.projectorlauncher.apps.StreamingLauncher
import ar.vale.projectorlauncher.device.CalibrationActivity
import ar.vale.projectorlauncher.device.SleepTimer
import ar.vale.projectorlauncher.juntada.JuntadaActivity
import ar.vale.projectorlauncher.juntada.JuntadaHub
import ar.vale.projectorlauncher.media.Time
import ar.vale.projectorlauncher.store.Catalog
import ar.vale.projectorlauncher.store.StoreDetailActivity
import ar.vale.projectorlauncher.ui.Device
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Screen
import ar.vale.projectorlauncher.ui.Sheet
import ar.vale.projectorlauncher.wall.WallActivity
import ar.vale.projectorlauncher.wall.WallView
import org.json.JSONArray
import org.json.JSONObject
import java.text.Normalizer
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import kotlin.math.roundToInt

/** Elige la app que más se parece a lo que se pidió. */
object AppMatch {

    private val MARKS = Regex("\\p{M}+")

    private fun fold(text: String) =
        Normalizer.normalize(text, Normalizer.Form.NFD).replace(MARKS, "").lowercase(Locale.ROOT).trim()

    /** Devuelve el índice del mejor nombre, o null. Pide coincidencia real: mejor nada que otra app. */
    fun best(query: String, labels: List<String>): Int? {
        val q = fold(query)
        if (q.isEmpty()) return null
        val folded = labels.map(::fold)
        val exact = folded.indexOf(q)
        if (exact >= 0) return exact
        val prefix = folded.indexOfFirst { it.startsWith(q) }
        if (prefix >= 0) return prefix
        val word = folded.indexOfFirst { label -> label.split(' ').any { it.startsWith(q) } }
        if (word >= 0) return word
        return folded.indexOfFirst { it.contains(q) }.takeIf { it >= 0 && q.length >= MIN_CONTAINS }
    }

    private const val MIN_CONTAINS = 3
}

/** Las herramientas, conectadas al equipo. Corre en el hilo de la conversación. */
class AndroidTools(private val context: Context) : ToolRunner {

    private val main = Handler(Looper.getMainLooper())
    private val prefs = Prefs(context)
    private val audio = context.getSystemService(AudioManager::class.java)
    private var phase: (String) -> Unit = {}
    private val screen = ScreenTools(AndroidScreen(context), onLooking = { phase("ver_pantalla") }, enabled = { prefs.claudeHands })

    override fun run(name: String, input: JSONObject, phase: (String) -> Unit): ToolOutcome {
        this.phase = phase
        return run(name, input)
    }

    override fun run(name: String, input: JSONObject): ToolOutcome = when (name) {
        "ver_pantalla" -> screen.see()
        "tocar" -> screen.tap(input.getInt("elemento"))
        "escribir" -> screen.type(input.getString("texto"), if (input.has("elemento")) input.getInt("elemento") else null)
        "tecla" -> screen.key(input.getString("nombre"))
        "deslizar" -> screen.swipe(input.getString("direccion"))
        "esperar" -> screen.wait(input.getInt("segundos"))
        "listar_apps" -> ToolOutcome(apps().joinToString("\n") { it.label })
        "abrir_app" -> openApp(input.getString("nombre"))
        "abrir_enlace" -> openLink(input.getString("url"))
        "estado_equipo" -> ToolOutcome(status().toString())
        "volumen" -> setVolume(input.getInt("porcentaje"))
        "temporizador_apagado" -> setTimer(input.getInt("minutos"))
        "mostrar_pared" -> showWall(input.getString("modo"), input.optInt("cuenta_regresiva_minutos", 0))
        "armar_trivia" -> startTrivia(input.getString("tema"), input.optInt("preguntas", 8))
        "abrir_calibracion" -> {
            open(Intent(context, CalibrationActivity::class.java), context.getString(R.string.cal_title))
            ToolOutcome("Calibración abierta. Se cambia de carta con izquierda y derecha.")
        }
        "listar_tienda" -> ToolOutcome(store().toString())
        "abrir_ficha_tienda" -> openStoreEntry(input.getString("id"))
        else -> ToolOutcome("No existe la herramienta $name.", isError = true)
    }

    private fun apps(): List<AppInfo> = AppRepository.loadApps(context)

    private fun openApp(name: String): ToolOutcome {
        val apps = apps()
        val index = AppMatch.best(name, apps.map { it.label })
            ?: return ToolOutcome("No hay ninguna app instalada con ese nombre.", isError = true)
        val app = apps[index]
        val intent = AppRepository.launchIntent(context.packageManager, app.packageName)
            ?: return ToolOutcome("${app.label} está instalada pero no se puede abrir.", isError = true)
        prefs.incrementUsage(app.packageName)
        openExternal(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK), app.label)
        return ToolOutcome("${app.label} abierta.")
    }

    private fun openLink(url: String): ToolOutcome {
        if (!Tools.isSafeUrl(url)) return ToolOutcome("Solo se abren direcciones https.", isError = true)
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url.trim())).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        inService(intent)?.let { name ->
            openExternal(intent, name)
            return ToolOutcome("Abierto en $name. Usá ver_pantalla para ver qué quedó.")
        }
        if (intent.resolveActivity(context.packageManager) == null) {
            return ToolOutcome("No hay un navegador instalado. TV Bro está en la tienda.", isError = true)
        }
        if (!confirm(url)) return ToolOutcome("La persona no aprobó abrir el enlace.", isError = true)
        openExternal(intent, null)
        return ToolOutcome("Enlace abierto.")
    }

    /**
     * Un enlace de Netflix, YouTube y compañía va a su app, que es donde sirve, y no pide permiso:
     * lo peor que puede pasar es que se abra una película. Devuelve el nombre del servicio, o null
     * si no es de ninguno o su app no sabe abrirlo.
     */
    private fun inService(intent: Intent): String? {
        val pm = context.packageManager
        val service = Streaming.byHost(intent.data?.host) ?: return null
        val pkg = StreamingLauncher.current(context, service) ?: return null
        intent.setPackage(pkg)
        if (intent.resolveActivity(pm) != null) return service.name
        intent.setPackage(null)
        return null
    }

    /** Lo que Claude quiere abrir puede venir de una página: lo aprueba alguien frente a la pantalla. */
    /** La pregunta que está en pantalla, para cerrarla si detienen la respuesta. */
    private var asking: Sheet? = null

    /** Detener no espera el minuto que dura la pregunta: se cierra como si dijeran que no. */
    fun release() {
        main.post { asking?.dismiss() }
    }

    private fun confirm(url: String): Boolean {
        val activity = GdActivity.current ?: return false
        val latch = CountDownLatch(1)
        var accepted = false
        main.post {
            val sheet = Sheet.confirm(
                activity,
                activity.getString(R.string.claude_link_title),
                url,
                activity.getString(R.string.claude_link_yes)
            ) { accepted = true }
            asking = sheet
            // Se suelta recién después del clic: dismiss corre antes que la acción de la opción.
            sheet.onClosed = {
                asking = null
                main.post { latch.countDown() }
            }
        }
        latch.await(CONFIRM_SECONDS, TimeUnit.SECONDS)
        return accepted
    }

    private fun status(): JSONObject {
        val size = Screen.realSize(context)
        val max = audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC).coerceAtLeast(1)
        val format = SimpleDateFormat("EEEE d 'de' MMMM 'de' yyyy, HH:mm", Locale.forLanguageTag("es-AR"))
        return JSONObject()
            .put("fecha_y_hora", format.format(Date()))
            .put("red", Device.networkLabel(context))
            .put("resolucion", "${size.x} × ${size.y}")
            .put("espacio_libre", Time.size(context.filesDir.usableSpace))
            .put("android", Build.VERSION.RELEASE)
            .put("volumen", audio.getStreamVolume(AudioManager.STREAM_MUSIC) * 100 / max)
            .put("temporizador_minutos", SleepTimer.remainingMinutes(context) ?: JSONObject.NULL)
    }

    private fun setVolume(percent: Int): ToolOutcome {
        val max = audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        audio.setStreamVolume(AudioManager.STREAM_MUSIC, (percent * max / 100f).roundToInt(), AudioManager.FLAG_SHOW_UI)
        return ToolOutcome("Volumen en $percent%.")
    }

    private fun setTimer(minutes: Int): ToolOutcome {
        if (minutes == 0) {
            SleepTimer.cancel(context)
            return ToolOutcome("Temporizador cancelado.")
        }
        SleepTimer.start(context, minutes)
        return ToolOutcome("En $minutes minutos se pausa lo que suena y se apaga la imagen.")
    }

    private fun showWall(mode: String, countdown: Int): ToolOutcome {
        prefs.wallMode = when (mode) {
            "hora" -> WallView.Mode.CLOCK
            "reticula" -> WallView.Mode.GRID
            else -> WallView.Mode.WORDS
        }.ordinal
        val intent = Intent(context, WallActivity::class.java)
        if (countdown > 0) intent.putExtra(WallActivity.EXTRA_COUNTDOWN_MINUTES, countdown)
        open(intent, context.getString(R.string.word_pared))
        return ToolOutcome(if (countdown > 0) "Cuenta regresiva de $countdown minutos en la pared." else "Pared a la vista.")
    }

    private fun startTrivia(topic: String, count: Int): ToolOutcome {
        val started = runCatching { JuntadaHub.get(context).startTrivia(topic, count, JuntadaHub.source(context)) }
        if (started.isFailure) return ToolOutcome("Ya se está armando una trivia.", isError = true)
        open(JuntadaActivity.trivia(context), context.getString(R.string.word_juntada))
        return ToolOutcome("Trivia de $count preguntas en camino. En la pared está el código para sumarse desde el celular; empieza sola en unos segundos.")
    }

    private fun store(): JSONArray {
        val list = JSONArray()
        Catalog.load(context).apps.forEach { app ->
            val installed = runCatching { context.packageManager.getPackageInfo(app.packageName, 0) }.isSuccess
            list.put(
                JSONObject().put("id", app.id).put("nombre", app.name).put("para_que", app.summary).put("instalada", installed)
            )
        }
        return list
    }

    private fun openStoreEntry(id: String): ToolOutcome {
        val app = Catalog.load(context).apps.firstOrNull { it.id == id }
            ?: return ToolOutcome("La tienda no tiene ese id. Usá listar_tienda.", isError = true)
        open(Intent(context, StoreDetailActivity::class.java).putExtra(StoreDetailActivity.EXTRA_ID, app.id), app.name)
        return ToolOutcome("Ficha de ${app.name} abierta. Falta que la persona elija instalar.")
    }

    private fun open(intent: Intent, title: String) {
        main.post {
            val activity = GdActivity.current
            if (activity != null) activity.openScreen(intent, title)
            else context.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        }
    }

    private fun openExternal(intent: Intent, title: String?) {
        main.post {
            val activity = GdActivity.current
            if (activity != null) activity.openExternal(intent, title) else context.startActivity(intent)
        }
    }

    private companion object {
        const val CONFIRM_SECONDS = 60L
    }
}
