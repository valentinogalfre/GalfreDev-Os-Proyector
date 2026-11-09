package ar.vale.projectorlauncher.store

import org.json.JSONObject
import java.net.URI

/** La última versión publicada: de dónde bajarla y cómo comprobar que llegó entera. */
data class Release(val version: String?, val url: String, val sha256: String?, val size: Long?)

class ResolveException(message: String) : Exception(message)

/** Red mínima que necesita el resolutor, para poder probarlo sin internet. */
fun interface Fetch {
    fun text(url: String): String
}

/**
 * Averigua la última versión de una app para este equipo.
 * El catálogo guarda cómo encontrarla y no qué versión es: así no envejece.
 */
object Resolver {

    private const val GITHUB_API = "https://api.github.com/repos/"
    private const val SHA256_PREFIX = "sha256:"

    fun resolve(app: CatalogApp, abis: List<String>, fetch: Fetch): Release = when (val s = app.source) {
        is Source.Fixed -> Release(null, s.url, null, null)
        is Source.GitHub -> fromGitHub(fetch.text("$GITHUB_API${s.repo}/releases/latest"), s, abis)
        is Source.Listing -> {
            val url = Abi.pick(abis, s.urls, s.url) ?: s.url
            val found = fromListing(fetch.text(url), url, s, abis)
            val digest = s.sha256Suffix?.let { suffix ->
                // Si la fuente publica el hash y no se pudo leer, no se sigue sin comprobar.
                runCatching { firstHash(fetch.text(found.url + suffix)) }.getOrNull()
                    ?: throw ResolveException("no se pudo leer el hash de ${found.url}")
            }
            found.copy(sha256 = digest)
        }
    }

    internal fun fromGitHub(json: String, source: Source.GitHub, abis: List<String>): Release {
        val root = JSONObject(json)
        val tag = root.getString("tag_name")
        val version = tag.removePrefix("v").removePrefix("V")
        val pattern = Abi.pick(abis, source.assets, source.universal)
            ?: throw ResolveException("no hay versión para ${abis.firstOrNull()}")
        val regex = Regex(pattern.replace("{version}", Regex.escape(version)))
        val assets = root.getJSONArray("assets")
        val hits = (0 until assets.length()).map { assets.getJSONObject(it) }.filter { regex.containsMatchIn(it.getString("name")) }
        if (hits.size != 1) throw ResolveException("se esperaba un archivo y hay ${hits.size}")
        val asset = hits.single()
        return Release(
            version = version,
            url = asset.getString("browser_download_url"),
            // Sin digest, en Android optString devuelve la palabra "null": se pide el prefijo.
            sha256 = asset.optString("digest").takeIf { it.startsWith(SHA256_PREFIX) }?.removePrefix(SHA256_PREFIX)?.ifEmpty { null },
            size = asset.optLong("size").takeIf { it > 0 }
        )
    }

    internal fun fromListing(html: String, baseUrl: String, source: Source.Listing, abis: List<String>): Release {
        val pattern = Abi.pick(abis, source.assets, source.universal)
            ?: throw ResolveException("no hay versión para ${abis.firstOrNull()}")
        val hits = Regex(pattern).findAll(html).associate { it.groupValues[1] to it.value }
        val version = hits.keys.maxWithOrNull { a, b -> Versions.compare(a, b) }
            ?: throw ResolveException("no encontramos el archivo en la página")
        val found = hits.getValue(version)
        val url = if (source.absolute) found else URI(baseUrl).resolve(found).toString()
        return Release(version, url, null, null)
    }

    /** Los `.sha256` publicados traen el hash solo o seguido del nombre del archivo. */
    private fun firstHash(text: String): String? =
        Regex("""\b[0-9a-fA-F]{64}\b""").find(text)?.value?.lowercase()
}
