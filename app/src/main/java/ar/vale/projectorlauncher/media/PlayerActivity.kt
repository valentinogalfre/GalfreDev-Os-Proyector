package ar.vale.projectorlauncher.media

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.graphics.Matrix
import android.graphics.pdf.PdfRenderer
import android.media.ExifInterface
import android.media.MediaMetadataRetriever
import android.media.MediaPlayer
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.ParcelFileDescriptor
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView
import android.widget.VideoView
import ar.vale.projectorlauncher.FileKind
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.store.StoreActivity
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.LineProgress
import ar.vale.projectorlauncher.ui.Motion
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Screen
import ar.vale.projectorlauncher.ui.Sheet
import java.io.File
import java.util.concurrent.Executors

/**
 * Reproductor: video, música, fotos y PDF con el mismo control.
 *
 * Las flechas hacen lo mismo en todos: izquierda y derecha mueven (10 segundos, o una foto, o una
 * página), arriba y abajo cambian de archivo, OK pausa o arranca el pase automático.
 */
class PlayerActivity : GdActivity() {

    private lateinit var video: VideoView
    private lateinit var imageBack: ImageView
    private lateinit var imageFront: ImageView
    private lateinit var subtitle: TextView
    private lateinit var hud: View
    private lateinit var hudTitle: TextView
    private lateinit var hudTime: TextView
    private lateinit var hudLine: LineProgress
    private lateinit var hudHint: TextView
    private lateinit var resume: ResumeStore

    private val main = Handler(Looper.getMainLooper())
    private var kind = FileKind.VIDEO
    private var playlist: List<File> = emptyList()
    private var index = 0
    private var cues: List<Srt.Cue> = emptyList()
    private var prepared = false
    private var resumeAt = 0L
    private var wasPlaying = true
    private var pendingSeek: Long? = null
    private var player: MediaPlayer? = null
    private var failed = false
    private var slideshow = false
    private var pdf: PdfRenderer? = null
    private var pdfFd: ParcelFileDescriptor? = null
    private var pdfPage = 0
    @Volatile private var imageJob = 0

    /** De a una: mantener apretada una flecha no puede juntar varias fotos en memoria. */
    private val decoder = Executors.newSingleThreadExecutor()

