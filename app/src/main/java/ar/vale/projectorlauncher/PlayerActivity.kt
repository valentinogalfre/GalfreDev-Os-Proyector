package ar.vale.projectorlauncher

import android.app.Activity
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.ImageView
import android.widget.MediaController
import android.widget.TextView
import android.widget.Toast
import android.widget.VideoView
import java.io.File

/** Reproductor de video/música/imagen. VideoView del framework (sin AndroidX). */
class PlayerActivity : Activity() {

    private var videoView: VideoView? = null
    private var mediaController: MediaController? = null

    /** Posición y estado al pausar: si se pierde el Surface (standby/onStop), VideoView re-prepara desde cero. */
    private var lastPos = 0
    private var resumePlaying = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)
        val path = intent.getStringExtra(EXTRA_PATH)
        if (path == null) { finish(); return }
        val file = File(path)
        val vv = findViewById<VideoView>(R.id.video)
        val img = findViewById<ImageView>(R.id.image)
        val title = findViewById<TextView>(R.id.audio_title)

        when (intent.getStringExtra(EXTRA_KIND)) {
            FileKind.IMAGE.name -> showImage(file, img)
            FileKind.AUDIO.name -> {
                title.visibility = View.VISIBLE
                title.text = file.name
                playVideo(vv, file)
            }
            else -> playVideo(vv, file)
        }
    }

    private fun playVideo(vv: VideoView, file: File) {
        videoView = vv
        vv.visibility = View.VISIBLE
        val mc = MediaController(this)
        mediaController = mc
        mc.setAnchorView(vv)
        vv.setMediaController(mc)
        vv.setOnPreparedListener { mp ->
            if (lastPos > 0) mp.seekTo(lastPos)
            if (resumePlaying) mp.start()
        }
        vv.setOnErrorListener { _, _, _ -> finishWithError(); true }
        vv.setVideoPath(file.absolutePath)
        vv.requestFocus()
    }

    private fun showImage(file: File, img: ImageView) {
        img.visibility = View.VISIBLE
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(file.absolutePath, bounds)
        val dm = resources.displayMetrics
        val opts = BitmapFactory.Options().apply {
            inSampleSize = sampleSize(bounds.outWidth, bounds.outHeight, dm.widthPixels, dm.heightPixels)
        }
        val bmp = BitmapFactory.decodeFile(file.absolutePath, opts)
        if (bmp == null) { finishWithError(); return }
        img.setImageBitmap(bmp)
    }

    private fun sampleSize(w: Int, h: Int, reqW: Int, reqH: Int): Int {
        if (reqW <= 0 || reqH <= 0 || w <= 0 || h <= 0) return 1
        var sample = 1
        while (w / sample > reqW * 2 || h / sample > reqH * 2) sample *= 2
        return sample
    }

    private fun finishWithError() {
        Toast.makeText(this, getString(R.string.player_error), Toast.LENGTH_SHORT).show()
        finish()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_DPAD_CENTER || keyCode == KeyEvent.KEYCODE_ENTER) {
            val vv = videoView
            if (vv != null) {
                if (vv.isPlaying) vv.pause() else vv.start()
                mediaController?.show()   // recalcula el ícono play/pausa y reinicia su timeout
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onPause() {
        super.onPause()
        val vv = videoView ?: return
        lastPos = vv.currentPosition
        resumePlaying = vv.isPlaying
        vv.pause()
    }

    companion object {
        const val EXTRA_PATH = "path"
        const val EXTRA_KIND = "kind"
    }
}
