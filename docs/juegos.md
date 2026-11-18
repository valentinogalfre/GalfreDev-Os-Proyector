# Sumar un juego

Los juegos de galfredev OS son páginas web. La pared (el proyector) abre una página, cada celular abre
otra, y en el medio está **la sala**: un servidor chiquito dentro del launcher que pasa mensajes de un
lado al otro. Un juego nuevo es, casi entero, un par de páginas en `game/`. La parte de Android se
reduce a unas diez líneas.

Hoy hay dos juegos, y conviene copiar el que más se parezca al tuyo:

| Juego | Pared | Celular | Código |
|---|---|---|---|
| La carrera | `game/index.html` | `game/volante.html` | `game/src/main.ts`, `host/`, `phone/`, `sim/`, `render/` |
| El picadito | `game/futbol.html` | `game/jugador.html` | `game/src/futbol/` |

El picadito es el más corto de leer: `futbol/wall.ts` es la pared, `futbol/phone.ts` el celular,
`futbol/sim.ts` la física y `futbol/protocol.ts` lo que se dicen entre ellos.

## Cómo viajan los mensajes

Todo va como JSON por un WebSocket en `/api/carrera/socket`. La pared usa un puente directo
(`window.CarreraHost`) porque corre en el mismo equipo. `game/src/net/link.ts` ya resuelve los dos
casos y reconecta solo, así que no hace falta tocarlo.

**La pared** se presenta con `{t:'host', secret}`. El secreto le llega en el `#s=` de su dirección,
y solo se acepta desde el mismo equipo. Después puede mandar:

| Mensaje | Qué hace |
|---|---|
| `{t:'all', d:{…}}` | Lo que ven todos: el estado del juego. La sala guarda el último y se lo da a quien entra tarde |
| `{t:'st', d:'texto'}` | Un cuadro de animación, de hasta 1024 caracteres. No se guarda. Sirve para mandar muchos por segundo |
| `{t:'to', id, d:{…}}` | Algo para un solo jugador. Le llega como `{t:'you', d}` |
| `{t:'drop', id}` | Saca a un jugador de la sala |

Recibe `{t:'roster', …}` cada vez que alguien entra o sale, y lo que mandan los celulares.

**Cada celular** se presenta con `{t:'join', room, name, key}`. El código de sala viene en el `#r=` del
QR, y `key` es la clave que le dio la sala la primera vez, para volver a su lugar si se corta el wifi.
Después puede mandar:

| Mensaje | Qué le llega a la pared |
|---|---|
| `{t:'in', s, x, y, b, n, k}` | El control: `s`, `x` e `y` acotados de −1 a 1, y `b`, `n` y `k` como verdadero o falso. Cualquier otro campo se descarta |
| `{t:'cmd', d:{…}}` | Un pedido libre, como «empezar» o «cambiar de cancha». La pared decide si lo acepta |
| `{t:'ping', n}` | Nada: la sala le contesta `{t:'pong', n}` para medir la demora |
| `{t:'leave'}` | Deja su lugar |

Los límites de la sala están en `Carrera.kt`: hasta 8 jugadores, 2 por dirección de red y 90 mensajes
por segundo por celular. Si tu control necesita más que `s, x, y, b, n, k`, usá `cmd` para lo que no es
continuo, o sumá un campo nuevo en `Carrera.kt` con su test.

**La pared manda y los celulares piden.** La física, los puntos y quién gana se calculan solo en la
pared. El celular muestra lo que le llega y manda lo que toca el jugador. Así nadie puede hacer trampa
cambiando su página, y si un celular se cae, el juego sigue.

## Paso a paso

### 1. Las páginas

1. Creá `game/<tujuego>.html` para la pared y `game/<tujuego>-celu.html` para el celular. Copiá
   `futbol.html` y `jugador.html` y cambiales el script.
