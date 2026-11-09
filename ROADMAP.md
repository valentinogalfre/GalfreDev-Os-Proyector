# Plan

## Dónde estamos

El sistema está completo y probado en emulador, con Android 9 y 11 y pantallas de 720p y 1080p.
**Falta probarlo en un proyector real.** Eso es lo primero. El equipo es un Fika P8.

## En el primer proyector

Por orden, y con [`docs/instalar.md`](docs/instalar.md) y
[`docs/proyectores.md`](docs/proyectores.md) a mano. No reiniciar con Depuración USB activada.

1. Instalar por pendrive, sin tocar el inicio del fabricante, y recorrer todas las pantallas.
2. Fijar el inicio con el selector de Android, apagar y prender. Comprobar que el Wi-Fi sigue.
3. Medir si las animaciones completas aguantan. `ui/Motion.kt` decide solo a partir de lo
   que mide en el arranque, pero ese umbral nunca se comparó con un equipo real.
4. Comprobar que `device/Functions.kt` encuentra trapecio, foco y HDMI en ese firmware, y que
   la app del fabricante acepta el aviso de foco desde una app.
5. Probar el temporizador: `lockNow()` probablemente apaga la lámpara, sin confirmar.
6. Probar el celular por Wi-Fi de verdad. En el emulador fue por un túnel de adb. Medir si
   el trackpad responde rápido.
7. Usar Claude con una clave real. Hasta ahora solo habló con un servidor de mentira.
8. Probar el Netflix que trae el equipo con el Trackpad. En los emuladores se mata sola a los
   pocos segundos, con y sin nuestro permiso. Falta ver si se queda abierta, si se puede entrar a
   la cuenta, si se ve derecha y con qué calidad.
9. Probar si Aurora Store actualiza Disney+ y las otras que piden actualizarse.

## Lo nuevo, que también falta ver en el equipo

Se probó en emulador con Android 9 y con un Claude de mentira. Ninguna de estas cosas se vio
todavía en el Fika P8:

1. Que Claude busque y reproduzca en el Netflix del proyector. En el emulador Netflix se cierra
   sola, así que se probó con otras apps. Depende de que Netflix describa sus botones.
2. Cuánto tarda cada paso con la API real. Si es lento, probar Sonnet o Haiku en los ajustes.
3. El botón Hablar en un iPhone: aceptar el certificado, dar los permisos y dictar.
4. Que el equipo pueda crear la clave del certificado. Si no puede, no hay HTTPS y queda el
   micrófono del teclado.
5. La juntada con diez o más celulares a la vez en el Wi-Fi de la casa.
6. Pedir permiso desde un celular de verdad y aprobarlo desde el del dueño y desde la pared.
7. Por qué el reconocimiento de voz del navegador no terminaba en el celular del dueño. La
   página ya no depende de ese aviso, pero no se sabe si ese navegador devuelve palabras.

## Después

- Reproductor: el PDF se dibuja en el hilo de la pantalla, y los subtítulos y los datos del
  video se leen ahí también. Con archivos grandes se nota.
- Cine: listar una carpeta de un pendrive lento se hace en el hilo de la pantalla.
- El tiempo fijo de la cinta al abrir algo (280 ms antes de arrancar) se puede acortar.
- Juntada: una cola de música o de videos que arme la gente desde el celular.
- Que Claude vea la imagen. En Android 11 en adelante un servicio de accesibilidad puede sacar
  capturas; en Android 9, no.

- Firmar las versiones con una clave propia y publicar releases.
- Fijar la firma de las 14 apps del catálogo que todavía no la tienen.
- Resolver las versiones en el CI y publicar un JSON propio, si el catálogo crece. La API
  de GitHub sin autenticar da 60 pedidos por hora.
- Probar en Android 12 en adelante: la pantalla de inicio del sistema (`values-v31`) y las
  flechas por acción global (Android 13).
- Cifrar la conexión con el celular. Hoy es HTTP en la red local.
- Que el token del celular venza solo. Hoy dura hasta que apretás Desconectar.

## Lo que queda afuera

- Una ROM propia: depende de cada placa y no se puede verificar a ciegas.
- Reemplazar trapecio, foco o lámpara: son del firmware.
- Netflix y compañía con buena imagen: exigen equipos certificados. Cine las ofrece por
  Aurora Store, sin promesas, y recomienda un dispositivo por HDMI.
