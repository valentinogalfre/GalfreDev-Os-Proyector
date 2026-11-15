// Copia la carrera ya compilada adentro del launcher: el APK se arma solo con Gradle, sin Node.
import { cpSync, rmSync } from 'node:fs';

const target = new URL('../../app/src/main/assets/carrera/', import.meta.url);
rmSync(target, { recursive: true, force: true });
cpSync(new URL('../dist/', import.meta.url), target, { recursive: true });
console.log('carrera copiada a app/src/main/assets/carrera');
