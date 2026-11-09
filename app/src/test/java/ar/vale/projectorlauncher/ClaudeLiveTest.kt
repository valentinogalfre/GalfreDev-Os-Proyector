package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.ErrorDetail
import ar.vale.projectorlauncher.claude.HttpTransport
import ar.vale.projectorlauncher.claude.Models
import ar.vale.projectorlauncher.claude.Prompt
import ar.vale.projectorlauncher.claude.Session
import ar.vale.projectorlauncher.claude.ToolOutcome
import org.junit.Assert.assertEquals
import org.junit.Assume.assumeTrue
import org.junit.Test
import java.io.File

/**
 * Contrato: el pedido que arma la app lo acepta la API real, con cada modelo que se puede elegir.
 *
 * Los demás tests usan un servidor falso, que acepta cualquier cuerpo: este es el único que
 * comprueba la forma del pedido contra Anthropic. Cuesta centavos y por eso no corre solo.
 * Para correrlo: `GD_LIVE_KEY_FILE=/ruta/a/la/clave ./gradlew testDebugUnitTest --tests '*ClaudeLiveTest*'`.
 */
class ClaudeLiveTest {

    private val key: String? = System.getenv("GD_LIVE_KEY_FILE")
        ?.let(::File)?.takeIf { it.isFile }?.readText()?.trim()?.takeIf { it.isNotEmpty() }

    private fun ask(model: Models.Model, question: String, webSearch: Boolean = false): Pair<Session.End, String> {
        val answer = StringBuilder()
        var result: Pair<Session.End, Throwable?>? = null
        val session = Session(
            HttpTransport(key!!), model, webSearch, Prompt.SYSTEM,
            { name, _ -> ToolOutcome("La herramienta $name no está disponible en esta prueba.", isError = true) },
            object : Session.Listener {
                override fun onText(text: String) { answer.append(text) }
                override fun onEnd(end: Session.End, error: Throwable?) { result = end to error }
            }
        )
        session.ask(question)
        val (end, error) = result!!
        val detail = ErrorDetail.of(error)
        println("[${model.id}] $end ${detail.orEmpty()} -> ${answer.toString().take(200)}")
        return end to (detail ?: answer.toString())
    }

    @Test
    fun everyModelAnswersAPlainQuestion() {
        assumeTrue("sin GD_LIVE_KEY_FILE", key != null)
        val failures = Models.ALL.mapNotNull { model ->
            val (end, text) = ask(model, "¿Cuánto es 2 más 2? Respondé solo el número.")
            "${model.id}: $end $text".takeIf { end != Session.End.DONE }
        }
        assertEquals(emptyList<String>(), failures)
    }

    @Test
    fun defaultModelAnswersWithWebSearch() {
        assumeTrue("sin GD_LIVE_KEY_FILE", key != null)
        val (end, text) = ask(Models.of(Prefs.DEFAULT_CLAUDE_MODEL), "¿Qué día es hoy en Argentina?", webSearch = true)
        assertEquals(text, Session.End.DONE, end)
    }
}
