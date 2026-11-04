# Galfré Projector OS — Roadmap

Software completo para proyector Android (tipo HY300 y similares), con la
identidad de **Galfré Dev** y pensado 100% para **control remoto (D-pad)**.

No es una ROM ni reemplaza el firmware: es un **conjunto de apps Android**
propias que cubren la experiencia que ve y usa la persona.

## Módulos

| # | Módulo | Estado |
|---|--------|--------|
| 1 | **Launcher / home** — pantalla de inicio, grilla de apps, favoritos, app principal, arranque al encender | ✅ Hecho |
| 2 | **Reproductor + archivos** — explorar USB/memoria y reproducir video, música e imágenes | 🔍 Hecho, en revisión |
| 3 | **Centro de ajustes + red** — panel propio con accesos a wifi, pantalla, sonido, hora, etc. + estado de red e IP | 🔍 Hecho, en revisión |
| 4 | **Hub de streaming + favoritos** — accesos grandes a las apps instaladas | ⏳ Pendiente |
| 5 | **Instalador de APKs (sideload)** — instalar apps desde USB sin Play Store | ⏳ Pendiente |

## Límites honestos (lo que una app normal NO puede hacer)

- **Keystone, foco, brillo de lámpara, ventilador**: son del sistema del
  fabricante (HAL/firmware). Una app común no los controla.
- **Espejo de pantalla (Miracast) y cambio de entrada HDMI/AV**: casi siempre
  vendor/sistema. Se puede intentar con atajos (intents conocidos) sin garantía.
- **Reemplazar el firmware / ROM propia**: fuera de alcance (específico del
  chip, riesgoso, no verificable a ciegas).

## Decisiones técnicas

- **Sin AndroidX** (framework puro) para que sea liviano en hardware flojo.
  El reproductor v1 usa `VideoView`/`MediaPlayer` del sistema (reproduce los
  formatos que soporte el equipo). Media3/ExoPlayer queda como upgrade futuro si
  hiciera falta más compatibilidad de códecs.
- **Un solo APK** con varias `Activity` (home, archivos, reproductor, ajustes,
  hub, instalador). Menos cosas que instalar y mantener.
- **Acceso a archivos**: en Android 11+ se pide "acceso a todos los archivos"
  (MANAGE_EXTERNAL_STORAGE, como cualquier gestor de archivos); en versiones
  anteriores, READ_EXTERNAL_STORAGE.
- **Navegación**: todo enfocable por D-pad, con foco visible (borde de acento).

## Orden de construcción

1. ✅ Launcher (listo, con D-pad).
2. 🔍 Reproductor + archivos (hecho, en revisión).
3. 🔍 Centro de ajustes + red (hecho, en revisión).
4. Hub de streaming.
5. Instalador de APKs.

Cada módulo entra como un commit propio al PR, pasa una autorevisión y queda
documentado acá.

---

_Galfré Dev · Projector OS_
