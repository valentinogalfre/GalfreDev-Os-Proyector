# galfredev OS

El sistema que hicimos para proyectores Android, como el Fika P8 y los tipo HY300. Se maneja
entero con el control remoto y lleva la marca de punta a punta.

No es una ROM y no toca el firmware. Es un solo APK de 1,5 MB que reemplaza la pantalla
de inicio del fabricante. Si algo falla, el inicio original sigue en el equipo.

Nada de esto se probó todavía en un proyector real. Lo probamos en emulador, con
Android 9 y 11. Lo que falta comprobar en hardware está en [`ROADMAP.md`](ROADMAP.md).

## Qué tiene

| Pantalla | Qué hace |
|---|---|
| Inicio | Ocho palabras grandes y, al lado, lo que importa de cada una: seguí viendo, apps recientes, recomendaciones |
| Apps | Grilla con búsqueda, favoritas, app principal y desinstalar |
| Cine | Netflix y compañía, y video, música, fotos y PDF desde la memoria, un pendrive o el celular. Retoma donde dejaste, con subtítulos |
| Tienda | 21 apps elegidas para proyector, bajadas de su fuente oficial y comprobadas antes de instalar |
| Claude | Hablale desde el celular y usa las apps por vos: abre, busca, escribe y le da reproducir. La respuesta sale en la pared |
| Juntada | Todos se suman desde su celular con un código: trivia que escribe Claude, votaciones y las cuentas de la casa |
| Pared | La hora en palabras, la hora grande o una retícula. Arranca sola si dejás de usarlo |
| Celular | Tu celular como control, trackpad y teclado de cualquier app, sin instalar nada |
| Ajustes | Lo del sistema que este equipo de verdad tiene, más tema, animaciones y temporizador |

## Lo que no vas a ver en otro proyector

- **La cinta es el foco.** Hay una sola por pantalla. Se mueve con el control, tapa la
  pantalla en cada transición y lo que queda debajo se dibuja en carbón. El arranque
  construye el logo y le entrega esa misma cinta al inicio.
- **El celular sin app.** Escaneás un QR y listo: flechas, trackpad, abrir apps, texto,
  subir un archivo, mandar un enlace o preguntarle a Claude.
- **Claude usa las apps.** Le decís «abrí YouTube y poné música para programar» y lo hace:
  lee lo que hay en pantalla, mueve el puntero, toca, escribe y vuelve a mirar. En la pared se
  ve cada paso. Marca con la cinta la palabra que resume la respuesta.
- **Se le habla.** En el celular hay un botón de micrófono: decís el pedido y sale.
- **La juntada.** La pared como tablero y cada celular como control, sin instalar nada. Una
  trivia sobre el tema que quieran, votaciones, y quién le debe a quién al final del asado.
- **Una Tienda que sabe de proyectores.** Elige la variante de 32 o 64 bits, compara
  hashes y firmas, y avisa si tenés una versión con malware.
- **Calibración.** Patrones de foco, geometría y niveles para dejar bien la imagen.
- **Imagen en negro.** Apaga la imagen sin apagar el equipo. También se dispara con el
  temporizador o desde el celular.

## Con el control remoto

- Flechas: mueven la cinta.
- OK: abre. En el reproductor, pausa.
- Menú, o mantener OK sobre una app: principal, favorita, información y desinstalar.
- Atrás: vuelve. En Claude, si está respondiendo, detiene la respuesta.

## Instalar en un proyector

El paso a paso completo está en [`docs/instalar.md`](docs/instalar.md). Lo corto, con ADB:

```sh
adb install app-debug.apk
adb shell cmd package set-home-activity ar.vale.projectorlauncher/.LauncherActivity
```

Antes de probar en un equipo, leé [`docs/proyectores.md`](docs/proyectores.md): hay cosas
que no conviene tocar. Dejá habilitado el inicio del fabricante, es la salida si algo falla.

**En un Fika P8 o un Chowa P8, no reinicies con Depuración USB activada:** se queda sin Wi-Fi
ni Bluetooth. La guía instala por pendrive y solo usa ADB si hace falta.

Si instalás encima de un APK compilado en otra máquina o en el CI, la firma de depuración
no coincide y hay que desinstalar antes.

### Para que el celular maneje otras apps

Dentro de nuestras pantallas el celular funciona solo. Para manejar otras apps hay que dar
permiso de accesibilidad una vez, desde Celular. Forzar la detención de la app lo apaga y
hay que volver a darlo.

Con ese permiso, el trackpad dibuja un puntero sobre cualquier app. En Android 9 el toque llega
como un dedo de verdad, aunque el equipo no tenga pantalla táctil. En Android 11, Android cancela
esos gestos, así que el toque le pide la acción a la vista que está en ese punto, como un lector
de pantalla. Ahí, una parte de una app que no expone sus botones no responde al trackpad y quedan
las flechas.

### Para usar Claude

Necesitás una clave de API de Anthropic. Se carga en Claude, en Ajustes, o desde el celular
para no tipearla con el control. Cada pregunta se cobra en esa cuenta. La clave queda cifrada
en el equipo y nunca sale de ahí, salvo hacia la API.

**Para que maneje otras apps** hace falta el mismo permiso de Control total que usa el celular.
Con eso Claude tiene seis herramientas: ver la pantalla, tocar, escribir, apretar una tecla,
deslizar y esperar. No ve imágenes: Android 9 no deja sacar capturas, así que lee lo mismo que
un lector de pantalla, como una lista numerada. Lo que lee de esa pantalla se manda a la API de
Anthropic, y se puede apagar en los ajustes de Claude.

