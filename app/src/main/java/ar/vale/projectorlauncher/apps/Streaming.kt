package ar.vale.projectorlauncher.apps

import org.json.JSONArray
import org.json.JSONObject

/**
 * Los servicios de video y música. Algunos equipos los traen de fábrica, como el Chowa P8 y el
 * Fika P8. Los que faltan no se bajan de ninguna fuente rara: son las apps oficiales de Google
 * Play, sin tocar, y las trae Aurora Store.
 *
 * La de TV se maneja con el control. La de celular, con el trackpad del celular. Ninguna esquiva
 * nada: si el servicio decide no andar en un equipo sin certificar, no anda.
 */
object Streaming {

    /**
     * [tv] se prefiere a [play]. [old] es un paquete anterior del servicio: se abre solo si no hay
     * otro. [hosts] son los sitios del servicio: un enlace de ahí se abre directo en su app.
     */
    class Service(
        val name: String,
        val play: String,
        vararg val tv: String,
        val old: String? = null,
        val hosts: List<String> = emptyList()
    )

    val ALL = listOf(
        Service("Netflix", "com.netflix.mediaclient", "com.netflix.ninja", hosts = listOf("netflix.com")),
        Service("YouTube", "com.google.android.youtube", "com.google.android.youtube.tv", hosts = listOf("youtube.com", "youtu.be")),
        Service("Prime Video", "com.amazon.avod.thirdpartyclient", "com.amazon.amazonvideo.livingroom", hosts = listOf("primevideo.com")),
        Service("Disney+", "com.disney.disneyplus", hosts = listOf("disneyplus.com")),
        Service("HBO Max", "com.wbd.stream", old = "com.hbo.hbonow", hosts = listOf("max.com", "hbomax.com")),
        Service("Paramount+", "com.cbs.app", "com.cbs.ott", "com.cbs.ca", hosts = listOf("paramountplus.com")),
        Service("Pluto TV", "tv.pluto.android", hosts = listOf("pluto.tv")),
        Service("ViX", "com.univision.prendetv", hosts = listOf("vix.com")),
        Service("Spotify", "com.spotify.music", "com.spotify.tv.android", hosts = listOf("spotify.com"))
    )

    /** El servicio dueño de un sitio. Vale el dominio y sus subdominios, nunca uno que solo lo contenga. */
    fun byHost(host: String?): Service? {
        val name = host?.lowercase()?.trimEnd('.') ?: return null
        return ALL.firstOrNull { service -> service.hosts.any { name == it || name.endsWith(".$it") } }
    }

    /** El paquete que se abre, o null si no está. Primero la versión de TV. */
    fun installed(service: Service, isInstalled: (String) -> Boolean): String? =
        (service.tv.asList() + service.play + listOfNotNull(service.old)).firstOrNull(isInstalled)

    /** El servicio de un paquete, en cualquiera de sus versiones. */
    fun byPackage(pkg: String): Service? = ALL.firstOrNull { it.play == pkg || pkg in it.tv || it.old == pkg }

    /** Lo que ve el celular: cada servicio una vez, con el paquete que corresponde abrir. */
    fun forPhone(isInstalled: (String) -> Boolean): JSONArray {
        val out = JSONArray()
        ALL.forEach { service ->
            val pkg = installed(service, isInstalled)
            out.put(
                JSONObject()
                    .put("name", service.name)
                    .put("package", pkg ?: service.play)
                    .put("installed", pkg != null)
            )
        }
        return out
    }
}
