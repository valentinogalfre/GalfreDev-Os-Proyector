# Galfré Projector OS

Software completo para **proyectores Android** (tipo HY300 y similares) con la
identidad de **Galfré Dev**, pensado 100% para **control remoto (D-pad)**.

No es una ROM ni toca el firmware: es **un solo APK** con varias pantallas que
reemplazan la experiencia de fábrica por algo limpio, rápido y con personalidad.

```
>_ Galfré Dev
```

---

## Módulos

| Módulo | Qué hace |
|---|---|
| 🏠 **Launcher / inicio** | Reloj, fecha, estado de red y batería, **app principal destacada**, atajos rápidos, buscador, grilla de apps con **favoritos** y **orden por uso**. **Abre tu app principal al encender** el proyector. |
| 🎬 **Multimedia (archivos + reproductor)** | Explora la **memoria interna y pendrives USB**, y reproduce **video, música e imágenes** con el reproductor del sistema. |
| ⚙️ **Centro de ajustes + red** | Accesos grandes a Wi-Fi, Bluetooth, pantalla, sonido, fecha/hora, idioma, almacenamiento, apps, inicio del sistema y más, con el **tipo de conexión y la IP** a la vista. |
| 📺 **Mis apps (hub)** | Baldosas **grandes para ver desde el sillón**, con favoritos y lo más usado primero. OK abre; mantener apretado marca favorito. |
| 📦 **Instalar APK (sideload)** | Instalá apps desde un pendrive o la memoria **sin Play Store**, con el instalador del sistema. |

Todo es liviano a propósito (**sin AndroidX**, solo framework + Kotlin) para que
arranque al toque en el hardware modesto de estos proyectores.

Qué **no** hace (y por qué): keystone, foco, lámpara o cambio de entrada HDMI son
funciones del sistema del fabricante; una app normal no puede controlarlas.
Detalles y plan en [`ROADMAP.md`](ROADMAP.md).

---

## Navegación con el control remoto

- **Flechas** mueven el foco; lo seleccionado se marca con un **borde de acento**.
- **OK** abre la app, la carpeta o el archivo. En el reproductor, **OK = play/pausa**.
- **Mantener OK** sobre una app → fijar como principal, favorito, info o desinstalar.
- **Atrás** en el explorador sube una carpeta; en el inicio no hace nada (es el inicio).
- Al abrir el inicio, el foco arranca en la **app principal**.

---

## Identidad de marca (Galfré Dev)

Definida en `app/src/main/res/values/colors.xml` — cambiás un color y se
propaga a toda la app:

| Token | Color | Uso |
|---|---|---|
| `accent` | `#7C5CFF` (violeta) | Marca, foco, bordes activos, degradados |
| `accent2` | `#22D3EE` (cian) | Acentos, tagline, estado |
| `bg_top`/`bg_bottom` | `#0B0B12`→`#15151F` | Fondo degradado |
| `surface` | `#1C1C28` | Baldosas y tarjetas |

La marca `>_` (prompt de terminal, guiño "Dev") es el ícono de la app y el
logo del encabezado. El wordmark dice **Galfré · Launcher by Galfré Dev**.

> Si más gente lo usa, tu marca viaja con cada proyector. 💜

---

## Requisitos para compilar

- **Android Studio** (Ladybug o más nuevo) — es el camino recomendado.
- O, por línea de comandos: **JDK 17**, **Android SDK** con **Platform 35** y
  **Build-Tools 35**, y la variable `ANDROID_HOME` apuntando al SDK.

> ⚠️ **Por qué el APK no se construyó en la sesión de la nube:** el contenedor
> no tiene el Android SDK y su red bloquea los servidores de Google
> (`dl.google.com` / Maven de Android), de donde se bajan el Android Gradle
> Plugin y las plataformas. Por eso el repo trae el **código fuente completo**
> (validado y con autorevisión), y la compilación se hace en tu PC.

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

## Instalar en el proyector

