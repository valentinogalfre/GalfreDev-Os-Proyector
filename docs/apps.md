# Qué apps conviene instalar en un proyector

Estudio hecho el 2026-11-06 para armar la Tienda. El catálogo vive en
`app/src/main/assets/catalog.json` y se revisa con `scripts/store/check_catalog.py`.

Nada de esto se probó en un proyector real. Lo probado en emulador está marcado.

## La conclusión

Estos proyectores no están certificados por Google ni por los servicios de video.
Eso define casi todo:

- **Widevine L3 y sin HDCP.** Las apps con DRM bajan la calidad o no abren. En un
  HY300 Pro, los usuarios reportan Netflix a 540p, Prime Video a 480p, Disney+ a
  720p, y Apple TV+ directamente no funciona.
- **Sin Google Play en la mayoría de los equipos.** Y varias apps oficiales solo
  existen ahí.
- **Software de 32 bits en H713 y H726.** Un APK solo de 64 bits no se instala,
  aunque el procesador lo soporte. La Tienda elige la variante según el equipo.
- **1 GB de RAM.** Kodi anda, pero es pesado.

Por eso la Tienda no promete Netflix. Ofrece lo que se puede bajar de la fuente
oficial, comprobar y usar con el control, y dice con claridad lo que no se puede.

## Netflix y compañía

Cine lista nueve servicios: Netflix, YouTube, Prime Video, Disney+, HBO Max, Paramount+, Pluto
TV, ViX y Spotify. Si están instalados los abre, primero la versión de TV. Si no, los busca en
Aurora Store. Son
las apps oficiales de Google Play, sin tocar. No esquivamos ninguna protección: si un
servicio decide no andar en un equipo sin certificar, no anda.

Las versiones de celular no conocen el control remoto. Para eso está el trackpad del
celular, que necesita el control total.

Probado el 2026-11-06 en un emulador con Android 11, 1280×720 a 240 dpi, sin pantalla táctil
y sin servicios de Google:

| Qué | Resultado |
|---|---|
| Instalar Netflix 9.90.1 con Aurora, como Anónimo | Funciona, confirmando con el control |
| Abrirla desde el celular | Muestra la portada y el botón de ingreso |
| Tocar «Sign in» con `/api/tap` | Se abre otra pantalla, vacía para el lector de accesibilidad. No se llegó a ver si era el ingreso |
| Quedarse abierta | **No.** Se mata sola y vuelve a Inicio a los 10 segundos, con y sin nuestro permiso |
| Orientación | Pide vertical y gira la pantalla, salvo con `cmd window set-fix-to-user-rotation enabled` |
| Escribir en sus campos y reproducir video | Sin probar. Se cierra antes, y no usamos ninguna cuenta |

Después se probó en un emulador con Android 9, 1280×720 a 240 dpi, sin pantalla táctil, con
Google Play y versión de usuario:

| Qué | Resultado |
|---|---|
| Instalar Aurora desde Cine, con el control | Funciona, una vez corregida la lectura de firmas |
| Configurar Aurora desde el celular | Funciona. Los avisos de permisos de Android van con el control |
| Instalar Netflix 9.91.0 con Aurora, como Anónimo | Funciona, confirmando con el control |
| Quedarse abierta | **No.** Se mata sola a los 2 segundos con `Process.killProcess`, sin error |
| Toques y gestos desde el celular | Llegan como toques de verdad, sin pantalla táctil |

Los dos emuladores terminaron igual, con y sin servicios de Google. En Android 9 el registro
muestra que Netflix se mata a sí misma, y no que se rompa. Creemos que es por correr en un
emulador, sin poder comprobarlo. Compradores del Fika P8 cuentan que en el equipo anda, así que
el emulador no sirve para esta prueba: hay que hacerla en el proyector.

Netflix indica que su app solo funciona en marcas asociadas y que, para las demás, hay que
conectar un dispositivo compatible por HDMI. Sigue siendo nuestra recomendación.

## Qué ofrece la Tienda

Son 21 apps. Cada descarga sale de la fuente oficial del proyecto.