2. Poné el código en `game/src/<tujuego>/`: como mínimo `wall.ts`, `phone.ts` y `protocol.ts`.
3. Sumá las dos páginas a `rollupOptions.input` en `game/vite.config.ts`.
4. Probalo en la compu (ver abajo) hasta que ande.

Algunas cosas que conviene respetar:

- La pared del proyector es lenta. Apuntá a 30 cuadros por segundo con un WebView de Android 9
  (Chrome 67, por eso `target: 'chrome67'`). Probá con la pestaña limitada a 4× de CPU.
- El celular puede ser cualquiera. Usá botones grandes y que todo entre acostado en 844×390.
- Nada de recursos de internet. El juego se sirve desde el proyector y la red puede no tener salida.
- Si usás un modelo, un sonido o una tipografía de otro, que sea libre y anotalo en `game/CREDITS.md`.

### 2. Los tests

La lógica que no dibuja (física, puntos, reglas) va en un archivo aparte con su `*.test.ts` al lado,
como `futbol/sim.test.ts`. Cada test dice qué promesa cuida, por ejemplo «un gol en contra suma al
rival».

```sh
cd game
npm test          # node --test sobre src/**/*.test.ts
npm run check     # tipos
```

### 3. Meterlo en el APK

```sh
cd game && npm run pack
```

Eso compila y copia todo a `app/src/main/assets/carrera/`. Sumá esos archivos al commit: así el APK se
arma solo con Gradle, sin Node.

### 4. La pantalla en Android

Una pantalla por juego, heredando la de la carrera. Así queda `FutbolActivity.kt`:

```kotlin
class FutbolActivity : CarreraActivity() {
    override val wallPage = "futbol.html"
    override val phonePage = "jugador.html"
    override val offText = R.string.futbol_off
    override val failedText = R.string.carrera_failed
    override val noWebViewText = R.string.futbol_no_webview
}
```

Después:

1. Registrala en `app/src/main/AndroidManifest.xml`, copiando la entrada de `.carrera.FutbolActivity`.
2. Sumá sus textos en `app/src/main/res/values/strings.xml`.
3. Agregá una fila en la sección Juntada de `LauncherActivity.kt`, al lado de «Jugar un picadito»:

   ```kotlin
   panelRow(extra, getString(R.string.home_tujuego_open), null, R.drawable.ic_play) {
       openScreen(Intent(this, TuJuegoActivity::class.java), getString(R.string.home_tujuego_open))
   }
   ```

Con eso el QR de la pared ya lleva a tu página del celular. Quien entra desde la app del celular (la
pestaña Juntada) también llega a tu juego, porque la sala avisa qué página abrió.

```sh
./gradlew testDebugUnitTest lintDebug assembleDebug
```

### 5. El pull request

Contá de qué se trata, cuántos juegan y cómo se controla. Sumá un video corto o capturas de la pared y
del celular, que es lo que más ayuda a revisarlo. Las reglas generales están en
[`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Probar en la compu

No hace falta un proyector. Este script levanta la misma sala del launcher en tu computadora:

```sh
cd game && npm ci && npm run build && cd ..
scripts/juegos-en-la-compu.sh
```

Imprime cuatro direcciones:

- `PARED` y `VOLANTE`, para la carrera.
- `FUTBOL` y `JUGADOR`, para el picadito.

Abrí la pared en una pestaña y el celular en otras. Las herramientas de desarrollo del navegador
simulan un teléfono acostado. La sala deja dos jugadores por dirección, así que para probar con más
abrí las páginas de los celulares también con `[::1]` en lugar de `127.0.0.1`.

Para jugar con celulares de verdad, pasale al script la dirección de tu compu en el wifi:

```sh
scripts/juegos-en-la-compu.sh 192.168.0.20
```

Después de cambiar algo, volvé a correr `npm run build` y recargá. Para probar tu juego con el script,
sumá sus dos direcciones en `app/src/test/.../CarreraDevServer.kt`. Es una línea por página, y ese
archivo es solo para probar.

Si te trabás, abrí un issue con la plantilla «Idea o juego nuevo» y lo vemos.
