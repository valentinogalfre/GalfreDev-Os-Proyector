#!/usr/bin/env bash
# Corre la sala de los juegos en tu computadora, con el mismo código que usa el proyector, para jugar la
# carrera y el picadito en el navegador sin tener un proyector. Cada pestaña del navegador es un celular.
#
# Uso: scripts/juegos-en-la-compu.sh [dirección de esta compu en tu red]
#   Sin dirección, todo queda en 127.0.0.1 y se juega solo desde esta compu.
#   Con la dirección (por ejemplo 192.168.0.20), los celulares del mismo wifi entran escaneando el QR.
#
# Hace falta JDK 17, el Android SDK con la plataforma 35 y Node 20 o más nuevo.
set -euo pipefail
cd "$(dirname "$0")/.."
address="${1:-127.0.0.1}"

sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [[ -z "$sdk" && -f local.properties ]]; then sdk="$(sed -n 's/^sdk\.dir=//p' local.properties)"; fi
for guess in "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do if [[ -z "$sdk" && -d "$guess" ]]; then sdk="$guess"; fi; done
export ANDROID_HOME="$sdk"
android_jar="$sdk/platforms/android-35/android.jar"
[[ -f "$android_jar" ]] || { echo "No encuentro $android_jar. Definí ANDROID_HOME o sdk.dir en local.properties." >&2; exit 1; }

if [[ ! -f game/dist/index.html ]]; then
  echo "Compilando los juegos…"
  (cd game && npm ci && npm run build)
fi

echo "Compilando la sala…"
classpath_file="$(mktemp)"
trap 'rm -f "$classpath_file"' EXIT
CPOUT="$classpath_file" ./gradlew -q --init-script scripts/dev/classpath.gradle compileDebugUnitTestKotlin printTestClasspath

classes="app/build/tmp/kotlin-classes/debugUnitTest:app/build/tmp/kotlin-classes/debug"
echo
echo "Abrí PARED o FUTBOL en una pestaña, y VOLANTE o JUGADOR en otras (hasta dos por dirección)."
echo
java="java"; if [[ -n "${JAVA_HOME:-}" ]]; then java="$JAVA_HOME/bin/java"; fi
exec "$java" -cp "$classes:$(cat "$classpath_file"):$android_jar" ar.vale.projectorlauncher.CarreraDevServerKt game/dist "$address"
