# Créditos

## Auto

`src/assets/car.glb` deriva de **Car Concept**, del repositorio
[glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept)
de Khronos Group, publicado bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Ese modelo parte a su vez de un modelo de dominio público de Unity Fan.

Cambios hechos acá: se quitaron el interior y las piezas chicas, se redujo la malla a unos
19 mil triángulos, se unieron las piezas por material y quedó una sola textura de oclusión.
El paso está en `tools/car/build.mjs` y se repite con el `CarConcept.glb` original al lado:

```sh
cd tools/car && npm install && npm run build
```
