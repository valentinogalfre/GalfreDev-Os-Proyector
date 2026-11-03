# Galfré Launcher

Launcher Android propio, con la identidad de **Galfré Dev**, pensado para las
pantallas Android de proyectores (tipo HY300 y similares) y para cualquier
equipo tipo tablet/caja Android, proyector, etc.).

La idea: reemplazar el "nacho" de fábrica por una pantalla de inicio limpia,
rápida, animada y con personalidad, que abra de un toque tu app principal y
el resto de las apps.

```
>_ Galfré Dev
```

---

## Qué trae

Mapeado uno a uno con lo que buscábamos:

| Objetivo | Cómo lo resuelve |
|---|---|
| **Rápido** | Sin AndroidX ni librerías pesadas: solo framework + Kotlin. APK chico, arranque instantáneo en hardware flojo. |
| **Mejores conexiones** | Estado de **Wi-Fi / datos / sin conexión** y **batería** en vivo en el encabezado. |
| **Mejores atajos** | Fila de accesos directos: Wi-Fi, Bluetooth, Pantalla, Sonido, Ajustes del sistema y Ajustes del launcher. |
| **Automatizaciones** | **Abrir la app principal al encender** (arranca directo en tu app). Botón "atrás" neutralizado para no salir del inicio. |
| **Que recuerde las cosas** | **App principal**, **favoritos** y **conteo de uso** persisten entre reinicios (`SharedPreferences`). |
| **Único / estético / animado** | Paleta violeta→cian de Galfré Dev, resplandor animado, baldosas con entrada escalonada y animación de pulsado, ícono adaptativo `>_`. |

Funciones clave:

- **Hero de app principal**: tarjeta grande con degradado que abre tu app principal de un toque.
- **Grilla de apps** con búsqueda en vivo, favoritos (★) y orden por uso o alfabético.
- **Mantené apretada** cualquier app → fijar como principal, favorito, info o desinstalar.
- **Aviso inteligente**: si Galfré todavía no es la pantalla de inicio, aparece un chip que lleva directo a elegirlo.

---

## Identidad de marca (Galfré Dev)

Definida en `app/src/main/res/values/colors.xml` — cambiás un color y se
propaga a toda la app:

| Token | Color | Uso |
|---|---|---|
| `accent` | `#7C5CFF` (violeta) | Marca, bordes activos, degradados |
| `accent2` | `#22D3EE` (cian) | Acentos, tagline, estado |
| `bg_top`/`bg_bottom` | `#0B0B12`→`#15151F` | Fondo degradado |
| `surface` | `#1C1C28` | Baldosas y tarjetas |

La marca `>_` (prompt de terminal, guiño "Dev") es el ícono de la app y el
logo del encabezado. El wordmark dice **Galfré · Launcher by Galfré Dev**.

> Si más gente lo usa, tu marca viaja con el equipo. 💜

---

## Requisitos para compilar

- **Android Studio** (Ladybug o más nuevo) — es el camino recomendado.
- O, por línea de comandos: **JDK 17**, **Android SDK** con **Platform 35** y
  **Build-Tools 35**, y la variable `ANDROID_HOME` apuntando al SDK.

> ⚠️ **Por qué el APK no se construyó en la sesión de la nube:** el contenedor
> no tiene el Android SDK y su red bloquea los servidores de Google
> (`dl.google.com` / Maven de Android), de donde se bajan el Android Gradle
> Plugin y las plataformas. Por eso el repo trae el **código fuente completo y
> listo**, y la compilación se hace en tu PC (que sí llega a esos servidores).

---

## Compilar

### Opción A — Android Studio (recomendado)

1. Abrí Android Studio → **Open** → elegí la carpeta `projector-launcher/`.
2. Dejá que sincronice Gradle (baja AGP 8.10.1, Kotlin 2.1.21 y el SDK 35 solo).
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
4. El APK queda en `app/build/outputs/apk/debug/app-debug.apk`.

### Opción B — Terminal

```bash
cd projector-launcher
./gradlew assembleDebug
```

APK de depuración: `app/build/outputs/apk/debug/app-debug.apk`
Para una versión firmada y optimizada: `./gradlew assembleRelease` (configurá
tu `keystore` antes).

---

## Instalar en la máquina / equipo

1. Activá en el equipo: **Ajustes → Sobre el dispositivo → tocá "Número de compilación" 7 veces** (habilita Opciones de desarrollador) → **Depuración por USB**.
2. Conectá el equipo a tu PC por USB y:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Si no tenés PC a mano, copiá el `app-debug.apk` al equipo (USB/pendrive/nube) y
abrilo desde un explorador de archivos para instalarlo (hay que permitir
"instalar apps de orígenes desconocidos").

---

## Ponerlo como pantalla de inicio

Al presionar el botón de inicio, elegí **Galfré Launcher** y tocá **Siempre**.
Si tu equipo no muestra ese diálogo:

```bash
adb shell cmd package set-home-activity ar.vale.projectorlauncher/.LauncherActivity
```

o desde la app: el chip **"Poné Galfré como pantalla de inicio"** te lleva
directo a la pantalla correcta del sistema.

---

## Configurar

Abrí **Ajustes del launcher** (ícono `>_` en la fila de atajos):

- **App principal** → elegí tu app principal (o manténela apretada en la grilla → "Fijar como app principal").
- **Abrir la app principal al encender** → arranca directo en tu app.
- **Ordenar por uso** → lo más usado primero.

---

## Estructura

```
projector-launcher/
├─ app/
│  ├─ build.gradle.kts            # minSdk 26, compileSdk 35, sin AndroidX
│  └─ src/main/
│     ├─ AndroidManifest.xml      # LauncherActivity como HOME + BootReceiver
│     ├─ java/ar/vale/projectorlauncher/
│     │  ├─ LauncherActivity.kt   # pantalla de inicio (reloj, hero, grilla…)
│     │  ├─ SettingsActivity.kt   # ajustes
│     │  ├─ AppRepository.kt      # lee apps lanzables del sistema
│     │  ├─ AppTileAdapter.kt     # baldosas de la grilla
│     │  ├─ Prefs.kt              # memoria (principal, favoritos, uso)
│     │  ├─ BootReceiver.kt       # automatización al encender
│     │  └─ AppInfo.kt
│     └─ res/                     # paleta, layouts, drawables, ícono, animaciones
├─ build.gradle.kts
├─ settings.gradle.kts
└─ gradle/ (wrapper 8.14.3)
```

---

## Notas sobre el hardware de los proyectores

- Muchas de estas pantallas corren Android viejo y con poca RAM: por eso el
  launcher es deliberadamente liviano (sin AndroidX, sin imágenes pesadas,
  animaciones baratas).
- Este launcher **solo cambia la pantalla de inicio**; no toca ni depende del
  app principal: la abre como abriría cualquier otra app.
- Si el equipo bloquea cambiar el launcher (algunos vienen "candadeados"),
  revisá si permite Opciones de desarrollador o instalar apps externas antes de
  comprar/modificar.

---

## Ideas para próximas versiones

- Reloj grande / modo "ambient" cuando está inactivo.
- Carpetas y páginas de apps.
- Fondo de pantalla configurable (con el degradado de marca por defecto).
- Perfil de kiosko real (bloquear a una sola app con PIN para el mostrador).
- Widget de clima / selector de entradas (HDMI/USB).

---

_Galfré Dev · Launcher v0.1.0_