Hay cosas que no toca aunque se lo pidan, y están en el código y no solo en las instrucciones:
el instalador, los permisos, la tienda de Google y los ajustes del sistema, que puede abrir pero
no leer ni tocar. Tampoco escribe en campos de contraseña.
Una tarea se corta sola a los treinta pasos. Cada toque es un pedido a la API: buscar una
película y darle reproducir son unos diez, y tarda cerca de medio minuto.

**Para hablarle** desde el celular hay dos caminos. El micrófono del teclado funciona siempre.
El botón de micrófono de la página necesita que el navegador confíe en ella, y para eso el
proyector la sirve también por HTTPS, en el puerto 8696, con un certificado que firma él mismo:
el navegador avisa una vez y hay que aceptarlo. La transcripción la hace el celular.

### La juntada

En la pantalla Juntada hay un código para los invitados. Con ese código solo se pide permiso:
cada uno pone su nombre y entra cuando el dueño lo deja pasar, desde su celular o en la pared.
Al aprobar se elige hasta dónde llega: la juntada sola, o también el control (flechas, puntero,
teclado y abrir apps, sin entrar a Celular, Ajustes ni Claude). Nadie más que el dueño le habla
a Claude, carga la clave, manda archivos o abre enlaces. El pase de cada celular se guarda como
huella, así que el archivo del equipo no sirve para entrar. La trivia la
arma el dueño, desde la pared, desde su celular o pidiéndosela a Claude. Las preguntas las
escribe Claude sobre el tema que elijan; sin clave o sin red, salen de un banco propio. La
respuesta correcta no viaja a los celulares hasta que la pregunta cierra. La gente y las
cuentas se guardan en el equipo; «Empezar de cero» borra todo, saca a los invitados y cambia
el código.

## Compilar

Hace falta JDK 17 y el Android SDK con la plataforma 35.

```sh
./gradlew assembleDebug        # el APK queda en app/build/outputs/apk/debug/
./gradlew testDebugUnitTest    # 280 tests de contrato
./gradlew lintDebug            # los errores frenan la compilación
```

El proyecto no usa AndroidX a propósito: solo el framework y Kotlin, para que arranque
rápido en equipos con 1 GB de RAM.

## Probar

| Qué | Cómo |
|---|---|
| Recorrido en emulador | `scripts/emulator-smoke.sh <apk> <carpeta>`. Falla si algo se cierra solo o si la cinta no está donde debe |
| Claude sin gastar | `python3 scripts/fake_claude.py`, un servidor de mentira. Solo lo acepta la versión de depuración. Con «contactos» maneja otra app paso a paso, y con «trivia» arma una |
| Catálogo de la Tienda | `python3 scripts/store/check_catalog.py --token "$(gh auth token)"` resuelve las 21 apps contra sus fuentes |

El CI compila, corre los tests y lint, y hace el recorrido en un emulador de TV a 1080p.
Una vez por semana revisa que el catálogo siga resolviendo.

## La marca

Todo sale del Kit de marca v2. No se dibuja nada a mano:

```sh
python3 scripts/brand/build_fonts.py   # Archivo, Instrument Sans y Geist Mono
python3 scripts/brand/build_logo.py "<carpeta 01_Logo del kit>"
python3 scripts/brand/build_icons.py   # íconos de línea, trazo 1,7
```

`scripts/brand/build_bootanimation.py` genera la animación de arranque del sistema, solo
para equipos con root.

Las reglas que más se rompen sin querer: una sola cinta por pantalla, la cinta nunca indica
un estado, y arriba de la cinta solo va carbón.

## El código

| Carpeta | Qué hay |
|---|---|
| `ui/` | Base de las pantallas, cinta, arranque, teclado, paneles |
| `apps/`, `media/`, `store/`, `wall/` | Una pantalla o módulo cada una |
| `device/` | Lo del equipo: funciones del fabricante, temporizador, calibración |
| `claude/` | Protocolo de la API, sesión, herramientas, clave, lectura y manejo de otras apps |
| `juntada/` | Trivia, votación y cuentas; la pantalla de la pared y el banco de preguntas |
| `remote/` | Servidor HTTP y HTTPS, emparejado, invitados, control por accesibilidad |

Más detalle en el [diseño](docs/superpowers/specs/2026-11-06-galfredev-os-design.md), en
[qué apps conviene instalar](docs/apps.md) y en las
[notas de firmware](docs/proyectores.md).

## Lo que no hace

- Trapecio, foco, lámpara y entrada HDMI son del firmware de cada fabricante. Si el equipo
  trae esas pantallas, las encontramos y las abrimos. No las podemos reemplazar.
- La animación de arranque del sistema necesita root. La nuestra arranca después.
- Netflix, Prime Video, Disney+ y HBO Max no están pensadas para estos equipos. Algunos las
  traen de fábrica. Si faltan, Cine las busca en Aurora Store, y el celular las maneja, pero
  pueden verse en baja calidad o no abrir. Si querés buena imagen, conectá un Google TV Streamer
  o un Fire TV Stick por HDMI.
- La conexión con el celular es HTTP dentro de tu red, sin cifrar. Usala en una red de confianza.
  La versión por HTTPS existe para el micrófono, y su certificado no lo avala nadie.
- Claude no ve la imagen. Si una app no describe sus botones, o es un video a pantalla
  completa, no tiene qué leer. Tampoco puede confirmar que algo se esté reproduciendo.
- Netflix se cierra sola en los emuladores, así que ahí Claude se probó con otras apps. Que
  busque y reproduzca en el Netflix del proyector falta comprobarlo en el equipo.

---

[galfredev.com](https://galfredev.com) · Río Tercero, Córdoba
