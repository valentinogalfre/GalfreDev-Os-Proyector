#!/usr/bin/env bash
# Prueba de humo de galfredev OS en un emulador (la corre el CI).
# Uso: emulator-smoke.sh <apk> <carpeta-de-capturas>
#
# Instala la app, recorre las pantallas con teclas del control remoto y saca una captura de cada
# una. Termina con error si la app se cierra sola o si se rompe alguno de estos contratos:
#   - cada pantalla que se abre es la que se pidió
#   - la cinta marca el foco en el inicio, en las listas y en el teclado
#   - la cinta nunca queda arriba de una foto o un video
set -u

APK="$1"
OUT="$2"
PKG="ar.vale.projectorlauncher"
HERE="$(cd "$(dirname "$0")" && pwd)"
FAILED=0
mkdir -p "$OUT"

fail() { echo "FALLÓ: $1"; FAILED=1; }
shot() { sleep "${2:-3}"; adb exec-out screencap -p > "$OUT/$1.png"; echo "captura: $1"; }
key() { adb shell input keyevent "$1"; sleep 1; }
open() { adb shell am start -n "$PKG/.$1" "${@:2}" > /dev/null; }
cinta() { python3 "$HERE/count_cinta.py" "$OUT/$1.png"; }
on_screen() { adb shell dumpsys activity activities | grep -m1 mResumedActivity; }

expect_screen() {
  on_screen | grep -q "$1" || fail "se esperaba $1 y está: $(on_screen)"
}
expect_tape() {
  [ "$(cinta "$1")" -gt 0 ] || fail "$1: no hay cinta en una pantalla navegable"
}
expect_no_tape() {
  [ "$(cinta "$1")" -eq 0 ] || fail "$1: la cinta tapa lo que se está mirando"
}

echo "== Preparando el emulador"
adb root > /dev/null 2>&1   # permite abrir pantallas internas de la app directamente
sleep 3
adb wait-for-device
adb install -r -g "$APK"
adb shell appops set "$PKG" MANAGE_EXTERNAL_STORAGE allow || true
adb shell cmd package set-home-activity "$PKG/.LauncherActivity" || true

echo "== Cargando una imagen de ejemplo"
python3 - "$OUT/../muestra.png" <<'PY'
import struct, sys, zlib
w, h = 1280, 720
row = bytes([0]) + bytes((0x3A, 0x5F, 0x8F)) * w
def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) \
    + chunk(b"IDAT", zlib.compress(row * h, 6)) + chunk(b"IEND", b"")
open(sys.argv[1], "wb").write(png)
PY
adb shell mkdir -p /sdcard/Pictures/Vacaciones
adb push "$OUT/../muestra.png" /sdcard/Pictures/Vacaciones/playa.png > /dev/null

adb logcat -c

echo "== Inicio"
open LauncherActivity --ez gd.replay_boot true
shot 01-arranque 2
shot 02-inicio 14
expect_screen LauncherActivity
expect_tape 02-inicio
key KEYCODE_DPAD_DOWN
shot 03-inicio-panel 2
expect_tape 03-inicio-panel

echo "== Apps"
open apps.AppsActivity
shot 10-apps 4
expect_screen AppsActivity
expect_tape 10-apps
key KEYCODE_DPAD_CENTER
shot 11-otra-app 1
key KEYCODE_BACK
open apps.AppsActivity
sleep 3

echo "== Teclado"
key KEYCODE_DPAD_UP
key KEYCODE_DPAD_CENTER
shot 12-teclado 2
expect_tape 12-teclado
key KEYCODE_BACK
key KEYCODE_BACK

echo "== Cine y reproductor"
open media.CineActivity
shot 20-cine 3
expect_screen CineActivity
expect_tape 20-cine
open media.PlayerActivity --es path /sdcard/Pictures/Vacaciones/playa.png --es kind IMAGE
shot 21-foto 5
expect_screen PlayerActivity
expect_no_tape 21-foto
key KEYCODE_BACK

echo "== Tienda"
open store.StoreActivity
shot 30-tienda 5
expect_screen StoreActivity
expect_tape 30-tienda

echo "== Claude"
open claude.ClaudeActivity
shot 40-claude 3
expect_screen ClaudeActivity

echo "== Juntada"
open juntada.JuntadaActivity
shot 45-juntada 3
expect_screen JuntadaActivity
expect_tape 45-juntada
key KEYCODE_BACK

echo "== Pared"
open wall.WallActivity
shot 50-pared 3
expect_screen WallActivity
key KEYCODE_BACK

echo "== Celular"
open remote.RemoteActivity
shot 60-celular 3
expect_screen RemoteActivity

echo "== Ajustes"
open SettingsActivity
shot 70-ajustes 3
expect_screen SettingsActivity
expect_tape 70-ajustes
open device.CalibrationActivity
shot 71-calibracion 3
expect_screen CalibrationActivity
key KEYCODE_BACK

echo "== Revisando cierres inesperados"
adb logcat -d > "$OUT/logcat.txt"
adb logcat -d -b crash > "$OUT/crashes.txt" 2>/dev/null || true
if grep -q "$PKG" "$OUT/crashes.txt"; then
  echo "LA APP SE CERRÓ SOLA. Detalle:"
  cat "$OUT/crashes.txt"
  FAILED=1
fi

if [ "$FAILED" -ne 0 ]; then
  echo "La prueba de humo falló."
  exit 1
fi
echo "OK: todas las pantallas abrieron, sin cierres inesperados y con la cinta donde corresponde."
