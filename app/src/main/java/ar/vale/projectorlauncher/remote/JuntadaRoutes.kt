package ar.vale.projectorlauncher.remote

import ar.vale.projectorlauncher.juntada.Juntada
import ar.vale.projectorlauncher.juntada.JuntadaError
import ar.vale.projectorlauncher.juntada.TriviaSource
import org.json.JSONObject

/**
 * Las rutas de la juntada. Entran el dueño, con su token, y los invitados que el dueño dejó
 * pasar ([Access]). Armar la trivia, frenarla y empezar de cero son solo del dueño.
 */
class JuntadaRoutes(private val juntada: Juntada, private val source: TriviaSource) {

    fun handle(path: String, body: JSONObject, owner: Boolean): HttpResponse = try {
        act(path, body, owner)
    } catch (e: JuntadaError) {
        HttpResponse.error(if (e.code == "join") 403 else 409, e.code)
    }

    private fun act(path: String, body: JSONObject, owner: Boolean): HttpResponse {
        val key = body.optString("key").ifEmpty { null }
        when (path) {
            "state" -> Unit
            "join" -> {
                val person = juntada.join(body.getString("name"))
                return HttpResponse.ok(JSONObject().put("key", person.key).put("id", person.id).put("name", person.name))
            }
            "answer" -> juntada.answer(key, body.getInt("question"), body.getInt("option"))
            "poll" -> juntada.createPoll(key, owner, body.getString("question"), strings(body, "options"))
            "vote" -> juntada.vote(key, body.getInt("option"))
            "poll/close" -> juntada.closePoll(key, owner)
            "expense" -> juntada.addExpense(key, body.getString("payer"), body.getLong("amount"), body.getString("what"), strings(body, "among"))
            "expense/delete" -> juntada.deleteExpense(key, owner, body.getInt("id"))
            "trivia/start" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.startTrivia(body.getString("topic"), body.optInt("count", DEFAULT_QUESTIONS), source)
            }
            "trivia/stop" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.stopTrivia()
            }
            "reset" -> {
                if (!owner) return HttpResponse.error(403, "owner")
                juntada.reset()
            }
            else -> return HttpResponse.error(404, "not_found")
        }
        // Cada acción devuelve el estado nuevo: el celular no espera a la próxima consulta.
        return HttpResponse.ok(juntada.state(key, owner))
    }

    private fun strings(body: JSONObject, name: String): List<String> {
        val array = body.getJSONArray(name)
        if (array.length() > MAX_LIST) throw HttpError(400, "list")
        return (0 until array.length()).map { array.getString(it) }
    }

    companion object {
        const val PREFIX = "/api/juntada/"
        const val DEFAULT_QUESTIONS = 8
        private const val MAX_LIST = 64
    }
}
