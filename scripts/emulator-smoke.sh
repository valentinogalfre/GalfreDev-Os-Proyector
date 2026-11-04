#!/usr/bin/env bash
# Prueba de humo de Galfré Projector OS en un emulador (lo corre el CI).
# Uso: emulator-smoke.sh <apk> <carpeta-de-capturas>
# Instala la app, la recorre con teclas del control remoto (D-pad), saca una
# captura por pantalla y termina con error si la app se cerró sola (crash).
set -u

APK="$1"
OUT="$2"
PKG="ar.vale.projectorlauncher"
mkdir -p "$OUT"

shot() { sleep "${2:-3}"; adb exec-out screencap -p > "$OUT/$1.png"; echo "captura: $1"; }
key() { adb shell input keyevent "$1"; sleep 1; }
open() { adb shell am start -W -n "$PKG/.$1" "${@:2}" > /dev/null; }

echo "== Preparando el emulador"
adb root > /dev/null 2>&1   # permite abrir pantallas internas de la app directamente
sleep 3
adb wait-for-device
adb install -r -g "$APK"
adb shell appops set "$PKG" MANAGE_EXTERNAL_STORAGE allow || true
adb shell cmd package set-home-activity "$PKG/.LauncherActivity" || true

echo "== Cargando archivos de ejemplo (carpetas + imagen)"
python3 - "$OUT/../muestra.png" <<'PY'
import struct, sys, zlib
w, h = 1280, 720
rows = bytearray()
for y in range(h):
    rows.append(0)
    for x in range(w):
        t = x / (w - 1)
        rows += bytes((int(0x7C + (0x22 - 0x7C) * t), int(0x5C + (0xD3 - 0x5C) * t), int(0xFF + (0xEE - 0xFF) * t)))
def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) \
    + chunk(b"IDAT", zlib.compress(bytes(rows), 6)) + chunk(b"IEND", b"")
open(sys.argv[1], "wb").write(png)
PY
adb shell mkdir -p /sdcard/Movies /sdcard/Music /sdcard/Pictures/Vacaciones
adb push "$OUT/../muestra.png" /sdcard/Pictures/Vacaciones/playa.png > /dev/null

adb logcat -c

echo "== Inicio"
open LauncherActivity
shot 01-inicio 6
key KEYCODE_DPAD_DOWN
shot 02-inicio-foco-modulos 1
key KEYCODE_DPAD_RIGHT
shot 03-inicio-foco-ajustes 1
for _ in 1 2 3 4; do key KEYCODE_DPAD_DOWN; done
shot 04-inicio-foco-grilla 1

echo "== Multimedia"
open FileBrowserActivity
shot 10-archivos-origenes
key KEYCODE_DPAD_CENTER
shot 11-archivos-memoria-interna
open PlayerActivity --es path /sdcard/Pictures/Vacaciones/playa.png --es kind IMAGE
shot 12-reproductor-imagen
key KEYCODE_BACK

echo "== Centro de ajustes"
open SettingsHubActivity
shot 20-centro-de-ajustes
key KEYCODE_DPAD_RIGHT
shot 21-centro-de-ajustes-foco 1

echo "== Mis apps"
open AppHubActivity
shot 30-mis-apps 5

echo "== Instalar APK"
open FileBrowserActivity --es mode apk
shot 40-instalar-apk

echo "== Ajustes del launcher"
open SettingsActivity
shot 50-ajustes-launcher

echo "== Revisando cierres inesperados"
adb logcat -d > "$OUT/logcat.txt"
adb logcat -d -b crash > "$OUT/crashes.txt" 2>/dev/null || true
if grep -q "$PKG" "$OUT/crashes.txt"; then
  echo "LA APP SE CERRÓ SOLA. Detalle:"
  cat "$OUT/crashes.txt"
  exit 1
fi
echo "OK: ninguna pantalla se cerró sola."
