import * as THREE from 'three';
import { rng } from '../world/noise';
import { DROP, envFrom, ground, skyDome } from '../world/scenery';
import { grid, label, roadTexture, stripes } from '../world/textures';
import { embankment, place, ribbon } from '../world/track';
import type { Stage, Theme } from './theme';

const CARBON = 0x111111, HUESO = 0xf1ede6, CINTA = 0xe4a32b;

/** La lámina de construcción del manual hecha pista: carbón, hueso y una sola cinta. */
export const cinta: Theme = {
  name: 'Cinta',
  exposure: 1.0,
  trail: CINTA,
  cars: [
    { paint: HUESO, accent: CARBON },
    { paint: 0x2a2a28, accent: HUESO },
    { paint: 0x8d8a84, accent: CARBON },
    { paint: HUESO, accent: CARBON },
    { paint: 0x3a3a37, accent: HUESO },
    { paint: 0xc9c4ba, accent: CARBON },
  ],
  build({ scene, track, anisotropy }: Stage): THREE.Scene {
    scene.fog = new THREE.Fog(0x141413, 120, 640);
    const sky = skyDome({ top: 0x0b0b0b, horizon: 0x1d1d1c, ground: 0x111111, curve: 0.6 });
    scene.add(sky);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1b1b1a, 0.7));
    const key = new THREE.DirectionalLight(0xfff4e0, 3.2);
    key.position.set(-70, 60, 50);
    scene.add(key);

    scene.add(new THREE.Mesh(
      ribbon(track, track.half, 0, -track.half, 0),
      new THREE.MeshStandardMaterial({ map: roadTexture({ base: 0x262624, grain: 0.03, edge: HUESO, dash: 0x8d8a84, period: 32, width: track.half * 2 }, anisotropy), roughness: 0.92, envMapIntensity: 0.4 }),
    ));
    // Un filete listado a cada lado, como la regla de la lámina.
    const rule = new THREE.MeshBasicMaterial({ map: stripes(HUESO, CARBON, 4) });
    scene.add(new THREE.Mesh(ribbon(track, track.half + 1, 0.02, track.half + 0.2, 0.02), rule));
    scene.add(new THREE.Mesh(ribbon(track, -track.half - 0.2, 0.02, -track.half - 1, 0.02), rule));
    const paper = new THREE.MeshLambertMaterial({ color: 0x1b1b1a });
    scene.add(embankment(track, paper, new THREE.MeshLambertMaterial({ color: 0x262624 }), 1.6, 1.62, DROP + 0.6));

    const land = ground(track, {
      center: [25, 120], size: 1700, segments: 110, relief: 0, flat: 20, scale: 0.01, seed: 2,
      material: new THREE.MeshLambertMaterial({ map: grid(0x1b1b1a, 0x55534d, anisotropy) }),
    });
    scene.add(land.mesh);

    // Volúmenes de hueso y carbón sobre la cuadrícula, más altos lejos de la pista.
    const rand = rng(77);
    const dummy = new THREE.Object3D();
    const block = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    const blocks = new THREE.InstancedMesh(block, new THREE.MeshLambertMaterial(), 190);
    const tint = new THREE.Color();
    let placed = 0;
    while (placed < 190) {
      const x = Math.round((25 + (rand() - 0.5) * 900) / 10) * 10, z = Math.round((120 + (rand() - 0.5) * 900) / 10) * 10;
      const d = land.distanceAt(x, z);
      if (d < track.half + 16) continue;
      const w = 10 * (1 + Math.floor(rand() * 2)), l = 10 * (1 + Math.floor(rand() * 3));
      dummy.position.set(x, land.heightAt(x, z) - 0.5, z);
      dummy.scale.set(w, 3 + rand() * rand() * Math.min(110, d * 0.9), l);
      dummy.updateMatrix();
      blocks.setMatrixAt(placed, dummy.matrix);
      blocks.setColorAt(placed, tint.set(rand() < 0.4 ? HUESO : rand() < 0.5 ? 0x6a6862 : 0x3a3a37));
      placed++;
    }
    scene.add(blocks);

    // Las guías de la lámina: círculos de construcción dibujados en el piso.
    const guides: number[] = [];
    for (const [cx, cz, r] of [[25, 120, 90], [25, 120, 190], [150, 70, 60], [-110, 170, 75], [25, 120, 320]]) {
      for (let k = 0; k < 160; k++) {
        const a = (k / 160) * Math.PI * 2, b = ((k + 1) / 160) * Math.PI * 2;
        const ax = cx + Math.cos(a) * r, az = cz + Math.sin(a) * r, bx = cx + Math.cos(b) * r, bz = cz + Math.sin(b) * r;
        guides.push(ax, land.heightAt(ax, az) + 0.2, az, bx, land.heightAt(bx, bz) + 0.2, bz);
      }
    }
    const lines = new THREE.BufferGeometry();
    lines.setAttribute('position', new THREE.Float32BufferAttribute(guides, 3));
    scene.add(new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ color: 0xb9b4aa, transparent: true, opacity: 0.6 })));

    // Los sectores, rotulados en el asfalto con la tipografía de la marca.
    const sectors = 8;
    for (let k = 0; k < sectors; k++) {
      const mark = new THREE.Mesh(
        new THREE.PlaneGeometry(9, 9).rotateX(-Math.PI / 2).rotateY(Math.PI),
        new THREE.MeshBasicMaterial({ map: label(String(k + 1).padStart(2, '0'), HUESO, null, 256, 256), transparent: true, opacity: 0.85, depthWrite: false }),
      );
      place(track, (k / sectors) * track.length + 40, 0, mark);
      mark.position.y += 0.03;
      scene.add(mark);
    }

    return envFrom(skyDome({ top: 0xa09d94, horizon: 0x2a2a28, ground: 0x0c0c0c, curve: 0.8 }), [[0xffffff, 0, 70, 0, 120]]);
  },
  leader(car: THREE.Group): void {
    // La única cinta de la pantalla va con el que lidera.
    const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: label('1  VALE', CARBON, CINTA), fog: false }));
    tag.scale.set(3.6, 0.9, 1);
    tag.position.y = 2.3;
    car.add(tag);
  },
};
