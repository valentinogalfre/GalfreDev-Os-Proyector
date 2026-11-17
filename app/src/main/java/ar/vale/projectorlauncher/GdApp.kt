package ar.vale.projectorlauncher

import android.app.Application

class GdApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Zone.install(this)
    }
}
