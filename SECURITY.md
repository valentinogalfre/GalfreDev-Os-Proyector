# Seguridad

## Cómo reportar un problema

Si encontrás una vulnerabilidad, **no abras un issue público**. Reportala por privado desde
[Security Advisories](https://github.com/valentinogalfre/galfredev-OS/security/advisories/new)
de este repositorio.

Contá qué encontraste, cómo se reproduce y qué podría hacer alguien con eso. Vas a tener una
respuesta en unos días. Cuando esté arreglado, si querés, te damos el crédito en la versión.

## Qué cubre

Lo que más importa cuidar:

- El servidor que corre en el proyector y atiende al celular (`app/.../remote/`): emparejado,
  invitados, permisos y lo que un invitado puede o no puede hacer.
- La sala de los juegos (`app/.../carrera/`): que un celular no pueda hacerse pasar por la
  pared ni por otro jugador.
- La clave de Claude (`app/.../claude/KeyVault.kt`): que no salga del equipo.
- La Tienda: que una app se baje de su fuente oficial y se compruebe antes de instalarla.

## Lo que ya sabemos

Estas limitaciones están a la vista y no son vulnerabilidades nuevas:

- La conexión con el celular es HTTP dentro de la red local, sin cifrar. Hay que usarla en una
  red de confianza.
- La versión por HTTPS existe para el micrófono y el sensor de inclinación, y su certificado no
  lo avala ninguna autoridad.
- La sala de los juegos deja entrar a cualquiera que tenga el código del QR mientras el juego
  está abierto en la pared.
