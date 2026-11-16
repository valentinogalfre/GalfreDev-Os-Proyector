# Créditos

## Auto

`src/assets/car.glb` deriva de **Car Concept**, del repositorio
[glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept)
de Khronos Group, publicado bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Ese modelo parte a su vez de un modelo de dominio público de Unity Fan.

Cambios hechos acá: se quitaron el interior y las piezas chicas, se redujo la malla a unos
46 mil triángulos (17 mil en la versión liviana), se unieron las piezas por material y quedó una sola textura de oclusión.
El paso está en `tools/car/build.mjs` y se repite con el `CarConcept.glb` original al lado:

```sh
cd tools/car && npm install && npm run build
```

## Deportivo y Coupé

`src/assets/car-deportivo.glb` y `src/assets/car-coupe.glb` son los modelos **Sports Car** de
[Quaternius](https://quaternius.com), bajados de poly.pizza
([deportivo](https://poly.pizza/m/1mkmFkAz5v), [coupé](https://poly.pizza/m/OyqKvX9xNh)) y publicados en dominio
público ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)).

Cambios hechos acá: los materiales pasaron a llamarse por lo que son, quedó una sola rueda (de ella el juego saca
dónde van las cuatro) y el auto se llevó al largo del auto de la carrera. El paso está en `tools/car/adaptar.py`:

```sh
python3 tools/car/adaptar.py bajado.glb src/assets/car-deportivo.glb
```

## Sonido

Las grabaciones de `src/assets/sonido.wav` son de freesound.org, en dominio público (CC0 1.0). La lista y cómo
rehacer el archivo están en `tools/sonido/LEEME.md`.
