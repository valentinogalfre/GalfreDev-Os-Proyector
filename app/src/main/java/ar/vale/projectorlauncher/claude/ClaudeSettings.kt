package ar.vale.projectorlauncher.claude

import android.content.Context
import ar.vale.projectorlauncher.Prefs
import ar.vale.projectorlauncher.R
import ar.vale.projectorlauncher.ui.GdActivity
import ar.vale.projectorlauncher.ui.Keyboard
import ar.vale.projectorlauncher.ui.Notice
import ar.vale.projectorlauncher.ui.Sheet
import org.json.JSONException
import java.io.IOException

/** Clave y modelo. Se abre desde Ajustes y desde la pantalla de Claude. */
object ClaudeSettings {

    fun modelLabel(context: Context): String = Models.of(Prefs(context).claudeModel).label

    fun show(activity: GdActivity, changed: () -> Unit) {
        val has = KeyVault.has(activity)
        val prefs = activity.prefs
        val options = ArrayList<Sheet.Option>()
        options.add(Sheet.Option(activity.getString(if (has) R.string.claude_key_change else R.string.claude_key_load), R.drawable.ic_key) {
            enterKey(activity, changed)
        })
        options.add(Sheet.Option(activity.getString(R.string.claude_model, modelLabel(activity)), R.drawable.ic_ai) {
            pickModel(activity, changed)
        })
        val search = activity.getString(if (prefs.claudeWebSearch) R.string.value_on else R.string.value_off)
        options.add(Sheet.Option(activity.getString(R.string.claude_search, search), R.drawable.ic_globe) {
            prefs.claudeWebSearch = !prefs.claudeWebSearch
            changed()
            show(activity, changed)
        })
        val hands = activity.getString(if (prefs.claudeHands) R.string.value_on else R.string.value_off)
        options.add(Sheet.Option(activity.getString(R.string.claude_hands, hands), R.drawable.ic_apps) {
            prefs.claudeHands = !prefs.claudeHands
            changed()
            show(activity, changed)
        })
        if (has) {
            options.add(Sheet.Option(activity.getString(R.string.claude_key_delete), R.drawable.ic_trash) {
                Sheet.confirm(activity, activity.getString(R.string.claude_key_delete), null, activity.getString(R.string.delete)) {
                    KeyVault.clear(activity)
                    ClaudeRuntime.reset()
                    changed()
                }
            })
        }
        val body = activity.getString(if (has) R.string.claude_key_ready else R.string.claude_key_help)
        Sheet.show(activity, activity.getString(R.string.word_claude), options, body)
    }

    fun enterKey(activity: GdActivity, changed: () -> Unit) {
        Keyboard.show(activity, activity.getString(R.string.claude_key_title), secret = true) { text ->
            val key = KeyVault.clean(text)
            when {
                text.isBlank() -> Unit
                key == null -> Notice.show(activity, activity.getString(R.string.claude_key_invalid), Notice.Kind.ERROR)
                KeyVault.save(activity, key) -> Notice.show(activity, activity.getString(R.string.claude_key_saved), Notice.Kind.OK)
                else -> Notice.show(activity, activity.getString(R.string.claude_key_memory), Notice.Kind.WARN)
            }
            changed()
        }
    }

    private fun pickModel(activity: GdActivity, changed: () -> Unit) {
        val prefs = activity.prefs
        val options = Models.ALL.map { model ->
            Sheet.Option(model.label, if (model.id == prefs.claudeModel) R.drawable.ic_check else null) {
                prefs.claudeModel = model.id
                changed()
            }
        }
        Sheet.show(activity, activity.getString(R.string.claude_model_title), options, activity.getString(R.string.claude_model_body))
    }

    /** Qué está haciendo, dicho para quien mira la pared. */
    fun activityLabel(context: Context, tool: String?): String = context.getString(
        when (tool) {
            null -> R.string.claude_thinking
            "web_search" -> R.string.claude_searching
            "ver_pantalla", "esperar" -> R.string.claude_looking
            "tocar" -> R.string.claude_tapping
            "escribir" -> R.string.claude_typing
            "tecla", "deslizar" -> R.string.claude_moving
            "abrir_app", "abrir_enlace" -> R.string.claude_opening
            else -> R.string.claude_acting
        }
    )

    /**
     * El estado en una línea, para el renglón sobre otra app y para el celular: lo que hace
     * mientras trabaja, y la respuesta o el error cuando termina. Null si no hay nada que decir.
     */
    fun status(context: Context, state: ClaudeRuntime.Snapshot): String? = when {
        state.busy -> activityLabel(context, state.activity)
        state.end == Session.End.DONE -> Markup.parse(state.answer).plain.trim().ifEmpty { null }
        state.end == Session.End.REFUSED -> context.getString(R.string.claude_refused)
        state.end == Session.End.TOO_LONG -> context.getString(R.string.claude_too_long)
        state.end == Session.End.FAILED -> message(context, state.error)
        state.end == Session.End.TRUNCATED -> Markup.parse(state.answer).plain.trim() + "…"
        else -> null
    }

    /** Traduce los errores a algo que se pueda hacer. */
    fun message(context: Context, error: Throwable?): String {
        val text = when {
            error is ApiError && error.status == 401 -> R.string.claude_err_key
            error is ApiError && error.noCredit -> R.string.claude_err_billing
            error is ApiError && error.status == 403 -> R.string.claude_err_forbidden
            error is ApiError && error.status == 404 -> R.string.claude_err_model
            error is ApiError && error.status == 429 -> R.string.claude_err_rate
            error is ApiError && error.retriable -> R.string.claude_err_busy
            error is IOException || error is JSONException -> R.string.claude_err_network
            else -> R.string.claude_err_other
        }
        val unclear = text == R.string.claude_err_network || text == R.string.claude_err_other
        val detail = ErrorDetail.of(error).takeIf { unclear }
        return listOfNotNull(context.getString(text), detail).joinToString("\n")
    }
}