    private val hideHud = Runnable { setHud(false) }
    private val tick = object : Runnable {
        override fun run() {
            if (prepared) {
                val position = (pendingSeek ?: video.currentPosition.toLong())
                showTime(position)
                val cue = Srt.at(cues, position)
                subtitle.text = cue?.text
                subtitle.visibility = if (cue == null) View.GONE else View.VISIBLE
            }
            main.postDelayed(this, TICK_MS)
        }
    }
    private val applySeek = Runnable {
        pendingSeek?.let(::seekExact)
        pendingSeek = null
    }
    private val nextSlide = Runnable {
        if (slideshow) {
            step(1)
            scheduleSlide()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        video = findViewById(R.id.video)
        imageBack = findViewById(R.id.image_back)
        imageFront = findViewById(R.id.image_front)
        subtitle = findViewById(R.id.subtitle)
        hud = findViewById(R.id.hud)
        hudTitle = findViewById(R.id.hud_title)
        hudTime = findViewById(R.id.hud_time)
        hudLine = findViewById(R.id.hud_line)
        hudHint = findViewById(R.id.hud_hint)
        resume = ResumeStore(this)

        val path = intent.getStringExtra(EXTRA_PATH)
        if (path == null) {
            finish()
            return
        }
        val file = File(path)
        kind = runCatching { FileKind.valueOf(intent.getStringExtra(EXTRA_KIND).orEmpty()) }.getOrDefault(FileKind.VIDEO)
        playlist = Storage.siblings(file, kind).ifEmpty { listOf(file) }
        // Recrear la pantalla (el tema cambia solo a la noche) no vuelve al primer archivo.
        index = savedInstanceState?.getInt(STATE_INDEX, -1)?.takeIf { it in playlist.indices }
            ?: playlist.indexOf(file).coerceAtLeast(0)
        pdfPage = savedInstanceState?.getInt(STATE_PAGE) ?: 0
        slideshow = savedInstanceState?.getBoolean(STATE_SLIDES) ?: false
        openCurrent()
        if (PlayerRules.hudOnOpen(kind)) setHud(true)
        scheduleSlide()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putInt(STATE_INDEX, index)
        outState.putInt(STATE_PAGE, pdfPage)
        outState.putBoolean(STATE_SLIDES, slideshow)
    }

    private val current: File get() = playlist[index]

    private fun openCurrent() {
        hudTitle.text = current.nameWithoutExtension
        when (kind) {
            FileKind.IMAGE -> showImage()
            FileKind.PDF -> showPdf()
            else -> playMedia()
        }
    }

    // --- Video y música ---

    private fun playMedia() {
        prepared = false
        video.visibility = View.VISIBLE
        // VideoView pide el foco al crearse, y la cinta se apoya en lo que tiene foco: taparía la película.
        video.isFocusable = false
        video.isFocusableInTouchMode = false
        val audio = kind == FileKind.AUDIO
        findViewById<View>(R.id.audio_panel).visibility = if (audio) View.VISIBLE else View.GONE
        if (audio) bindAudio()
        hudHint.setText(R.string.player_hint_media)
        cues = if (audio) emptyList() else loadSubtitles()
        resumeAt = if (audio) 0L else resume.position(current.absolutePath)
        video.setOnPreparedListener(::onPrepared)
        video.setOnCompletionListener {
            resume.forget(current.absolutePath)
            if (index < playlist.lastIndex) step(1) else closeScreen()
        }
        video.setOnErrorListener { _, _, _ ->
            onCannotPlay()
            true
        }
        video.setVideoPath(current.absolutePath)
    }

    private fun bindAudio() {
        val meta = MediaMetadataRetriever()
        var title: String? = null
        var artist: String? = null
        runCatching {
            meta.setDataSource(current.absolutePath)
            title = meta.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE)
            artist = meta.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST)
        }
        runCatching { meta.release() }
        findViewById<TextView>(R.id.audio_title).text = title ?: current.nameWithoutExtension
        findViewById<TextView>(R.id.audio_artist).text = artist
    }

    private fun loadSubtitles(): List<Srt.Cue> {
        val file = Srt.findFor(current) ?: return emptyList()
        return runCatching { Srt.parse(Srt.decode(file.readBytes())) }.getOrDefault(emptyList())
    }

    private fun onPrepared(player: MediaPlayer) {
        prepared = true
        this.player = player
        if (resumeAt > 0) {
            seekExact(resumeAt)
            notice(getString(R.string.player_resumed, Time.clock(resumeAt)))
            resumeAt = 0
        }
        if (wasPlaying) video.start()
        setHud(true)
    }

    /** Los avisos suben por encima de la barra cuando se ve: ahí abajo está su línea de ayuda. */
    private fun notice(text: String, style: Notice.Kind = Notice.Kind.INFO) {
        Notice.show(this, text, style, if (hud.visibility == View.VISIBLE) hudHeight() else 0)
    }

    /** Vale también antes del primer layout, cuando `hud.height` todavía es cero. */
    private fun hudHeight(): Int {
        if (hud.height > 0) return hud.height
        hud.measure(
            View.MeasureSpec.makeMeasureSpec(Screen.realSize(this).x, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
        )
        return hud.measuredHeight
    }

    /** Un formato que el sistema no decodifica: en estos equipos pasa con varios MKV y audios. */
    private fun onCannotPlay() {
        val options = ArrayList<Sheet.Option>()
        val view = Intent(Intent.ACTION_VIEW)
            .setDataAndType(MediaProvider.uriFor(this, current), MediaProvider.mimeOf(current))
            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        val others = packageManager.queryIntentActivities(view, 0).filter { it.activityInfo.packageName != packageName }
        others.take(MAX_PLAYERS).forEach { info ->
            val intent = Intent(view).setClassName(info.activityInfo.packageName, info.activityInfo.name)
            val label = info.loadLabel(packageManager)
            options.add(Sheet.Option(getString(R.string.player_open_with, label), R.drawable.ic_play) {
                openExternal(intent, label)
            })
        }
        options.add(Sheet.Option(getString(R.string.player_get_player), R.drawable.ic_store) {
            openScreen(Intent(this, StoreActivity::class.java), getString(R.string.word_tienda))
        })
        options.add(Sheet.Option(getString(R.string.back), R.drawable.ic_back) { closeScreen() })
        // Sin nada que reproducir, esta pantalla no tiene qué mostrar: cerrar el panel es irse.
        failed = true
        Sheet.show(this, getString(R.string.player_error), options, getString(R.string.player_error_body))
            .onClosed = { rootFrame.post { closeScreen() } }
    }

    private fun showTime(position: Long) {
        val total = video.duration.toLong().coerceAtLeast(1L)
        hudTime.text = "${Time.clock(position)} / ${Time.clock(total)}"
        hudLine.value = position.toFloat() / total
    }

    /**
     * Busca el cuadro pedido. Sin esto cae en el keyframe anterior, y en un archivo con keyframes
     * separados «+10 s» puede terminar retrocediendo.
     */
    private fun seekExact(positionMs: Long) {
        val exact = player?.let { runCatching { it.seekTo(positionMs, MediaPlayer.SEEK_CLOSEST) }.isSuccess } ?: false
        if (!exact) video.seekTo(positionMs.toInt())
    }

    private fun seekBy(deltaMs: Long) {
        if (!prepared) return
        val base = pendingSeek ?: video.currentPosition.toLong()
        val target = (base + deltaMs).coerceIn(0L, video.duration.toLong())
        pendingSeek = target
        showTime(target)
        main.removeCallbacks(applySeek)
        main.postDelayed(applySeek, SEEK_DELAY_MS)
        setHud(true)
    }

    private fun togglePlay() {
        if (video.isPlaying) video.pause() else video.start()
        setHud(true)
    }

    // --- Fotos ---

    private fun showImage() {
        hudHint.setText(R.string.player_hint_image)
        hudTime.text = "${index + 1} / ${playlist.size}"
        hudLine.value = (index + 1f) / playlist.size
        val job = ++imageJob
        val file = current
        val screen = Screen.realSize(this)
        decoder.execute {
            if (job != imageJob) return@execute
            val bitmap = runCatching { decode(file, screen.x, screen.y) }.getOrNull()
            runOnUiThread {
                if (isDestroyed || job != imageJob) return@runOnUiThread
                if (bitmap == null) notice(getString(R.string.player_error), Notice.Kind.ERROR)
                else crossfade(bitmap)
            }
        }
    }

    private fun decode(file: File, maxW: Int, maxH: Int): Bitmap? {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(file.absolutePath, bounds)
        var sample = 1
        while (bounds.outWidth / sample > maxW * 2 || bounds.outHeight / sample > maxH * 2) sample *= 2
        val bitmap = BitmapFactory.decodeFile(file.absolutePath, BitmapFactory.Options().apply { inSampleSize = sample })
            ?: return null
        val degrees = when (runCatching { ExifInterface(file.absolutePath).getAttributeInt(ExifInterface.TAG_ORIENTATION, 1) }.getOrDefault(1)) {
            ExifInterface.ORIENTATION_ROTATE_90 -> 90f
            ExifInterface.ORIENTATION_ROTATE_180 -> 180f
            ExifInterface.ORIENTATION_ROTATE_270 -> 270f
            else -> 0f
        }
        // Lo que queda en memoria nunca es más grande que la pantalla: con 1 GB, importa.
        val sideways = degrees == 90f || degrees == 270f
        val width = if (sideways) bitmap.height else bitmap.width
        val height = if (sideways) bitmap.width else bitmap.height
        val scale = minOf(1f, maxW.toFloat() / width, maxH.toFloat() / height)
        if (degrees == 0f && scale == 1f) return bitmap
        val matrix = Matrix().apply {
            postRotate(degrees)
            postScale(scale, scale)
        }
        val fitted = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        if (fitted !== bitmap) bitmap.recycle()
        return fitted
    }

    private fun crossfade(bitmap: Bitmap) {
        imageBack.setImageDrawable(imageFront.drawable)
        imageBack.visibility = View.VISIBLE
        imageFront.setImageBitmap(bitmap)
        imageFront.visibility = View.VISIBLE
        if (Motion.full) {
            imageFront.alpha = 0f
            imageFront.animate().alpha(1f).setDuration(Motion.SLOW).setInterpolator(Motion.out).start()
        }
    }

    private fun scheduleSlide() {
        main.removeCallbacks(nextSlide)
        if (slideshow) main.postDelayed(nextSlide, SLIDE_MS)
    }

    // --- PDF ---

    private fun showPdf() {
        hudHint.setText(R.string.player_hint_pdf)
        val opened = runCatching {
            val fd = ParcelFileDescriptor.open(current, ParcelFileDescriptor.MODE_READ_ONLY)
            pdfFd = fd
            pdf = PdfRenderer(fd)
        }
        if (opened.isFailure) {
            notice(getString(R.string.player_pdf_error), Notice.Kind.ERROR)
            return
        }
        renderPage(pdfPage)
    }

    private fun renderPage(number: Int) {
        val renderer = pdf ?: return
        pdfPage = number.coerceIn(0, renderer.pageCount - 1)
        val page = renderer.openPage(pdfPage)
        // Se mide la pantalla y no la vista: antes de la primera página la vista está oculta y mide cero.
        val screen = Screen.realSize(this)
        val scale = minOf(screen.x.toFloat() / page.width, screen.y.toFloat() / page.height)
        val bitmap = Bitmap.createBitmap(
            (page.width * scale).toInt().coerceAtLeast(1),
            (page.height * scale).toInt().coerceAtLeast(1),
            Bitmap.Config.ARGB_8888
        )
        bitmap.eraseColor(Color.WHITE)
        page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
        page.close()
        crossfade(bitmap)
        hudTime.text = "${pdfPage + 1} / ${renderer.pageCount}"
        hudLine.value = (pdfPage + 1f) / renderer.pageCount
    }

    // --- Teclas ---

    /** Avanza o retrocede de archivo (o de página en un PDF). */
    private fun step(delta: Int) {
        if (kind == FileKind.PDF) {
            renderPage(pdfPage + delta)
            return
        }
        val target = index + delta
        if (target !in playlist.indices) {
            if (kind == FileKind.IMAGE) {
                index = (target + playlist.size) % playlist.size
                openCurrent()
            }
            return
        }
        saveProgress()
        index = target
        wasPlaying = true
        openCurrent()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val media = kind == FileKind.VIDEO || kind == FileKind.AUDIO
        val seek = if (event.repeatCount > 30) 60_000L else if (event.repeatCount > 8) 30_000L else 10_000L
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_MEDIA_REWIND -> if (media) seekBy(-seek) else step(-1)
            KeyEvent.KEYCODE_DPAD_RIGHT, KeyEvent.KEYCODE_MEDIA_FAST_FORWARD -> if (media) seekBy(seek) else step(1)
            KeyEvent.KEYCODE_DPAD_UP, KeyEvent.KEYCODE_MEDIA_PREVIOUS, KeyEvent.KEYCODE_PAGE_UP -> step(-1)
            KeyEvent.KEYCODE_DPAD_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, KeyEvent.KEYCODE_PAGE_DOWN -> step(1)
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE, KeyEvent.KEYCODE_SPACE -> {
                if (media) togglePlay() else if (kind == FileKind.IMAGE) toggleSlideshow() else setHud(true)
            }
            KeyEvent.KEYCODE_MEDIA_PLAY -> if (media && !video.isPlaying) togglePlay()
            KeyEvent.KEYCODE_MEDIA_PAUSE -> if (media && video.isPlaying) togglePlay()
            else -> return super.onKeyDown(keyCode, event)
        }
        setHud(true)
        return true
    }

    private fun toggleSlideshow() {
        slideshow = !slideshow
        scheduleSlide()
        notice(getString(if (slideshow) R.string.player_slideshow_on else R.string.player_slideshow_off))
    }

    private fun setHud(show: Boolean) {
        main.removeCallbacks(hideHud)
        if (show) {
            if (hud.visibility != View.VISIBLE) {
                hud.visibility = View.VISIBLE
                if (Motion.full) {
                    hud.translationY = hudHeight().toFloat()
                    hud.animate().translationY(0f).setDuration(Motion.BASE).setInterpolator(Motion.out).start()
                }
            }
            subtitle.translationY = -hudHeight().toFloat()
            val media = kind == FileKind.VIDEO || kind == FileKind.AUDIO
            if (PlayerRules.hudAutoHides(media, video.isPlaying)) main.postDelayed(hideHud, HUD_MS)
        } else {
            hud.visibility = View.INVISIBLE
            subtitle.translationY = 0f
        }
    }

    // --- Ciclo de vida ---

    private fun saveProgress() {
        if (kind == FileKind.VIDEO && prepared) {
            resume.update(current.absolutePath, video.currentPosition.toLong(), video.duration.toLong())
        }
    }

    override fun onResume() {
        super.onResume()
        // Se volvió de otro reproductor o de la Tienda: acá ya no queda nada para ver.
        if (failed && !hasOverlay) {
            closeScreen()
            return
        }
        main.post(tick)
    }

    override fun onPause() {
        super.onPause()
        main.removeCallbacks(tick)
        if (prepared) {
            saveProgress()
            resumeAt = video.currentPosition.toLong()
            wasPlaying = video.isPlaying
            video.pause()
        }
    }

    override fun onDestroy() {
        decoder.shutdownNow()
        main.removeCallbacksAndMessages(null)
        runCatching { pdf?.close() }
        runCatching { pdfFd?.close() }
        super.onDestroy()
    }

    companion object {
        const val EXTRA_PATH = "path"
        const val EXTRA_KIND = "kind"
        private const val TICK_MS = 200L
        private const val HUD_MS = 3500L
        private const val SEEK_DELAY_MS = 280L
        private const val SLIDE_MS = 6000L
        private const val MAX_PLAYERS = 3
        private const val STATE_INDEX = "index"
        private const val STATE_PAGE = "page"
        private const val STATE_SLIDES = "slides"
    }
}
