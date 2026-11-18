# Cómo sumarte

galfredev OS es de todos. Podés arreglar algo, mejorar una pantalla, sumar una app a la
Tienda o, lo que más queremos, **agregar un juego nuevo**. No hace falta pedir permiso: hacé un
fork, probá tu idea y mandá un pull request.

## Antes de arrancar

- Si es algo grande (un juego, una pantalla nueva, un cambio en cómo se conecta el celular),
  abrí primero un issue con la plantilla «Idea o juego nuevo». Así no trabajás dos veces sobre
  algo que otro ya está haciendo.
- Si es un arreglo chico, mandá el pull request directo.
- Las conversaciones pueden ser en español o en inglés.

## Preparar el entorno

Hace falta:

- JDK 17 y el Android SDK con la plataforma 35 (Android Studio ya trae los dos).
- Node 20 o más nuevo, solo si vas a tocar los juegos (`game/`).
- Python 3, solo para los scripts de `scripts/`.

```sh
git clone https://github.com/valentinogalfre/galfredev-OS.git
cd galfredev-OS
./gradlew assembleDebug testDebugUnitTest lintDebug
```

El APK queda en `app/build/outputs/apk/debug/`. Cómo instalarlo en un proyector está en
[`docs/instalar.md`](docs/instalar.md). No hace falta tener un proyector: el emulador de
Android TV sirve para casi todo, y los juegos se prueban enteros en la compu (ver abajo).

## Los juegos

El paso a paso para sumar uno está en [`docs/juegos.md`](docs/juegos.md). Para jugar los que
ya están en el navegador de tu compu, con varias pestañas como si fueran celulares:

```sh
cd game && npm ci && npm run build && cd ..
scripts/juegos-en-la-compu.sh
```

El script imprime la dirección de la pared y la de los celulares.

## Las reglas de la casa

Son pocas y existen por algo:

1. **Sin AndroidX ni librerías pesadas en la app.** Solo el framework y Kotlin. Estos
   proyectores tienen 1 GB de RAM y tienen que arrancar rápido.
2. **Todo se maneja con el control remoto.** Si agregás una pantalla, tiene que poder usarse
   solo con flechas, OK y Atrás.
3. **Una sola cinta por pantalla.** La cinta (el resaltado ámbar) es el foco: nunca indica un
   estado y arriba de ella solo va carbón. Las reglas de la marca están en el README.
4. **Tests de contrato.** Cada test dice qué promesa cuida («si pasa X, tiene que pasar Y») y
   falla cuando esa promesa se rompe. Si arreglás un error, sumá el test que lo hubiera
   atrapado.
5. **Nada de secretos en el repo.** Ni claves de API, ni keystores, ni datos personales. La
   clave de Claude la carga cada usuario en su equipo y nunca sale de ahí.
6. **Textos en español rioplatense**, con voseo, cortos y claros. Si la app algún día se
   traduce, va a ser con recursos de Android, no mezclando idiomas.
7. **Los recursos de terceros llevan su licencia.** Si sumás un modelo 3D, un sonido o una
   tipografía, tiene que ser libre (CC0, CC BY, OFL o parecida) y va anotado en
   `game/CREDITS.md` o en `app/src/main/assets/licenses`.

## El pull request

- Una idea por pull request. Si son dos cosas, mejor dos.
- Antes de mandarlo, corré `./gradlew testDebugUnitTest lintDebug`, y `npm test` y
  `npm run check` dentro de `game/` si tocaste los juegos. El CI corre lo mismo y además
  recorre la app en un emulador de TV.
- Si tocaste los juegos, corré `npm run pack` para copiar la versión compilada adentro de la
  app (`app/src/main/assets/carrera/`) y sumá esos archivos al commit: así el APK se arma solo
  con Gradle.
- Contá qué cambia para quien usa el proyector y cómo lo probaste. Si se ve, sumá una captura
  o un video corto.

## Si encontrás un problema de seguridad

No abras un issue público. Seguí [`SECURITY.md`](SECURITY.md).

Al participar aceptás el [código de convivencia](CODE_OF_CONDUCT.md).