1. En el proyector: **Ajustes → Acerca del dispositivo → tocá "Número de compilación" 7 veces** (habilita Opciones de desarrollador) → **Depuración por USB**.
2. Conectalo a tu PC por USB y:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Si no tenés PC a mano, copiá el `app-debug.apk` a un pendrive y abrilo desde
el explorador de archivos del proyector (hay que permitir "instalar apps de
orígenes desconocidos").

---

## Ponerlo como pantalla de inicio

Al presionar el botón de inicio del control, elegí **Galfré Launcher** y
**Siempre**. Muchos proyectores **no muestran ese diálogo**; en ese caso:

```bash
adb shell cmd package set-home-activity ar.vale.projectorlauncher/.LauncherActivity
```

o desde la app: el chip **"Poné Galfré como pantalla de inicio"** te lleva a la
pantalla correcta del sistema.

---

## Permisos que va a pedir (una sola vez)

| Cuándo | Permiso | Para qué |
|---|---|---|
| Abrir **Multimedia** | *Acceso a todos los archivos* (Android 11+) o *Almacenamiento* (anteriores) | Leer el pendrive y la memoria, como cualquier gestor de archivos. |
| **Instalar APK** | *Instalar apps desconocidas* | Que el instalador del sistema acepte el `.apk` elegido. |

El estado de red (Wi-Fi/datos/IP) no necesita ubicación ni permisos en runtime.

---

## Configurar

Abrí **Ajustes del launcher** (botón `>_` en la fila de atajos, o desde el
Centro de ajustes → "Galfré Launcher"):

- **App principal** → la app que se abre desde la tarjeta grande (o mantené apretada una app en la grilla → "Fijar como app principal").
- **Abrir la app principal al encender** → el proyector arranca directo en esa app.
- **Ordenar por uso** → lo más usado primero.

---

## Estructura

```
projector-launcher/
├─ ROADMAP.md                     # módulos, estado, límites y decisiones
├─ app/
│  ├─ build.gradle.kts            # minSdk 26, compileSdk 35, sin AndroidX
│  └─ src/main/
│     ├─ AndroidManifest.xml      # HOME, activities, BootReceiver, ApkProvider
│     ├─ java/ar/vale/projectorlauncher/
│     │  ├─ LauncherActivity.kt   # inicio (reloj, hero, módulos, atajos, grilla)
│     │  ├─ SettingsActivity.kt   # ajustes del launcher
│     │  ├─ FileBrowserActivity.kt# explorador USB/memoria (+ modo APK)
│     │  ├─ PlayerActivity.kt     # video / música / imagen
│     │  ├─ SettingsHubActivity.kt# centro de ajustes + red
│     │  ├─ AppHubActivity.kt     # hub de apps (baldosas grandes)
│     │  ├─ ApkProvider.kt        # sirve .apk al instalador (content://)
│     │  ├─ ApkInstaller.kt       # flujo de instalación
│     │  ├─ AppRepository.kt / AppInfo.kt / AppTileAdapter.kt / HubTileAdapter.kt
│     │  ├─ FileItem.kt / FileListAdapter.kt
│     │  ├─ Prefs.kt              # memoria (principal, favoritos, uso, arranque)
│     │  └─ BootReceiver.kt       # automatización al encender
│     └─ res/                     # paleta, layouts, íconos, animaciones, foco D-pad
├─ build.gradle.kts
├─ settings.gradle.kts
└─ gradle/ (wrapper 8.14.3)
```

---

## Notas sobre el hardware de los proyectores

- Muchos corren Android viejo y con poca RAM: por eso todo es liviano (sin
  AndroidX, íconos vectoriales, animaciones baratas).
- El reproductor usa los códecs del equipo: reproduce lo que el proyector
  soporte de fábrica. Si hiciera falta más compatibilidad, el upgrade natural es
  Media3/ExoPlayer (ver `ROADMAP.md`).
- Si el equipo bloquea cambiar el launcher (algunos vienen "candadeados"),
  revisá si permite Opciones de desarrollador o instalar apps externas.

---

## Ideas para próximas versiones

- Modo "ambient" con reloj grande cuando está inactivo.
- Fondo de pantalla configurable (con el degradado de marca por defecto).
- Perfil de kiosko (bloquear a una sola app con PIN).
- Media3/ExoPlayer para más formatos; subtítulos; recordar dónde quedó cada video.
- Atajos a entradas (HDMI/AV) donde el fabricante lo permita.

---

_Galfré Dev · Projector OS_