| Categoría | Apps | Fuente |
|---|---|---|
| Video | SmartTube, NewPipe, SmartTwitchTV | GitHub |
| Reproductores | Just Player, VLC, Kodi, NOVA | GitHub, VideoLAN, Kodi |
| Navegador | TV Bro | GitHub |
| Archivos | Fluffy, LocalSend, Material Files | GitHub |
| Tu propio servidor | Jellyfin, Wholphin, Stremio | GitHub, Stremio |
| Pantalla y juegos | CastBay, Moonlight | GitHub |
| Otras tiendas | Flicky, F-Droid, Aurora Store | GitHub, F-Droid, Aurora OSS |
| Herramientas | Key Mapper, RadioDroid | GitHub |

### Cómo se comprueba una descarga

1. La versión se resuelve en el momento, desde la fuente oficial. Si el sitio no
   responde, la ficha lo dice y no inventa un dato.
2. Si la fuente publica un SHA-256, se compara. Lo publican GitHub, para cada
   archivo de una versión, y VideoLAN, para VLC.
3. Si en el catálogo hay firmas fijadas, la firma del APK tiene que coincidir.
   Hoy las tienen SmartTube, NewPipe, Fluffy, LocalSend, Jellyfin, Flicky y Aurora.
4. La instalación la hace siempre el instalador del sistema: la persona confirma.

Las demás apps no tienen firma fijada todavía. Para ellas, la protección es HTTPS y
la fuente oficial: el SHA-256 prueba que el archivo llegó entero, no quién lo firmó.
Fijarlas es una mejora pendiente.

### Mejores versiones que las de fábrica

Con `replaces`, la Tienda recomienda una alternativa cuando detecta la app común
instalada:

| Si tenés | Te recomendamos | Por qué |
|---|---|---|
| YouTube | SmartTube | Pensado para control remoto, sin publicidad |
| Twitch | SmartTwitchTV | Hecho para TV |
| Chrome | TV Bro | Se maneja con flechas |
| Archivos del sistema | Fluffy | Interfaz para TV |
| Jellyfin de celular | Jellyfin para TV | Interfaz para TV |
| Play Store | Flicky | F-Droid con control remoto |

### Una advertencia que importa

En noviembre de 2025, el equipo del desarrollador de SmartTube se infectó y algunas
versiones salieron con malware. Los nombres de paquete viejos quedaron marcados en
`legacy`: si la Tienda encuentra uno, avisa y propone desinstalarlo.

## Lo que no se puede instalar

No hay APK oficial de directa descarga para estas apps:

| App | Motivo |
|---|---|
| Netflix | Exige equipos certificados. Definición estándar, o no abre. Se puede intentar con Aurora Store |
| Prime Video | Solo Google Play o equipos de Amazon. Queda cerca de 480p. Se puede intentar con Aurora Store |
| Disney+ | Solo Google Play. Se puede intentar con Aurora Store |
| HBO Max | Dice que por fuera de Google Play no está soportado. Se puede intentar con Aurora Store |
| YouTube para TV | Solo equipos certificados. SmartTube es la alternativa |
| Spotify | Sin APK oficial para TV. Se puede bajar con Aurora Store |
| Claude | La app oficial es de celular y está solo en Google Play |

También sin APK oficial directo: Pluto TV, Flow, Telecentro Play, Cine.ar Play, Plex,
MX Player, Downloader y Solid Explorer.

Sin uso hoy: Tubi (bloquea IP de Argentina), Cont.ar (dominio caído) y Firefox para
Fire TV (discontinuado).

Quedaron afuera a propósito: X-plore, Aptoide TV y Cloudstream.

Si alguien quiere Netflix o Disney+ con buena imagen, nuestra recomendación honesta
es conectar un Google TV Streamer o un Fire TV Stick al HDMI del proyector.

## Claude

La app oficial `com.anthropic.claude` no sirve acá: es de celular, necesita Google
Play y no se usa con control remoto. Por eso armamos una pantalla propia que habla
con la API de Anthropic. Hace falta una clave de API, y cada pregunta se cobra en esa
cuenta. Los detalles están en el [diseño](superpowers/specs/2026-11-06-galfredev-os-design.md).

## Límite conocido

La Tienda consulta la API de GitHub sin autenticar: 60 pedidos por hora y por IP.
Alcanza para una casa. Si el catálogo crece, conviene resolver las versiones en el CI
y publicar un JSON propio.
