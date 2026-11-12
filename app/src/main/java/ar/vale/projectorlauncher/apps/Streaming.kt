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
     * [play] es la app de celular, o la única que tiene el servicio. [tv] se prefiere a [play].
     * [old] es un paquete anterior: se abre solo si no hay otro. [also] son los paquetes del mismo
     * servicio para otra región: se abren si ya están, y nunca se buscan. [hosts] son los sitios
     * del servicio: un enlace de ahí se abre directo en su app.
     *
     * [free] dice que se puede ver sin pagar, con publicidad. [tvCertified] dice que la versión de
     * TV solo anda en equipos certificados por el servicio: en un proyector se busca la de celular.
     */
    class Service(
        val name: String,
        val play: String,
        vararg val tv: String,
        val old: String? = null,
        val also: List<String> = emptyList(),
        val hosts: List<String> = emptyList(),
        val free: Boolean = false,
        val tvCertified: Boolean = false
    ) {
        /** Todos los paquetes del servicio, en el orden en que conviene abrirlos. */
        val packages: List<String> get() = tv.asList() + play + listOfNotNull(old) + also
    }

    /** Una versión de un servicio que se puede buscar en la tienda. */
    class Variant(val pkg: String, val form: Form)

    /** Para qué está hecha una versión: de eso depende con qué se maneja. */
    enum class Form { TV, PHONE, ONLY }

    val ALL = listOf(
        Service("Netflix", "com.netflix.mediaclient", "com.netflix.ninja", hosts = listOf("netflix.com"), tvCertified = true),
        Service("YouTube", "com.google.android.youtube", "com.google.android.youtube.tv", hosts = listOf("youtube.com", "youtu.be"), free = true),
        Service("Prime Video", "com.amazon.avod.thirdpartyclient", "com.amazon.amazonvideo.livingroom", hosts = listOf("primevideo.com")),
        Service("Disney+", "com.disney.disneyplus", hosts = listOf("disneyplus.com")),
        Service("HBO Max", "com.wbd.stream", old = "com.hbo.hbonow", hosts = listOf("max.com", "hbomax.com")),
        // Fuera de Estados Unidos, Paramount+ es un solo paquete para celular y para TV. Los otros
        // dos son los de allá: los traen algunos equipos de fábrica, y acá la tienda no los entrega.
        Service("Paramount+", "com.cbs.ca", also = listOf("com.cbs.ott", "com.cbs.app"), hosts = listOf("paramountplus.com")),
        Service("Pluto TV", "tv.pluto.android", hosts = listOf("pluto.tv"), free = true),
        // Solo existe para TV: en el celular vive adentro de la app de Mercado Libre.
        Service("Mercado Play", "com.mercadolibre.android.mplay_tv", free = true),
        Service("ViX", "com.univision.prendetv", hosts = listOf("vix.com"), free = true),
        Service("Plex", "com.plexapp.android", free = true),
        Service("Canela.TV", "com.canela.ott", "com.canela.ott.tv", free = true),
        Service("Spotify", "com.spotify.music", "com.spotify.tv.android", hosts = listOf("spotify.com"))
    )

    /** El servicio dueño de un sitio. Vale el dominio y sus subdominios, nunca uno que solo lo contenga. */
    fun byHost(host: String?): Service? {
        val name = host?.lowercase()?.trimEnd('.') ?: return null
        return ALL.firstOrNull { service -> service.hosts.any { name == it || name.endsWith(".$it") } }
    }

    /**
     * El paquete que se abre, o null si no está. Si hay más de una versión instalada, la que se
     * eligió en este equipo ([chosen]); sin elección, primero la de TV.
     */
    fun installed(service: Service, chosen: String? = null, isInstalled: (String) -> Boolean): String? =
        chosen?.takeIf { it in service.packages && isInstalled(it) } ?: service.packages.firstOrNull(isInstalled)

    /** El servicio de un paquete, en cualquiera de sus versiones. */
    fun byPackage(pkg: String): Service? = ALL.firstOrNull { pkg in it.packages }

    /**
     * Qué versiones buscar en la tienda, la que más conviene primero. En un equipo de TV, la de
     * TV: se maneja con el control, y la de celular pide pantalla táctil, así que la tienda la da
     * por incompatible. Igual se ofrece, segunda: cuando la de TV no anda, es la alternativa.
     *
     * La de TV no se ofrece si solo anda en equipos certificados: instalada y sin andar, taparía
     * a la de celular que sí anda. En un equipo táctil se busca la de celular y ninguna otra.
     */
    fun fetchable(service: Service, tvDevice: Boolean): List<Variant> {
        val tv = service.tv.firstOrNull() ?: return listOf(Variant(service.play, Form.ONLY))
        val phone = Variant(service.play, Form.PHONE)
        if (!tvDevice || service.tvCertified) return listOf(phone)
        return listOf(Variant(tv, Form.TV), phone)
    }

    /** Una salida para quien quiere un servicio: abrirlo, o buscar una de sus versiones. */
    class Choice(val action: Action, val pkg: String)

    enum class Action { OPEN, USE_TV, USE_PHONE, USE, UPDATE, GET_TV, GET_PHONE, GET }

    /**
     * Lo que se ofrece con un servicio: abrir el que está, pasar a otra versión que también está
     * instalada, y buscar en la tienda cada versión que le sirve a este equipo. Buscar la que ya
     * está es actualizarla: una app de fábrica que pide actualizarse y no deja es el motivo más
     * común de que un servicio no abra.
     *
     * Una versión instalada que no es la que se abre se ofrece para usarla, no para bajarla: si
     * no, quien bajó la de celular porque la de TV no anda seguiría abriendo la de TV.
     */
    fun choices(service: Service, tvDevice: Boolean, chosen: String? = null, isInstalled: (String) -> Boolean): List<Choice> {
        val current = installed(service, chosen, isInstalled)
        val others = service.packages.filter { it != current && isInstalled(it) }.map { pkg ->
            val action = when {
                pkg in service.tv -> Action.USE_TV
                pkg == service.play && service.tv.isNotEmpty() -> Action.USE_PHONE
                else -> Action.USE
            }
            Choice(action, pkg)
        }
        val fetch = fetchable(service, tvDevice).filter { it.pkg == current || !isInstalled(it.pkg) }.map { variant ->
            val action = when {
                variant.pkg == current -> Action.UPDATE
                variant.form == Form.TV -> Action.GET_TV
                variant.form == Form.PHONE -> Action.GET_PHONE
                else -> Action.GET
            }
            Choice(action, variant.pkg)
        }
        return listOfNotNull(current?.let { Choice(Action.OPEN, it) }) + others + fetch
    }

    /**
     * Cómo queda la sección de Cine: a la vista, lo instalado que no se escondió; el resto, lo que
     * falta y lo escondido, detrás de «Más servicios». Así la lista muestra lo que anda.
     */
    fun split(hidden: Set<String>, isInstalled: (String) -> Boolean): Pair<List<Service>, List<Service>> =
        ALL.partition { it.name !in hidden && installed(it, isInstalled = isInstalled) != null }

    /**
     * Lo que ve el celular: cada servicio una vez, con el paquete que corresponde abrir. [chosen]
     * dice qué versión de cada servicio se eligió en este equipo.
     */
    fun forPhone(chosen: (String) -> String? = { null }, isInstalled: (String) -> Boolean): JSONArray {
        val out = JSONArray()
        ALL.forEach { service ->
            val pkg = installed(service, chosen(service.name), isInstalled)
            out.put(
                JSONObject()
                    .put("name", service.name)
                    .put("package", pkg ?: service.play)
                    .put("installed", pkg != null)
                    .put("free", service.free)
            )
        }
        return out
    }
}
