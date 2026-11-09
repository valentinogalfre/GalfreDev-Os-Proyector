#!/usr/bin/env python3
"""Imita la API de Claude para probar la pantalla sin gastar: mismas señales, respuestas guionadas.

Uso, con el emulador prendido y un APK de debug:
    python3 scripts/fake_claude.py
    adb reverse tcp:9000 tcp:9000
    adb shell "run-as ar.vale.projectorlauncher sh -c 'echo http://localhost:9000/v1/messages > files/claude_endpoint.txt'"

Elige qué responder según la última pregunta. Palabras clave: volumen, abrí, pared, rechazo, clave, saturado, largo,
trivia (arma una trivia) y contactos (maneja otra app paso a paso: abre, mira, toca, escribe, vuelve).
Un pedido con formato fijo recibe una trivia de prueba.
Deja cada pedido recibido en la salida, sin mostrar la clave.
"""
import json
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9000
CHUNK_DELAY = 0.05


def block_text(index, text):
    yield "content_block_start", {"type": "content_block_start", "index": index, "content_block": {"type": "text", "text": ""}}
    words = text.split(" ")
    for i, word in enumerate(words):
        piece = word if i == len(words) - 1 else word + " "
        yield "content_block_delta", {"type": "content_block_delta", "index": index, "delta": {"type": "text_delta", "text": piece}}
    yield "content_block_stop", {"type": "content_block_stop", "index": index}


def block_tool(index, tool_id, name, payload):
    yield "content_block_start", {"type": "content_block_start", "index": index,
                                  "content_block": {"type": "tool_use", "id": tool_id, "name": name, "input": {}}}
    raw = json.dumps(payload, ensure_ascii=False)
    half = len(raw) // 2
    for piece in (raw[:half], raw[half:]):
        yield "content_block_delta", {"type": "content_block_delta", "index": index,
                                      "delta": {"type": "input_json_delta", "partial_json": piece}}
    yield "content_block_stop", {"type": "content_block_stop", "index": index}


def stop(reason):
    yield "message_delta", {"type": "message_delta", "delta": {"stop_reason": reason}, "usage": {"output_tokens": 20}}
    yield "message_stop", {"type": "message_stop"}


def last_user_text(messages):
    content = messages[-1]["content"]
    if isinstance(content, str):
        return content
    return " ".join(b.get("text", "") for b in content if b.get("type") == "text")


def tool_results(messages):
    content = messages[-1]["content"]
    if messages[-1]["role"] != "user" or isinstance(content, str):
        return []
    return [b for b in content if b.get("type") == "tool_result"]


TRIVIA = {"preguntas": [
    {"pregunta": f"Pregunta de prueba número {n}: ¿cuánto es {n} más {n}?",
     "opciones": [str(n * 2), str(n * 2 + 1), str(n * 3), str(n + 7)], "correcta": 0,
     "dato": f"{n} más {n} es {n * 2}."}
    for n in range(1, 16)
]}

# Un pedido que maneja otra app: cada paso depende de lo que devolvió el anterior.
AGENT = [
    ("abrir_app", {"nombre": "Contacts"}),
    ("esperar", {"segundos": 2}),
    ("ver_pantalla", {}),
    ("tocar", {"elemento": 1}),
    ("escribir", {"texto": "wifi"}),
    ("tecla", {"nombre": "atras"}),
    ("deslizar", {"direccion": "abajo"}),
]


def first_user_text(messages):
    for m in messages:
        if m["role"] == "user":
            content = m["content"]
            if isinstance(content, str):
                return content
            texts = [b.get("text", "") for b in content if b.get("type") == "text"]
            if texts:
                return " ".join(texts)
    return ""


def turn_start(messages):
    """Dónde empieza el pedido en curso: el último mensaje del usuario que trae texto."""
    for i in range(len(messages) - 1, -1, -1):
        m = messages[i]
        if m["role"] == "user" and not isinstance(m["content"], str) and any(b.get("type") == "text" for b in m["content"]):
            return i
        if m["role"] == "user" and isinstance(m["content"], str):
            return i
    return 0


def script_for(body):
    messages = body["messages"]
    if body.get("output_config", {}).get("format"):
        print("  trivia pedida:", last_user_text(messages)[:80].replace("\n", " / "), flush=True)
        return list(block_text(0, json.dumps(TRIVIA, ensure_ascii=False))) + list(stop("end_turn"))
    results = tool_results(messages)
    start = turn_start(messages)
    asked = last_user_text([messages[start]]).lower()
    if "contactos" in asked:
        done = sum(1 for m in messages[start:] if m["role"] == "assistant")
        for r in results:
            print(f"  paso {done}:", ("ERROR " if r.get("is_error") else "") + str(r.get("content"))[:700].replace("\n", " | "), flush=True)
        if done < len(AGENT):
            name, payload = AGENT[done]
            return list(block_tool(0, f"toolu_a{done}", name, payload)) + list(stop("tool_use"))
        return list(block_text(0, "Listo: abrí los contactos, toqué lo primero y *volví*.")) + list(stop("end_turn"))
    if results:
        said = results[0].get("content")
        print("  resultado de herramienta:", str(said)[:160], flush=True)
        return list(block_text(0, "Listo: ya está hecho en el *proyector*.")) + list(stop("end_turn"))
    text = last_user_text(messages).lower()
    if "trivia" in text:
        return list(block_tool(0, "toolu_9", "armar_trivia", {"tema": "Sumas", "preguntas": 5})) + list(stop("tool_use"))
    if "volumen" in text:
        return list(block_tool(0, "toolu_1", "volumen", {"porcentaje": 30})) + list(stop("tool_use"))
    if "abrí" in text or "abri " in text:
        return list(block_tool(0, "toolu_2", "abrir_app", {"nombre": "Clock"})) + list(stop("tool_use"))
    if "pared" in text:
        return list(block_tool(0, "toolu_3", "mostrar_pared", {"modo": "hora"})) + list(stop("tool_use"))
    if "rechazo" in text:
        return list(stop("refusal"))
    if "largo" in text:
        long_text = " ".join(["Esta es una respuesta larga para probar el desplazamiento en la pared."] * 30)
        return list(block_text(0, long_text)) + list(stop("end_turn"))
    return list(block_text(0, "La luz del proyector se llama *lámpara* y en estos equipos es un LED.")) + list(stop("end_turn"))


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):
        pass

    def fail(self, status, kind, message):
        payload = json.dumps({"type": "error", "error": {"type": kind, "message": message}}).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Connection", "close")
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))))
        print(f"{self.path} modelo={body.get('model')} mensajes={len(body.get('messages', []))} "
              f"herramientas={len(body.get('tools', []))} beta={self.headers.get('anthropic-beta')} "
              f"versión={self.headers.get('anthropic-version')}", flush=True)
        text = "" if tool_results(body["messages"]) else last_user_text(body["messages"]).lower()
        if "clave" in text:
            self.fail(401, "authentication_error", "invalid x-api-key")
            return
        if "saturado" in text:
            self.fail(529, "overloaded_error", "Overloaded")
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Connection", "close")
        self.end_headers()
        start = {"type": "message_start", "message": {"id": "msg_1", "type": "message", "role": "assistant",
                                                      "model": body.get("model"), "content": [], "usage": {"input_tokens": 10}}}
        events = [("message_start", start)] + script_for(body)
        for name, data in events:
            self.wfile.write(f"event: {name}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode())
            self.wfile.flush()
            time.sleep(CHUNK_DELAY)
        self.close_connection = True


print(f"Claude de mentira en http://localhost:{PORT}/v1/messages", flush=True)
ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
