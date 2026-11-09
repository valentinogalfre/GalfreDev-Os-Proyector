# Notas de firmware de los proyectores

Investigación del 2026-11-06, a partir de reportes públicos y análisis de terceros.
**Nada de esto se comprobó en un equipo real.** Sirve para no romper nada la primera
vez que probemos en uno.

## No hacer

Estas cosas pueden dañar el equipo, dejarlo sin red o dejarlo inseguro:

- **No reiniciar un Chowa P8 con Depuración USB activada.** Su Wi-Fi y su Bluetooth van por
  un módulo AIC8800 conectado por USB interno (`Mstar-ehci-1`). Si el equipo arranca con la
  depuración prendida, los dos dejan de funcionar. La salida está en
  [`instalar.md`](instalar.md#si-te-quedaste-sin-wi-fi).
- **No dejar ADB abierto en un Chowa P8.** Con `ro.adb.secure=0`, cualquiera en la red entra
  sin aviso y con root.
- **No deshabilitar `com.htc.closedialog`.** Ese paquete corta el equipo por
  sobretemperatura. Por eso está en la lista negra de `device/Functions.kt`.
- **No leer `/sys/class/prj/bl_duty`.** La lectura cuelga el equipo y lo reinicia.
- **No usar el daemon `qw` del HY310.** Corre como root y es una vulnerabilidad.

Algunos H726 vienen infectados con BADBOX:
<https://github.com/det-peralta/hy300pro-badbox-audit/blob/main/FINDINGS.md>.

## Equipos

| Placa | Android | RAM | Notas |
|---|---|---|---|
| MediaTek MT5862 | 9 (API 28) | 1 GB | Fika P8 y Chowa P8. Firmware de TV, [ver abajo](#fika-p8-y-chowa-p8) |
| Allwinner H713 | 11 (API 30) | 1 GB | Mali-G31 MP2, 8 GB de eMMC |
| Allwinner H726 | 14 | ~1 GB | Algunos fuerzan el launcher `magcubicos` |
| Amlogic T950S | 13 | | ADB abierto en el puerto 5555 |
| Rockchip RK3326 | 12 Go | | |

- H713 y H726 tienen software de 32 bits y reportan `low_ram=true`.
- Los datos de identidad del sistema mienten: se detecta por paquete instalado.
- Los 720p reportan 1280×720 a 240 dpi. HY310, H713 HY320, HY350 y L018 son 1080p.

## Fika P8 y Chowa P8

Los datos del firmware vienen del
[proyecto del dueño de un Chowa P8](https://github.com/aguara-guazu/-chowa-p8-virtual-remote).
Es una sola unidad, y el Fika P8 puede diferir: la tienda lo vende como versión mejorada del
Chowa. Usamos sus datos, no su código, porque ese repositorio no tiene licencia.

- `product=mt5862_bga_1g`, Android 9, `userdebug`, `ro.debuggable=1`, `ro.adb.secure=0`.
  `adb root` funciona y `/system` se puede escribir. No lo tocamos.
- El inicio de fábrica es `com.zeasn.whale.open.launcher.technical` y no da acceso a los
  ajustes de Android. Por eso `SystemScreens` ofrece Información del equipo y Opciones de
  desarrollador.
- Los ajustes son `com.android.tv.settings`, con actividades propias como
  `.uicustom.func.net.wireless.WifiActivity` y `.trapezoid.TrapezoidActivity`.
- El trapecio también está en `com.example.trapezoid/.MainActivity`.
- El foco es motorizado. El aviso `com.rjpj.intent.action.focus.show` muestra una ventana de
  `com.rjpj.function`, y las flechas lo mueven. Él lo manda desde el shell: falta comprobar
  que lo acepte desde una app.
- Las entradas son `com.mediatek.wwtv.tvcenter`, la pantalla inalámbrica es
  `com.ionitech.airscreen` y la tienda es `zeasn.open.technical.tv.store.ruijiang.mtk9255`.
- Trae YouTube, Spotify, Prime Video y Pluto TV en versión de TV, entre otras. Compradores
  cuentan que Netflix viene en versión de celular, y que Disney+ pide actualizarse y no deja.
- `input text` rechaza acentos y ñ. Nuestro Escribir usa la accesibilidad y no tiene ese límite.

Probado el 2026-11-06 en un emulador con Android 9, sin pantalla táctil, con paquetes vacíos
que llevan esos nombres: Ajustes encuentra las cinco funciones. El firmware real no se probó.

## Instalar como pantalla de inicio

```sh
adb install app-debug.apk
adb shell cmd package set-home-activity ar.vale.projectorlauncher/.LauncherActivity
```

- Ese comando sobrevive al reinicio.
- El inicio se ignora hasta que `user_setup_complete=1` y `device_provisioned=1`.
- Hay que dejar habilitado el launcher del fabricante: es la salida si algo falla.
- En H713 el ADB viene apagado y no hay `adb root`.
- Los equipos rechazan los APK firmados solo con v2: el nuestro lleva también v1.
- En Android 9, un inicio nuevo hace que el sistema pregunte al apretar Inicio. El botón Siempre
  no se alcanza con el control, porque el foco se queda en la lista. Con mouse funciona.

El paso a paso para una persona está en [`instalar.md`](instalar.md).

## Permisos

- La pantalla de acceso a todos los archivos suele existir solo en
  `com.android.settings`. En HY300 funciona por ADB:
  `adb shell appops set ar.vale.projectorlauncher MANAGE_EXTERNAL_STORAGE allow`.
- `ACTION_SETTINGS` muchas veces no resuelve y `SOUND_SETTINGS` cierra el sistema.
  Por eso `device/SystemScreens.kt` prueba cada pantalla antes de ofrecerla.
- `launcherapps` no existe en H726. `AppRepository` no depende de ese servicio.
- En Android 13 o más nuevo, un APK instalado desde un archivo tiene la accesibilidad
  restringida hasta permitirla a mano. Por ADB no pasa. Sin comprobar en estos equipos.

## Comportamientos que condicionan el diseño

- El micrófono está en el control Bluetooth y no siempre llega a las apps.
- El H726 se apaga solo por inactividad: la pared se dispara desde la app.
- `lockNow()` probablemente apaga la lámpara. Sin probar.
- Sin pantalla táctil, Android acepta `dispatchGesture` pero lo cancela sin hacer nada.
  Comprobado en emulador con `hw.screen=no-touch`. Por eso `RemoteAccessibility` cae en
  `ACTION_CLICK` y `ACTION_SCROLL_*`. Probar siempre en un AVD sin táctil. Con
  `hw.screen=multi-touch` el gesto se hace y el toque pasa una sola vez. `hw.screen=touch` no
  crea el dispositivo: el sistema sigue diciendo `notouch`.
- Si el sistema mata el proceso con otra app delante, no vuelve a levantar el servidor del
  celular. `RemoteAccessibility` lo arranca de nuevo al reconectarse.

## Animación de arranque del sistema

Una app común no puede cambiarla. Con root:

- `/oem/media/bootanimation.zip` le gana a `/system/media/bootanimation.zip`.
- El logo de la placa está en `/oem/bootlogo.bmp`.
- No sabemos si se puede escribir ahí sin root.

`scripts/brand/build_bootanimation.py` genera el zip con la marca. Instalarlo queda
por tu cuenta y riesgo.
