# Instalar galfredev OS en tu proyector

La guía de punta a punta para el **Fika P8**. Sirve igual para el Chowa P8, que es el modelo
anterior. Si tenés otro equipo, andá a [Otros proyectores](#otros-proyectores).

galfredev OS no reemplaza el sistema del proyector. Es una app que se pone como pantalla de
inicio, y el inicio del fabricante queda en el equipo. Si algo sale mal, se desinstala y el
proyector vuelve a estar como antes.

Está instalado en un Fika P8 desde noviembre de 2026. Cada versión se prueba antes en un
emulador con Android 9 y sin pantalla táctil. Lo que sabemos del firmware viene de ese equipo y
de lo que publicó
[el dueño de un Chowa P8](https://github.com/aguara-guazu/-chowa-p8-virtual-remote), así que el
tuyo puede ser distinto. Si tu inicio de fábrica sí muestra los Ajustes, mejor: usalos.

> **No reinicies con Depuración USB activada.** En el Chowa P8, si el equipo arranca con esa
> opción prendida, dejan de funcionar el Wi-Fi y el Bluetooth. Activarla con el equipo ya
> prendido no rompe nada: el problema aparece al apagar y prender. El camino normal de esta guía
> no la usa. Si necesitás el [camino con ADB](#camino-con-adb-solo-si-hace-falta), hacelo entero
> antes de apagar.

## Qué necesitás

- El proyector con el control remoto.
- Tu red Wi-Fi. El celular y el proyector tienen que estar en la misma. No uses la red de
  invitados: suele aislar los equipos entre sí.
- Un mouse USB. Con el control no se puede hacer todo.
- Un pendrive con `galfredev-os.apk`, en formato FAT32, que es como vienen casi todos.
- Si el proyector tiene un solo USB, un hub USB chico. Sin hub, vas cambiando el mouse por el
  pendrive y usás el control mientras tanto.
- La Mac, solo si algo no se puede hacer con el mouse.

## 1. Llevá el APK con vos

El APK está en el Escritorio de la Mac y hoy no está en GitHub. Copiá `galfredev-os.apk` al
pendrive antes de salir.

Si no lo encontrás, se genera con `./gradlew assembleDebug` y queda en
`app/build/outputs/apk/debug/app-debug.apk`.

## 2. Mirá lo que trae de fábrica

Antes de instalar nada:

1. Terminá la configuración inicial, si te la pide. Hasta que no termine, Android ignora
   cualquier pantalla de inicio nueva.
2. Conectalo a tu Wi-Fi.
3. Buscá Netflix y abrilo. Los compradores cuentan que viene instalado, en su versión de
   celular.
4. Anotá qué apps abren y cuáles piden actualizarse.

## 3. Instalá la app

1. Enchufá el mouse y fijate que aparezca la flecha.
2. Abrí el App Store del proyector, buscá ES File Explorer e instalalo.
3. Enchufá el pendrive y abrí ES File Explorer.
4. Entrá al pendrive y abrí `galfredev-os.apk`.
5. Si dice que está bloqueado, permití instalar apps desde ES File Explorer y volvé.
6. Elegí Instalar y después Abrir.

Si el App Store no tiene ES File Explorer, buscá otro explorador de archivos. Si no hay ninguno,
frená acá: sin explorador no hay cómo abrir el APK.

Cuando termines la guía, desinstalá ES File Explorer desde Ajustes, Sistema, Apps del sistema. Sus
versiones viejas dejaban que otro equipo de tu red leyera tus archivos, y ya no lo vas a necesitar.

## 4. Abrila sin cambiar nada todavía

Recorré las pantallas con el control antes de fijarla como inicio. Si algo se cierra solo, frená
acá: todavía no cambiaste nada.

## 5. Ponela como pantalla de inicio

1. Apretá Inicio en el control.
2. Si aparece una lista, elegí galfredev OS con el mouse. Puede abrirse sin preguntar más.
3. Apretá Inicio otra vez y hacé clic en Siempre, o Always, con el mouse. En el emulador, ese botón
   no se alcanzó con el control.
4. Apretá Inicio una vez más. Tiene que abrir galfredev OS sin preguntar.

Si no aparece ninguna lista, entrá a galfredev OS, Ajustes, Sistema, Apps del sistema. Buscá el
inicio de fábrica y borrá sus valores predeterminados. No lo deshabilites: es tu salida si algo
falla. Si esa opción no está, se hace por el [camino con ADB](#camino-con-adb-solo-si-hace-falta).

Apagá y prendé el proyector para comprobarlo. Con Depuración USB apagada, no hay riesgo.

Si tu equipo fuerza su propio inicio, galfredev OS igual funciona: la abrís desde la lista de
apps.

## 6. Dale permiso a los archivos

Entrá a Cine y elegí Dar permiso.

## 7. Conectá el celular

1. Entrá a Celular y elegí Activar.
2. Escaneá el QR con la cámara del celular. Si no abre, escribí en el navegador la dirección que
   aparece y el PIN.
3. Guardá la página en favoritos. Queda emparejada, no hace falta repetir el QR.

No hay que instalar nada en el celular.

Ese primer celular queda como dueño. Desde ahí, el código que muestra Celular ya no da acceso:
sirve para pedir permiso, y el PIN deja de aceptarse. Quien lo escanea pone su nombre y espera.
Vos lo ves en tu celular, en cualquier pestaña, y elegís:

- **Solo juntada:** juega, vota y anota gastos.
- **Con control:** además maneja el proyector como con el control remoto: flechas, puntero,
  teclado y abrir apps. No entra a Celular, a Ajustes ni a Claude, ni a los ajustes del sistema.
- **No.**

Ningún invitado llega a tu clave de Claude, a los pedidos a Claude, a los archivos ni a los
enlaces. En Juntada, en tu celular, está la lista de invitados: ahí le das o le quitás el
control a cada uno, o lo sacás.

Para vincular otro celular tuyo con acceso total, elegí en Celular «Vincular otro celular mío»,
con el control. El código y el PIN de acceso total se muestran hasta que salís de esa pantalla.
«Desconectar los celulares» los suelta a todos, también al tuyo.

Si el proyector cambia de dirección IP, hay que escanear de nuevo. Para que no pase, reservale la
IP en tu router.

### Control total

Sin este permiso el celular maneja solo las pantallas de galfredev OS. Con él, maneja cualquier
app, y hace falta para Netflix.

1. En Celular, elegí Control total y después Abrir Accesibilidad.
2. Buscá galfredev OS y activalo. Si el control no llega al interruptor, usá el mouse.
3. Confirmá el aviso de Android.

Si esa pantalla no se abre, se hace por el [camino con ADB](#camino-con-adb-solo-si-hace-falta).

Forzar la detención de la app apaga este permiso. Si pasa, volvé a activarlo.

## 8. Usar el celular

| Pestaña | Para qué |
|---|---|
| Control | Flechas o Trackpad, más Atrás, Inicio, Pausa y volumen |
| Apps | Abrir cualquier app en el proyector, Netflix y compañía, y poner la pared a recibir tu pantalla |
| Escribir | Mandar texto a un campo, por ejemplo usuario y contraseña |
| Archivos | Mandar videos, fotos, música, PDF o apps a Cine |
| Claude | Preguntarle algo y cargar la clave |
| Presentar | Pasar diapositivas, puntero e imagen en negro |

En Trackpad, deslizá para mover el puntero, tocá para elegir y usá dos dedos para desplazar. Para
escribir en un campo: tocalo con el trackpad y mandá el texto desde Escribir.

Instalar una app siempre se confirma con el control, en el proyector. Es a propósito: nadie puede
instalar nada desde un celular sin estar en la sala.

La conexión con el celular no va cifrada. Usala en tu Wi-Fi de casa, no en una red pública.

## 9. Netflix y compañía

En el Fika P8 andan Netflix y YouTube. Netflix viene en su versión de celular. Prime Video, HBO
Max y Disney+ no andan con lo que trae de fábrica: piden actualizarse y no dejan, o no abren.

Cine muestra los servicios que están instalados. Los demás están en «Más servicios», separados
en gratis y con suscripción. Pluto TV, Mercado Play, ViX, Plex y Canela.TV son gratis, con
publicidad, y son los que más chances tienen de andar, porque no suelen exigir un equipo
certificado. En el Fika P8 todavía no los probamos.

Sobre un servicio, la tecla Menú del control (o mantener OK) abre sus opciones: abrirlo,
actualizarlo con Aurora, bajar su otra versión (la de TV o la de celular) o sacarlo de la lista.

Si uno no abre, probá en este orden:

1. «Actualizarla con Aurora». Una versión de fábrica vieja es la causa más probable.
2. La otra versión: si tenés la de celular, la de TV, y al revés. Cuando termina de instalarse,
   el servicio abre esa. Para volver a la anterior, en sus opciones elegí «Usar la versión…».
3. El diagnóstico: en el celular, pestaña Apps, «Diagnóstico del equipo». Dice por qué ese
   equipo puede no andar con un servicio. «Copiar el informe» sirve para pedir ayuda.
4. Un dispositivo por HDMI, que es lo que anda siempre.

### Si Netflix ya está

1. Entrá a Cine y elegí Netflix, o abrila desde la pestaña Apps del celular.
2. Manejala con Trackpad. Es la versión de celular y el control no alcanza. Por eso antes tiene
   que estar hecho el paso de Control total.
3. Para entrar a tu cuenta, tocá el campo con el trackpad y mandá el usuario y la contraseña
   desde Escribir. Si el texto no llega, enchufá un teclado USB.

Esto no lo pudimos probar con Netflix. En nuestros emuladores la app se instala, abre y se cierra
sola a los pocos segundos, a propósito, también con nuestro permiso apagado. Creemos que es por
ser un emulador. Lo que sí probamos, en Android 9 y sin pantalla táctil, es que los toques del
celular les llegan a las apps como un dedo de verdad.

### Para ver mejor: un dispositivo por HDMI

La versión de celular en un equipo sin certificar suele verse en baja definición. Para mejor
imagen, enchufá un Google TV Streamer, un Chromecast con Google TV o un Fire TV Stick a la entrada
HDMI del proyector. Es lo que indica Netflix para proyectores sin soporte.

Con Google TV podés mandar desde la app de Netflix de tu celular, que es justo el manejo desde el
celular que buscás. En galfredev OS, la entrada aparece en Cine como Entrada HDMI si el equipo la
expone. Si no, usá la tecla Entrada del control.

Antes de comprar, mirá atrás del proyector. Las publicaciones nombran HDMI y USB, pero no dicen
con claridad si es una entrada. El dispositivo va con su propio cargador.

### Para las que faltan o piden actualizarse: Aurora Store

Es la app oficial de Google Play, sin modificar. No podemos prometer que ande: depende de tu
equipo y del servicio. Con 1 GB de memoria, conviene tener pocas apps abiertas.

Aurora también está hecha para pantallas táctiles: manejala con el Trackpad del celular.

1. Entrá a Cine y elegí el servicio.
2. Elegí Instalar Aurora Store. En su ficha, elegí Instalar. Si Android pide permitir instalar
   apps desde galfredev OS, activalo, volvé y elegí Instalar otra vez. Confirmá con el control.
3. Volvé a Cine, elegí el servicio y después Buscarla en Aurora Store. La primera vez se abre la
   portada de Aurora.
4. En Aurora, avanzá con Next y activá los permisos que pide. Los avisos de Android se contestan
   con el control o el mouse: el celular no los puede tocar. Al terminar, entrá como Anónimo
   (Anonymous). No uses tu cuenta de Google: Google no autoriza este uso y podría bloquearla.
5. Volvé a Cine y elegí el servicio otra vez. Ahora abre su ficha.
6. Si pregunta, elegí Open. Después elegí Instalar, o Actualizar, y confirmá con el control.

### Transmitir desde el celular

En Cine, «Transmitir desde el celular» abre en la pared la app que recibe la pantalla. Desde el
celular se hace lo mismo en la pestaña Apps. Si el equipo no trae ninguna, ofrece instalar
CastBay desde la Tienda, que recibe AirPlay y DLNA.

1. El celular y el proyector, en la misma red Wi-Fi.
2. Abrí la app que recibe, en la pared.
3. En iPhone: Centro de control, Duplicar pantalla, y elegí el proyector. En Android:
   Transmitir, Smart View o Duplicar pantalla.

Se ven bien YouTube, las fotos, los videos propios, la web y cualquier demo. **Netflix, Disney+,
Prime Video y HBO Max salen en negro al duplicar:** lo bloquean ellos, y no tiene arreglo.

### Lo que no sirve

- **Duplicar la pantalla para ver un servicio pago.** Se ve el menú, y el video queda en negro.
- **APK modificados que prometen más calidad.** Saltean la protección de los servicios y pueden
  traer malware. No los recomendamos.

## 10. Trapecio, foco y entradas

En Ajustes, Proyector, aparecen las funciones que galfredev OS encuentre en tu equipo: Trapecio,
Foco, Entrada HDMI, Pantalla inalámbrica e Inicio original del equipo. Si falta alguna, usá las
teclas del control.

En Foco, se abre una ventana del fabricante y el foco se mueve con izquierda y derecha. Esto
nunca se probó en un equipo real.

## 11. Claude, si lo querés usar

1. Sacá una clave en console.anthropic.com. Cada pedido se cobra en esa cuenta.
2. En el celular, entrá a la pestaña Claude, abrí Clave de la API, pegala y elegí Guardar la
   clave. Queda cifrada en el proyector.
3. Escribí un pedido y elegí Preguntar. La respuesta sale en la pared, y también en el celular.

### Hablarle

En la pestaña Claude hay un botón grande. Se le habla ahí mismo, sin abrir otra página:

1. **La primera vez dice «Activar el micrófono».** El navegador solo presta el micrófono a una
   página segura, y la del proyector lleva un certificado propio. Tocá el botón: en esa misma
   pestaña aparece el aviso del navegador. En iPhone, Mostrar detalles y después «visitar este
   sitio web». En Android, Configuración avanzada y el enlace para continuar. Se hace una sola
   vez por celular: después, al entrar a Claude, la página pasa sola a la versión segura.
2. **Tocá Hablar y decí el pedido.** Se ve lo que va entendiendo. Lo manda cuando hacés una
   pausa, o cuando tocás de nuevo.
3. **Si el pedido fue hablado, la respuesta también se escucha** en el celular, además de
   salir en la pared. Se apaga con «Respuesta en voz alta».

El iPhone pide permiso para el micrófono y para el reconocimiento de voz, y necesita tener el
dictado activado (Ajustes, General, Teclado). El reconocimiento lo hace el celular y necesita
internet.

**En Chrome de iPhone, o en cualquier navegador que no reconoce la voz,** el botón no pide la
página segura: abre el teclado para dictar con su micrófono. Apple le presta el reconocimiento
de voz solo a Safari, y el dictado del teclado anda en todos. Tocás Hablar, después el
micrófono del teclado, decís el pedido, y se manda solo cuando hacés una pausa. La respuesta
se escucha igual. Debajo queda **Abrir en Safari**, para hablar con un solo toque: abre esta
misma página ahí, ya en Claude (desde iOS 17; en los anteriores, Copiar el enlace y pegarlo).

Si algo falla, la página dice qué pasó y qué tocar, con una línea en letra chica que sirve
para avisarnos. Escribir el pedido sigue andando siempre.

### Que use las apps

Hace falta Control total, el mismo permiso del paso 7. Con eso podés pedirle cosas como estas:

- «Abrí YouTube y buscá música para programar.»
- «Abrí Netflix, buscá Matrix y dale reproducir.»
- Con una película puesta: «pausá», «subí el volumen», «volvé al inicio».
- «Armá una trivia de fútbol argentino.»

En la pared se ve un puntero que va adonde toca, y un renglón con lo que está haciendo. Cada
toque tarda unos segundos, porque es un pedido a la API. Para frenarlo, elegí Detener en el
celular, o Atrás en la pantalla de Claude.

No compra, no paga, no cambia cuentas y no escribe contraseñas: si para seguir hace falta
iniciar sesión, te lo pide. Tampoco toca instalaciones, permisos ni los ajustes del sistema. Para manejar una app lee lo
que hay en esa pantalla y lo manda a la API de Anthropic. Se apaga en Claude, Ajustes, Manejar
otras apps.

## 12. La juntada

1. En el proyector, entrá a Juntada. Si el celular estaba apagado, elegí Activar.
2. Cada invitado escanea el código de esa pantalla y pone su nombre. No instalan nada. Entra
   cuando lo dejás pasar: desde tu celular, o en la pared con el control (paso 7). Cada celular
   invitado es una sola persona: no puede sumar otro nombre para votar dos veces.
3. **Trivia.** Elegí Armar una trivia y un tema, o pedísela a Claude. Las preguntas salen en la
   pared, cada uno responde en su celular, y responder rápido vale más. Los puntos aparecen
   cuando la pregunta cierra: antes, nadie sabe si acertó.
4. **Votación.** Cualquiera la arma desde su celular, en Votación. Hay atajos para «Sí o no»,
   «Del 1 al 5» y «La mejor demo». Puede cerrarse sola a un tiempo, y puede ser con voto
   secreto: se ve cuántos votaron, y qué eligieron recién al cerrar. Si hay empate, quien la
   armó puede desempatar al azar. Si nadie votó, no hay ganador.
5. **Cuentas.** Cada uno anota lo que pagó y entre quiénes se reparte. La pared muestra quién le
   paga a quién para quedar a mano. Quedan guardadas aunque apagues el proyector.
6. Al terminar, elegí Empezar de cero: borra todo, saca a los invitados y el código viejo deja
   de servir.

En la trivia, desde tu celular se elige el tema, cuántas preguntas, la dificultad y cuánto dura
cada una. Acertar seguido suma una racha, y la última pregunta vale doble.

### Presentaciones

Para una muestra de demos, la juntada tiene una fila. Está en la pestaña Demos de cada celular.

1. Cada uno se anota con el título de lo que va a mostrar. Elige entre mandar un archivo (PDF,
   imagen o video) o mostrar su propia pantalla.
2. El archivo se manda antes, desde el celular, y queda guardado para ese turno. Si dos mandan
   a la vez, entran de a uno y en orden de llegada: el segundo espera y no se pisan. Nada se
   abre en la pared hasta que le toque a cada uno. Se puede cambiar el archivo hasta que
   empiece el turno; después, la pared sigue con el que tenía. Si sacás a alguien de la fila
   mientras está mandando, la subida se corta y pasa el que esperaba.
3. Vos decidís el orden y le das el turno a cada uno: desde tu celular, o en la pared con
   «Empezar la que sigue». En «Ajustes de la fila» se pone un tiempo por presentación y se
   cierra la fila para que no se anote nadie más.
4. **Con alguien en escena, la pared es suya.** Pasa las páginas, pausa el video, señala con el
   dedo y pone la imagen en negro desde su celular. Los invitados con control no pueden tocar
   nada hasta que termine. Vos sí, por si hay que ayudar.
5. Quien muestra su pantalla elige por dónde entra: «Sin cable» abre la app que recibe la
   pantalla, y «Por HDMI» pasa a esa entrada. Aparece lo que el equipo tenga.
6. Al terminar hay medio minuto de aplausos, y cada uno vota del 1 al 5. Cumplido el tiempo,
   la pared avisa y no corta a nadie.
7. Cuando presentaron todos, la pared muestra el podio. Si empatan en votos, definen los
   aplausos.

## Actualizar

Esto se hace una sola vez. Las versiones siguientes se instalan desde el proyector:
**Ajustes → Buscar actualizaciones**, o la fila «Hay una versión nueva» que aparece en la Tienda y
en Ajustes cuando sale una. El proyector tiene que tener internet; si no lo tiene, esa pantalla
ofrece abrir el wifi.

Android pide confirmar la instalación y la app se reinicia sola. Las apps, los ajustes, los
celulares emparejados y la clave de Claude quedan como estaban.

Si dice que la firma no coincide, esa copia no es una versión oficial (o es la 1.3.0, anterior a la
clave de firma). Instalá la última de [Releases](https://github.com/valentinogalfre/galfredev-OS/releases/latest)
a mano una vez: desinstalá la anterior y seguí el paso 3.

## Camino con ADB, solo si hace falta

Sirve para fijar el inicio o dar Control total si tu equipo no trae esas pantallas. Hace falta la
Mac, en la misma red. **Hacelo todo de una vez y sin apagar el proyector.**

1. En galfredev OS, entrá a Ajustes, Sistema, Información del equipo, y apretá OK siete veces
   sobre Compilación, o Build.
2. Volvé, entrá a Opciones de desarrollador y activá Depuración USB. Desde ahora no apagues el
   proyector. Mientras esté prendida, cualquiera en tu red puede entrar al equipo sin clave.
3. Buscá la IP del proyector en la pantalla Celular.
4. En la Terminal de la Mac, con la IP de tu proyector:

   ```sh
   export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools"
   adb connect 192.168.0.50:5555
   ```

5. Mandá lo que te falte.

   Para la pantalla de inicio:

   ```sh
   adb shell cmd package set-home-activity ar.vale.projectorlauncher/.LauncherActivity
   ```

   Para Control total:

   ```sh
   adb shell settings put secure enabled_accessibility_services ar.vale.projectorlauncher/ar.vale.projectorlauncher.remote.RemoteAccessibility
   adb shell settings put secure accessibility_enabled 1
   ```

6. Apagá la depuración desde la Mac. Este paso es el que cuida el Wi-Fi. Son los comandos que usó
   el dueño del Chowa P8. El último corta la conexión, y es lo esperado:

   ```sh
   adb root
   adb connect 192.168.0.50:5555
   adb shell setprop persist.sys.usb.config none
   adb shell setprop persist.sys.usb.123456789.func none
   adb shell settings put global adb_enabled 0
   ```

7. Recién ahora apagá y prendé el proyector.
8. Comprobá que el Wi-Fi volvió y que el celular se conecta.

### Si te quedaste sin Wi-Fi

1. Con el mouse, entrá a galfredev OS, Ajustes, Sistema, Opciones de desarrollador.
2. Apagá Depuración USB.
3. Apagá y prendé el proyector.
4. Si sigue igual, desenchufalo unos minutos.

## Qué mirar la primera vez

Esto nunca se probó en un equipo real. Nos sirve saber:

1. Modelo, versión de Android y resolución. Están en Ajustes, Acerca de.
2. Si las animaciones van fluidas.
3. Si en Ajustes, Proyector, aparecen trapecio, foco y HDMI.
4. Si el temporizador apaga la imagen.
5. Si el celular se conecta por Wi-Fi y el trackpad responde rápido.
6. Qué pasa con Netflix: si abre, si se ve bien o de costado.

## Si algo falla

| Qué pasa | Qué hacer |
|---|---|
| Se fue el Wi-Fi o el Bluetooth después de reiniciar | Seguí [Si te quedaste sin Wi-Fi](#si-te-quedaste-sin-wi-fi) |
| App no instalada o error de análisis | Copiá de nuevo el APK |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Hay una versión compilada en otra máquina. Desinstalala e instalá otra vez |
| Inicio no abre galfredev OS | Falta terminar la configuración inicial, o el equipo fuerza su inicio. Abrila desde la lista de apps |
| El QR no abre la página | Comprobá que el celular esté en el mismo Wi-Fi y sin datos móviles. Evitá la red de invitados |
| «Para manejar otras apps, activá el control total…» | Falta el paso de Control total, o se apagó |
| «Esto se confirma con el control, en el proyector.» | Es una instalación: confirmala con el control |
| Aurora muestra un error largo en inglés («Attempt to invoke virtual method…») | Falta terminar su configuración. Abrila desde la pestaña Apps y completá los pasos |
| Una app no es compatible | No tiene versión para este equipo |
| La imagen queda de costado | La app pide pantalla vertical. En Android 9 no tenemos cómo evitarlo: usá un dispositivo por HDMI |
| El toque no hace nada en una app | Probá Flechas |
| `adb connect` no conecta | Revisá la IP y que estén en la misma red. Apagá y prendé la opción Depuración USB, no el proyector |

## Volver atrás

**Solo dejar de usarla como inicio:** en Ajustes, Proyector, elegí Inicio original del equipo si
aparece, o apretá Inicio y elegí el del fabricante.

**Desinstalar:** en Ajustes, Sistema, Apps del sistema, elegí galfredev OS y Desinstalar. Android
vuelve al inicio del fabricante.

## Otros proyectores

Hace falta Android 8 o más nuevo. Mirá la etiqueta de abajo del equipo y, en sus Ajustes, Acerca
de, anotá el modelo, la versión de Android y la resolución.

| Android | Placa probable | Lo que hay que saber |
|---|---|---|
| 9 | MediaTek MT5862 | Es el Fika P8 y el Chowa P8: seguí la guía de arriba |
| 11 | Allwinner H713 | ADB apagado de fábrica. Es el caso más común, tipo HY300 |
| 12 Go | Rockchip RK3326 | Sin reportes particulares |
| 13 | Amlogic T950S | ADB ya abierto en el puerto 5555 |
| 14 | Allwinner H726 | Algunos fuerzan su propio inicio |

**Si tenés Android 14:** algunos H726 vienen con malware de fábrica (BADBOX). Leé
[este análisis](https://github.com/det-peralta/hy300pro-badbox-audit/blob/main/FINDINGS.md) antes
de escribir contraseñas importantes en el equipo.

**No deshabilites apps del sistema.** Sobre todo `com.htc.closedialog`, que apaga el equipo si
recalienta. El resto de lo que no hay que tocar está en [`proyectores.md`](proyectores.md).

En estos equipos cambian estos pasos:

- **Instalar.** Abrí el APK con el explorador de archivos del equipo. Si no trae, activá ADB en
  Ajustes, Acerca de, y Opciones de desarrollador, y mandalo con
  `adb install -r ~/Desktop/galfredev-os.apk`. Aceptá el aviso que sale en el proyector.
- **Permisos.** Si aparece Dar acceso a todos los archivos, elegilo también. Si esa pantalla no
  existe, por ADB:

  ```sh
  adb shell appops set ar.vale.projectorlauncher MANAGE_EXTERNAL_STORAGE allow
  ```

- **Control total en Android 13 o más nuevo.** Si dice que es un ajuste restringido, entrá a
  Ajustes, Apps, galfredev OS, y en el menú de tres puntos elegí Permitir ajustes restringidos.
  Por ADB:

  ```sh
  adb shell appops set ar.vale.projectorlauncher ACCESS_RESTRICTED_SETTINGS allow
  ```

- **Toques.** En Android 11 sin pantalla táctil, el toque se hace sobre las vistas que la app
  expone. Si una parte no responde, probá Flechas.
- **Imagen girada, en Android 11.** La app de celular puede pedir pantalla vertical. En el
  emulador se resolvió con `adb shell cmd window set-fix-to-user-rotation enabled`, y se vuelve
  atrás con `default`. En Android 9 ese comando no existe.
- **Netflix por Aurora.** En un emulador con Android 11 se instaló y abrió, y se cerró sola a los
  10 segundos, también con nuestro permiso apagado. Usuarios de HY300 Pro reportan Netflix a 540p,
  Prime Video a 480p, Disney+ a 720p y Apple TV+ sin funcionar.
