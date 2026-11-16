package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.carrera.Carrera
import ar.vale.projectorlauncher.carrera.CarreraActivity
import ar.vale.projectorlauncher.remote.HttpResponse
import ar.vale.projectorlauncher.remote.Pairing
import ar.vale.projectorlauncher.remote.RemoteServer
import ar.vale.projectorlauncher.remote.Router
import java.io.File

/**
 * El servidor del launcher corriendo en una computadora, para probar la carrera entera en un
 * navegador sin un proyector: el mismo WebSocket y la misma sala, con los archivos de `game/dist`.
 * Uso: `CarreraDevServer <carpeta dist> [dirección para el QR]`.
 */
fun main(args: Array<String>) {
    val dist = File(args.getOrElse(0) { "game/dist" }).canonicalFile
    val types = mapOf("html" to "text/html; charset=utf-8", "js" to "text/javascript", "css" to "text/css", "svg" to "image/svg+xml", "ttf" to "font/ttf", "glb" to "model/gltf-binary", "wav" to "audio/wav")
    val carrera = Carrera()
    val router = Router(Pairing("t".repeat(48), {}), FakeDevice(), race = carrera::serve) { path ->
        val file = File(dist, path.removePrefix("/carrera/")).canonicalFile
        if (!path.startsWith("/carrera/") || !file.startsWith(dist) || !file.isFile) null
        else HttpResponse(200, types[file.extension] ?: "application/octet-stream", bytes = file.readBytes(), policy = HttpResponse.GAME_POLICY)
    }
    val port = RemoteServer(router).start()
    val room = carrera.open()
    val join = "http://${args.getOrElse(1) { "127.0.0.1" }}:$port/carrera/volante.html#r=${room.code}"
    println("PARED http://127.0.0.1:$port/carrera/index.html#s=${room.hostSecret}&tls=0&qr=${CarreraActivity.qr(join)}")
    println("VOLANTE $join")
    Thread.currentThread().join()
}
