#!/usr/bin/env bash
# Instala una versión nueva de galfredev OS en el proyector por Wi-Fi, en una sola tanda.
# Uso: scripts/actualizar.sh <IP-del-proyector> [apk]
#
# Se corre ANTES de activar Depuración USB: espera a que el proyector acepte la conexión, instala,
# deja galfredev OS como inicio, vuelve a dar Control total y apaga la depuración. En el Fika P8
# arrancar con la depuración prendida deja el equipo sin Wi-Fi: por eso se apaga desde acá
# (docs/instalar.md, paso 6) y no se reinicia nada.
set -u

IP="${1:?Falta la IP del proyector, por ejemplo: scripts/actualizar.sh 192.168.0.50}"
HERE="$(cd "$(dirname "$0")" && pwd)"
APK="${2:-$HERE/../app/build/outputs/apk/debug/app-debug.apk}"
ADB="${ADB:-$HOME/Library/Android/sdk/platform-tools/adb}"
DEV="$IP:5555"
PKG="ar.vale.projectorlauncher"
A11Y="$PKG/$PKG.remote.RemoteAccessibility"
WAIT=600

[ -f "$APK" ] || { echo "No encuentro el APK: $APK"; exit 1; }
online() { [ "$("$ADB" -s "$DEV" get-state 2>/dev/null)" = device ]; }
sh_() { "$ADB" -s "$DEV" shell "$@"; }

echo "Esperando al proyector en $DEV. Activá Depuración USB ahora (hasta $((WAIT / 60)) minutos)."
for _ in $(seq 1 "$WAIT"); do
  "$ADB" connect "$DEV" > /dev/null 2>&1
  online && break
  sleep 1
done
online || { echo "El proyector no aceptó la conexión. Revisá la IP y que esté en la misma red."; exit 1; }
START=$(date +%s)
echo "Conectado: $(sh_ getprop ro.product.model | tr -d '\r'), Android $(sh_ getprop ro.build.version.release | tr -d '\r')"

FAILED=0
if "$ADB" -s "$DEV" install -r "$APK"; then
  sh_ cmd package set-home-activity "$PKG/.LauncherActivity" > /dev/null
  # Reinstalar apaga el servicio de accesibilidad: sin esto se pierde el manejo de otras apps.
  sh_ settings put secure enabled_accessibility_services "$A11Y"
  sh_ settings put secure accessibility_enabled 1
  sh_ am start -a android.intent.action.MAIN -c android.intent.category.HOME > /dev/null
  echo "Instalado: versión $(sh_ dumpsys package "$PKG" | grep -m1 versionName | tr -d ' \r')"
  echo "Control total: $(sh_ settings get secure enabled_accessibility_services | tr -d '\r')"
  # Solo se mira si hay una clave guardada: está cifrada, y su contenido no se muestra ni se copia.
  case "$(sh_ run-as "$PKG" cat shared_prefs/gd_claude.xml 2>&1)" in
    *'name="key"'*) echo "Clave de Claude: cargada" ;;
    *'<map'*|*'No such file'*) echo "Clave de Claude: no hay ninguna guardada (se carga en Ajustes o desde tu celular)" ;;
    *) echo "Clave de Claude: no se pudo comprobar desde acá (se ve en Ajustes, en Claude)" ;;
  esac
else
  echo "FALLÓ la instalación. Igual apago la depuración."
  FAILED=1
fi

echo "Apagando la depuración (la conexión se corta al final, es lo esperado)."
"$ADB" -s "$DEV" root > /dev/null 2>&1
sleep 2
"$ADB" connect "$DEV" > /dev/null 2>&1
sh_ setprop persist.sys.usb.config none
sh_ setprop persist.sys.usb.123456789.func none
sh_ settings put global adb_enabled 0
"$ADB" disconnect "$DEV" > /dev/null 2>&1
echo "Listo en $(( $(date +%s) - START )) segundos. No reinicies si ves la depuración prendida: apagala primero."
exit "$FAILED"
