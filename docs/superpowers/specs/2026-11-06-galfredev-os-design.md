# Diseño de galfredev OS

2026-11-06. Pasada completa sobre el launcher: marca, animaciones, apps, Claude y lo
que hace único al sistema.

## La idea

**La cinta es el foco.** La cinta del manual, ese único bloque #E4A32B que puede tener cada
pieza, acá es el foco del D-pad. Una sola por pantalla, un solo objeto físico:

- Se mueve con el control y se ajusta al texto que marca.
- Lo que queda debajo se vuelve a dibujar en carbón: es la única regla del manual que
  pide algo sobre la cinta, y da el efecto que distingue al sistema.
- Tapa la pantalla en cada transición y se destapa en la siguiente.
- El arranque la entrega al inicio. Nunca hay dos.
- Se puede fijar en una palabra de una respuesta de Claude, o ser el puntero del celular.
- Nunca tapa contenido: en fotos, video y PDF no aparece.

Lo demás es sobrio a propósito: tipografía grande, carbón como papel, filetes de 2 px.
Lo épico está en un solo movimiento, no en muchos efectos.

## Arranque

`ui/BootView.kt` pone en movimiento la lámina de construcción de la g del manual: se trazan
las guías, el contorno, la g se llena, aparece el resto de la palabra, sube al encabezado,
entra el lema, la cinta barre «a medida.» y viaja al primer elemento del inicio.

Mide cuadros reales mientras corre. Con ese dato `ui/Motion.kt` decide si el equipo
aguanta las animaciones completas. La persona puede forzarlo desde Ajustes.

La animación de arranque del sistema no se puede cambiar sin root. Para esos equipos
está `scripts/brand/build_bootanimation.py`.

## Lienzo fijo

`ui/Screen.kt` fija la densidad para que todo mida lo mismo a 720p y a 1080p, con cualquier
densidad que reporte el equipo: estos firmware mienten bastante. Comprobado a 160, 240 y
320 dpi.

## Claude

La app oficial es de celular y solo está en Google Play. Por eso armamos una pantalla
propia contra la API.

**Por qué HTTP directo y no el SDK oficial.** Es una decisión contra la regla por defecto:
`anthropic-java-core` 3.2.0 pesa 39.259.472 bytes, más Jackson y OkHttp, para un APK de
1,4 MB que corre en equipos de 1 GB. `claude/Transport.kt` habla con `/v1/messages` usando
`HttpURLConnection` y lee los eventos del stream a mano. El costo es mantener
`claude/Protocol.kt`. Lo cubren 44 tests contra respuestas guionadas y sockets de verdad.

**Pedido.** `claude-opus-5-5` por defecto, y se puede elegir Sonnet 5.5 o Haiku 5.5.
`stream: true`, `max_tokens: 64000`, `output_config.effort: "low"` y caché automática.
Sin `thinking`, sin temperatura y sin prefill. La versión de API va fija: `2026-10-21`.

**Respaldo del servidor.** En Opus y Sonnet se manda `fallbacks: "default"` con la beta
`server-side-fallback-2026-07-01`. Si la cuenta no tiene la beta y la API responde 400, se
reintenta sin esos campos. Haiku no lo soporta. Cuando el modelo cambia a mitad de camino,
`History.echo` limpia lo que no debe volver en el historial.

**Herramientas.** Once: `listar_apps`, `abrir_app`, `abrir_enlace`, `estado_equipo`,
`volumen`, `temporizador_apagado`, `mostrar_pared`, `abrir_calibracion`, `listar_tienda`,
`abrir_ficha_tienda` y búsqueda web del servidor. Con `eager_input_streaming` la entrada
llega sin validar, así que `claude/Tools.kt` la comprueba antes de tocar el equipo.

**Lo que nunca hace sola.** Abrir un enlace pide confirmación en pantalla. Instalar, no
instala: abre la ficha y la persona confirma con el control.

