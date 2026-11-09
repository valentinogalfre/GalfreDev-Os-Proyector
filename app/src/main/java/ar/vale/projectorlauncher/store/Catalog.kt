package ar.vale.projectorlauncher.store

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/** De dónde sale cada APK. Solo fuentes oficiales de cada proyecto. */
sealed interface Source {
    /** [assets] es el patrón del archivo por ABI; [universal], el que sirve para todos. */
    data class GitHub(val repo: String, val assets: Map<String, String>, val universal: String?) : Source

    /** Una página o carpeta donde se busca el archivo de la última versión. */
    data class Listing(
        val url: String,
        val urls: Map<String, String>,
        val assets: Map<String, String>,
        val universal: String?,
        val absolute: Boolean,
        val sha256Suffix: String?
    ) : Source

    data class Fixed(val url: String) : Source
}

data class CatalogApp(
    val id: String,
    val name: String,
    val packageName: String,
    val category: String,
    val tvFirst: Boolean,
    val license: String,
    val minSdk: Int,
    val summary: String,
    val details: String,
    val caveat: String?,
    val replaces: List<String>,
    val legacy: List<String>,
    val legacyReason: String?,
    val signers: Set<String>,
    val source: Source
)

data class NotOffered(val name: String, val packages: List<String>, val reason: String)

data class Category(val id: String, val name: String)

data class Catalog(
    val reviewed: String,
    val categories: List<Category>,
    val apps: List<CatalogApp>,
    val notOffered: List<NotOffered>
) {
    companion object {
        @Volatile private var loaded: Catalog? = null

        /** El catálogo viene adentro del APK y no cambia: se lee y se interpreta una sola vez. */
        fun load(context: Context): Catalog = loaded
            ?: parse(context.assets.open("catalog.json").bufferedReader().use { it.readText() }).also { loaded = it }

        fun parse(text: String): Catalog {
            val root = JSONObject(text)
            return Catalog(
                reviewed = root.getString("reviewed"),
                categories = root.getJSONArray("categories").objects().map {
                    Category(it.getString("id"), it.getString("name"))
                },
                apps = root.getJSONArray("apps").objects().map(::app),
                notOffered = root.getJSONArray("notOffered").objects().map {
                    NotOffered(it.getString("name"), it.getJSONArray("packages").strings(), it.getString("reason"))
                }
            )
        }

        private fun app(o: JSONObject) = CatalogApp(
            id = o.getString("id"),
            name = o.getString("name"),
            packageName = o.getString("package"),
            category = o.getString("category"),
            tvFirst = o.getString("tv") == "first",
            license = o.getString("license"),
            minSdk = o.getInt("minSdk"),
            summary = o.getString("summary"),
            details = o.getString("details"),
            caveat = o.optString("caveat").ifEmpty { null },
            replaces = o.optJSONArray("replaces")?.strings().orEmpty(),
            legacy = o.optJSONArray("legacy")?.strings().orEmpty(),
            legacyReason = o.optString("legacyReason").ifEmpty { null },
            signers = o.optJSONArray("signers")?.strings().orEmpty().map { it.lowercase() }.toSet(),
            source = source(o.getJSONObject("source"))
        )

        private fun source(o: JSONObject): Source = when (val type = o.getString("type")) {
            "github" -> Source.GitHub(o.getString("repo"), o.stringMap("assets"), o.optString("asset").ifEmpty { null })
            "listing" -> Source.Listing(
                url = o.getString("url"),
                urls = o.stringMap("urls"),
                assets = o.stringMap("assets"),
                universal = o.optString("asset").ifEmpty { null },
                absolute = o.optBoolean("absolute"),
                sha256Suffix = o.optString("sha256Suffix").ifEmpty { null }
            )
            "fixed" -> Source.Fixed(o.getString("url"))
            else -> throw IllegalArgumentException("fuente desconocida: $type")
        }

        private fun JSONArray.objects() = (0 until length()).map { getJSONObject(it) }
        private fun JSONArray.strings() = (0 until length()).map { getString(it) }

        private fun JSONObject.stringMap(key: String): Map<String, String> {
            val o = optJSONObject(key) ?: return emptyMap()
            return o.keys().asSequence().associateWith { o.getString(it) }
        }
    }
}

/** Qué conviene instalar según lo que ya hay en el equipo. */
object Recommendations {

    data class Upgrade(val app: CatalogApp, val instead: String)
    data class Legacy(val packageName: String, val app: CatalogApp)

    /** Apps de TV que reemplazan a una app de celular instalada. */
    fun upgrades(catalog: Catalog, installed: Set<String>): List<Upgrade> =
        catalog.apps.mapNotNull { app ->
            if (app.packageName in installed) return@mapNotNull null
            val instead = app.replaces.firstOrNull { it in installed } ?: return@mapNotNull null
            Upgrade(app, instead)
        }

    /** Paquetes viejos que hay que sacar por seguridad. */
    fun legacy(catalog: Catalog, installed: Set<String>): List<Legacy> =
        catalog.apps.flatMap { app -> app.legacy.filter { it in installed }.map { Legacy(it, app) } }
}

/** Elige la variante correcta para el procesador. Estos equipos corren en 32 bits aunque el chip sea de 64. */
object Abi {
    /** [supported] va en orden de preferencia, como lo da `Build.SUPPORTED_ABIS`. */
    fun <T> pick(supported: List<String>, byAbi: Map<String, T>, universal: T?): T? =
        supported.firstNotNullOfOrNull { byAbi[it] } ?: universal
}

/** Compara versiones por sus números: `v1.18.2`, `32.70s` y `0.19.10` valen igual. */
object Versions {

    private val NUMBERS = Regex("""\d+""")

    /** Solo la parte numérica inicial: `32.70s` da 32.70 y `v1.2-beta3` da 1.2. */
    private fun parts(version: String): List<Long> {
        val start = version.indexOfFirst { it.isDigit() }
        if (start < 0) return emptyList()
        val core = version.substring(start).takeWhile { it.isDigit() || it == '.' }
        return NUMBERS.findAll(core).map { it.value.toLongOrNull() ?: 0L }.toList()
    }

    fun compare(a: String, b: String): Int {
        val x = parts(a)
        val y = parts(b)
        for (i in 0 until maxOf(x.size, y.size)) {
            val c = (x.getOrElse(i) { 0L }).compareTo(y.getOrElse(i) { 0L })
            if (c != 0) return c
        }
        return 0
    }

    fun isNewer(candidate: String, installed: String): Boolean = compare(candidate, installed) > 0
}
