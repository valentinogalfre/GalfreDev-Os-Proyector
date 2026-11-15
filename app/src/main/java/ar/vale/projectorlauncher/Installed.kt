package ar.vale.projectorlauncher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import ar.vale.projectorlauncher.device.Casting
import ar.vale.projectorlauncher.device.Functions

/**
 * Lo que se le pregunta al sistema sobre las apps instaladas, una sola vez hasta que cambie algo.
 *
 * Cada consulta es un viaje al sistema, y el inicio, Cine y la Tienda hacían decenas en el hilo de
 * la pantalla cada vez que se movía el control. En un equipo de 1 GB eso se siente como una traba.
 * Acá quedan en memoria, y se tiran cuando se instala, se actualiza o se saca una app.
 */
object Installed {

    @Volatile private var launchable: Set<String>? = null
    @Volatile private var packages: Set<String>? = null
    @Volatile private var functions: List<Functions.Found>? = null
    @Volatile private var apps: List<AppInfo>? = null
    @Volatile private var receivers: List<Casting.Receiver>? = null
    @Volatile private var watching = false

    /** Cambia cada vez que cambia lo instalado: quien guardó una lista sabe si quedó vieja. */
    @Volatile var version = 0
        private set

    /** Paquetes que se pueden abrir, por el lanzador común o por el de TV. */
    fun launchable(context: Context): Set<String> {
        watch(context)
        return launchable ?: AppRepository.launchablePackages(context).also { launchable = it }
    }

    /** Todo lo instalado, en un solo viaje en vez de uno por paquete. */
    fun packages(context: Context): Set<String> {
        watch(context)
        return packages ?: runCatching {
            context.packageManager.getInstalledPackages(0).map { it.packageName }.toSet()
        }.getOrDefault(emptySet()).also { packages = it }
    }

    fun functions(context: Context): List<Functions.Found> {
        watch(context)
        return functions ?: Functions.detect(context.applicationContext).also { functions = it }
    }

    /** Las apps que reciben la pantalla de un celular. Leer el nombre de cada app instalada tarda. */
    fun receivers(context: Context): List<Casting.Receiver> {
        watch(context)
        return receivers ?: Casting.detect(context.applicationContext).also { receivers = it }
    }

    /** La lista con íconos que ya cargó alguien, si sigue vigente. Cargarla tarda: va en otro hilo. */
    fun apps(): List<AppInfo>? = apps

    fun loadApps(context: Context): List<AppInfo> {
        watch(context)
        val before = version
        val list = AppRepository.loadApps(context)
        if (before == version) apps = list
        return list
    }

    /** Deja todo listo en segundo plano, para que la primera pantalla que lo pida no espere. */
    fun warm(context: Context) {
        val app = context.applicationContext
        Thread({
            launchable(app)
            packages(app)
            functions(app)
            receivers(app)
        }, "gd-installed").start()
    }

    fun invalidate() {
        version++
        launchable = null
        packages = null
        functions = null
        apps = null
        receivers = null
    }

    /** Vive lo que vive el proceso: una app se puede instalar con otra pantalla delante. */
    private fun watch(context: Context) {
        if (watching) return
        synchronized(this) {
            if (watching) return
            val filter = IntentFilter().apply {
                addAction(Intent.ACTION_PACKAGE_ADDED)
                addAction(Intent.ACTION_PACKAGE_REMOVED)
                addAction(Intent.ACTION_PACKAGE_REPLACED)
                addAction(Intent.ACTION_PACKAGE_CHANGED)
                addDataScheme("package")
            }
            val receiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) = invalidate()
            }
            runCatching { context.applicationContext.registerReceiver(receiver, filter) }
            watching = true
        }
    }
}