**Sin probar con la API real.** Todo se probó contra `scripts/fake_claude.py`. El identificador
de la herramienta de búsqueda en Haiku (`web_search_20250305`) es una suposición.

## Celular

`remote/` es un servidor HTTP propio, sin dependencias, en el puerto 8686.

**Emparejar.** El QR lleva un token de 48 caracteres en el fragmento de la URL, que no viaja
en los pedidos. También se puede usar un PIN de 6 dígitos que se ve en el proyector.

**Qué protege:**

| Riesgo | Defensa |
|---|---|
| Alguien en la red prueba rutas | Todas piden el token, en una cabecera. Nunca en una cookie |
| Otra página usa tu navegador | Se comprueba el origen y el tipo de contenido |
| Adivinar el PIN | Cinco intentos y traba creciente, **por dirección**: quien insiste no le saca el PIN al dueño |
| Ocupar todas las conexiones | Plazo total por pedido, seis conexiones por dirección, doce en total |
| Llenar el disco | Se resta del espacio libre, sin sumar lo que declara el cliente, y hay una subida por vez |
| **Instalar algo desde el celular** | **El instalador del sistema no acepta teclas que vengan del celular** |
| Salir de la carpeta con un nombre | `Uploads.safeName` deja solo el nombre, sin rutas ni ocultos |

Esta última regla importa: un token robado no alcanza para instalar nada. Hace falta una
persona con el control enfrente. La regla está en `remote/RemoteGuard.kt`. Atrás sí se puede,
para salir del diálogo.

**Límites aceptados.** El token no vence: Desconectar lo rota. La conexión es HTTP en la red
local. Un celular emparejado con control total es como tener el control en la mano, Ajustes
incluido.

**Control de otras apps.** Con el permiso de accesibilidad, las flechas van por acción global
en Android 13 en adelante. Antes se mueve el foco a mano. En apps hechas con Compose el
sistema no sabe buscar el siguiente elemento, así que `remote/FocusGeometry.kt` lo elige
mirando dónde están. Probado en Fluffy, en Android 11.

**Manejar otras apps.** `/api/open` abre una app o, si un servicio no está, su ficha en
Aurora. `/api/tap` y `/api/swipe` reciben puntos de 0 a 1 y rechazan los de afuera. El trackpad
guarda la posición en la página y manda un solo pedido de puntero por vez. Primero se prueba
`dispatchGesture`. En Android 9 llega como un toque de verdad, aunque el equipo no tenga pantalla
táctil. En Android 11, sin pantalla táctil Android lo cancela, y entonces `remote/Touch.kt` busca la
vista como la repartiría un toque de verdad y le pide `ACTION_CLICK` o `ACTION_SCROLL_*`. El
resguardo del instalador se comprueba antes del gesto y de nuevo antes de la acción. Si no se
sabe qué hay delante, no se toca.

## Tienda

Detalle en [`docs/apps.md`](../../apps.md). Lo importante del diseño:

- El catálogo está en el APK y las versiones se resuelven en el momento, contra la fuente.
- Si la fuente publica un hash y no se puede leer, **la descarga no sigue**.
- Si hay firma fijada, el APK tiene que coincidir.
- La instalación la hace siempre el instalador del sistema.

## Funciones del equipo

No existe una API para trapecio, foco o HDMI. `device/Functions.kt` las busca en el equipo:
primero rutas conocidas y después por nombre. Solo abre lo que el sistema resuelve y está
exportado, y nunca escribe nada. En el Chowa P8 el foco no es una pantalla sino un aviso del
sistema, y `Functions.Found` lo marca para mandarlo en vez de abrirlo.

Lista negra: `com.htc.closedialog` corta el equipo por sobretemperatura.

## Pruebas

Cada test nombra el contrato que protege: `contrato - ...`. Las revisiones de seguridad y de
correctitud se hicieron con ojos nuevos, y cada hallazgo primero se reprodujo o se comprobó
con una mutación: se rompe el código a propósito y el test tiene que ponerse rojo.
