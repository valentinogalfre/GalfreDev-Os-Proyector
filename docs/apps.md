# Qué apps conviene instalar en un proyector

Estudio hecho el 2026-11-06 para armar la Tienda. El catálogo vive en
`app/src/main/assets/catalog.json` y se revisa con `scripts/store/check_catalog.py`.

Lo que se vio en un proyector real, un Fika P8, está dicho en cada parte. El resto se probó
en emulador, y está marcado.

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

Cine conoce doce servicios. Con suscripción: Netflix, Prime Video, Disney+, HBO Max, Paramount+
y Spotify. Gratis, con publicidad: YouTube, Pluto TV, Mercado Play, ViX, Plex y Canela.TV.

En la lista de Cine aparecen los que están instalados. El resto queda en «Más servicios»,
separado en gratis y con suscripción. Son las apps oficiales de Google Play, sin tocar. No
esquivamos ninguna protección: si un servicio decide no andar en un equipo sin certificar, no
anda.

### Qué se ve en el Fika P8

El 2026-11-11, en el Fika P8 del dueño andan YouTube y Netflix. Prime Video, HBO Max y Disney+
no. galfredev OS no interviene: solo abre la app que está instalada. Las causas probables, sin
confirmar todavía en el equipo:

1. **La versión de fábrica quedó vieja.** El servicio exige actualizarse y la tienda del equipo
   no ofrece la actualización. Es lo que cuentan compradores con Disney+.
2. **La variante equivocada.** El equipo se presenta como televisor y no tiene pantalla táctil:
   Google Play le ofrece las apps de TV y le esconde las de celular. Varias apps de TV solo
   andan en equipos certificados.
3. **El equipo no está certificado.** Widevine L3 y sin HDCP: algunos servicios bajan la
   calidad y otros directamente no reproducen.

Para saber cuál es, el celular tiene un informe: pestaña Apps, «Diagnóstico del equipo». Dice
cómo se presenta el equipo, el nivel de Widevine, si tiene Play Store, qué versión de cada
servicio hay, si es la de fábrica y de qué año, y qué apps reciben la pantalla del celular.
«Copiar el informe» lo deja listo para pegar.

### Qué se puede hacer con un servicio

En Cine, sobre un servicio, la tecla Menú (o mantener OK) abre sus opciones:

| Opción | Cuándo aparece | Qué hace |
|---|---|---|
| Abrir | Está instalado | Lo abre |
| Actualizarla con Aurora | Está instalado y hay Aurora Store | Abre su ficha en Aurora para bajar la versión nueva |
| Bajar la versión para TV | El servicio tiene app de TV y el equipo se presenta como televisor | Abre esa ficha en Aurora |
| Bajar la versión de celular | El servicio tiene las dos | Abre esa ficha en Aurora |
| Usar la versión de celular, o la de TV | Están instaladas las dos | Abre esa, y desde ahí el servicio abre siempre esa |
| Buscarla en Aurora Store | Falta, y tiene una sola versión | Abre su ficha en Aurora |
| Instalar Aurora Store | Falta Aurora | Abre su ficha en la Tienda |
| Conectar el celular | Siempre | Para manejar con el trackpad una app de celular |
| Sacarlo de la lista | Está instalado | Lo saca de Cine. Queda en «Más servicios» y se puede volver a mostrar |

Con dos versiones instaladas se abre la última que pediste, por «Bajar la versión…» o por
«Usar la versión…». Vale en Cine, desde el celular y cuando la abre Claude. Si nunca elegiste,
se abre la de TV.

Qué versión se pide primero:

- En un equipo que se presenta como televisor, la de TV. La de celular queda como alternativa.
- Netflix es la excepción: su app de TV solo anda en equipos certificados, y la que anda en
  estos proyectores es la de celular. Es la que el Fika P8 trae de fábrica.
- Disney+, HBO Max, Paramount+, Pluto TV, ViX y Plex tienen un solo paquete para todo. Mercado
  Play existe solo para TV.

Las versiones de celular no conocen el control remoto. Para eso está el trackpad del celular,
que necesita el control total.

Los nombres de paquete se revisaron contra Google Play el 2026-11-11: los doce existen. Que
cada servicio se instale y reproduzca en el Fika P8 no se comprobó: depende del servicio.

### Transmitir desde el celular

Cine tiene «Transmitir desde el celular», y la pestaña Apps del celular tiene el mismo botón.
Abre en la pared la app que recibe la pantalla: la que trae el equipo, si trae una, o CastBay,
que se instala desde la Tienda y recibe AirPlay y DLNA. Después, en el celular: en iPhone,
Centro de control y Duplicar pantalla; en Android, Transmitir o Smart View.

Sirve para YouTube, fotos, videos propios, la web y para mostrar una demo. **No sirve para
Netflix, Disney+, Prime Video ni HBO Max: al duplicar salen en negro.** Lo bloquean ellos, y no
hay forma legítima de esquivarlo. El proyector tampoco es un Chromecast: los servicios pagos
solo le mandan video a un receptor certificado.

Qué app recibe la pantalla en el Fika P8 no se sabe todavía: sale en el diagnóstico. Probado en
emulador con una app de reemplazo: la pared la abre desde Cine, desde el celular y desde el
turno de quien presenta su pantalla.

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
conectar un dispositivo compatible por HDMI. Sigue siendo nuestra recomendación, y vale para
Disney+, HBO Max y Prime Video: un Google TV Streamer o un Fire TV Stick en la entrada HDMI es
lo único que los muestra bien. Cine tiene la fila «Entrada HDMI» para pasar a esa entrada, si
el equipo la expone.

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
cuenta. Los detalles están en el [diseño](diseno.md).

## Límite conocido

La Tienda consulta la API de GitHub sin autenticar: 60 pedidos por hora y por IP.
Alcanza para una casa. Si el catálogo crece, conviene resolver las versiones en el CI
y publicar un JSON propio.
