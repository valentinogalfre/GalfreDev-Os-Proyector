# El sonido de la carrera

`src/assets/sonido.wav` es un solo archivo con todas las grabaciones, una detrás de otra, y `src/assets/sonido.ts`
dice dónde empieza y termina cada una. Los dos los escribe `armar.py`; no se editan a mano.

Todas las grabaciones son de freesound.org y están en dominio público (CC0), así que pueden ir dentro del APK sin
atribución. Igual quedan anotadas, para poder rehacer el archivo:

| Archivo | Qué es | Sonido | Autor |
|---|---|---|---|
| `dyno.wav` | Motor: un auto subiendo de vueltas en banco de pruebas | [496171](https://freesound.org/s/496171/) | editboy2 |
| `614627.wav` | Gomas chillando | [614627](https://freesound.org/s/614627/) | johnnydekk |
| `341069.wav` | Banquina: camino de ripio | [341069](https://freesound.org/s/341069/) | seth-m |
| `332056.wav` | Golpe corto | [332056](https://freesound.org/s/332056/) | qubodup |
| `332058.wav` | Golpe mediano | [332058](https://freesound.org/s/332058/) | qubodup |
| `592388.wav` | Choque fuerte, con vidrios | [592388](https://freesound.org/s/592388/) | magnuswaker |
| `404333.wav` | Nitro | [404333](https://freesound.org/s/404333/) | strexet |

Para rehacerlo: bajar cada sonido, pasarlo a mono a 22050 Hz con el nombre de la tabla
(`ffmpeg -i bajado.mp3 -ac 1 -ar 22050 dyno.wav`) y correr, con numpy y scipy instalados:

```sh
python3 tools/sonido/armar.py <carpeta> src/assets/sonido.wav src/assets/sonido.ts
```

La cuenta regresiva y los avisos de vuelta, llegada y elástico no son grabaciones: son tonos, como los de un semáforo
de largada, y los hace `src/audio.ts`.
