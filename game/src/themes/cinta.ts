import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng } from '../world/noise';
import { along } from '../world/props';
import { DROP, envFrom, ground, skyDome } from '../world/scenery';
import { grid, label, roadTexture, stripes } from '../world/textures';
import { embankment, place, ribbon } from '../world/track';
import type { Stage, Theme, World } from './theme';

const CARBON = 0x111111, HUESO = 0xf1ede6, CINTA = 0xe4a32b;

/** La lámina de construcción del manual hecha maqueta: carbón, hueso y una sola cinta. */
export const cinta: Theme = {
  name: 'Cinta',
  exposure: 1.0,
  layout: [
    [0, 0, 0], [180, 0, 0], [250, 1, 40], [250, 3, 120], [180, 4, 160], [100, 4, 160], [60, 5, 200], [60, 6, 270], [0, 5, 310],
    [-70, 4, 290], [-110, 2, 220], [-110, 0, 80], [-70, 0, 10],
  ],
  half: 7,
  start: 40,
  bloom: [0.14, 0.5, 1.4],
  trail: CINTA,
  cars: [
    { paint: 0xd9d5cc, accent: CARBON },
    { paint: 0x242422, accent: HUESO },
    { paint: 0x8d8a84, accent: CARBON },
    { paint: 0xd9d5cc, accent: CINTA },
    { paint: 0x3a3a37, accent: HUESO },
    { paint: 0xb9b4aa, accent: CARBON },
  ],
  build({ scene, track, anisotropy }: Stage): World {
    scene.fog = new THREE.Fog(0x2a2927, 200, 1000);
    const sky = skyDome({ top: 0x121212, horizon: 0x4a4844, ground: 0x1a1a19, curve: 0.45, gain: 1.2 });
    scene.add(sky);
    scene.add(new THREE.HemisphereLight(0xfffaf0, 0x242423, 0.85));
    const key = new THREE.DirectionalLight(0xfff1dc, 3.4);
    key.position.set(-0.62, 0.5, 0.6);
    scene.add(key);

    const h = track.half;
    scene.add(new THREE.Mesh(
      ribbon(track, h, 0, -h, 0),
      new THREE.MeshStandardMaterial({ map: roadTexture({ base: 0x2b2b29, grain: 0.035, edge: HUESO, dash: 0x8d8a84, period: 32, width: h * 2 }, anisotropy), roughness: 0.9, envMapIntensity: 0.4 }),
    ));
    // A cada lado, el filete listado de la regla y un cordón de hueso que hace sombra.
    const rule = new THREE.MeshBasicMaterial({ map: stripes(HUESO, CARBON, 4) });
    const bone = new THREE.MeshStandardMaterial({ color: 0xe6e2d9, roughness: 0.95, side: THREE.DoubleSide });
    for (const side of [1, -1]) {
      scene.add(new THREE.Mesh(ribbon(track, side * (h + (side > 0 ? 1 : 0.2)), 0.02, side * (h + (side > 0 ? 0.2 : 1)), 0.02), rule));
      const face = new THREE.Mesh(ribbon(track, side * (h + 1.2), 0, side * (h + 1.2), 0.5), bone);
      const top = new THREE.Mesh(ribbon(track, side * (h + (side > 0 ? 1.7 : 1.2)), 0.5, side * (h + (side > 0 ? 1.2 : 1.7)), 0.5), bone);
      const back = new THREE.Mesh(ribbon(track, side * (h + 1.7), 0.5, side * (h + 1.7), -0.2), bone);
      face.castShadow = top.castShadow = back.castShadow = true;
      scene.add(face, top, back);
    }
    const paper = new THREE.MeshLambertMaterial({ color: 0x1f1f1e });
    scene.add(embankment(track, paper, new THREE.MeshLambertMaterial({ color: 0x282826 }), 2.4, 2.42, DROP + 0.6));

    const land = ground(track, {
      center: track.center, size: 2200, segments: 110, relief: 0, flat: 20, scale: 0.01, seed: 2,
      material: new THREE.MeshLambertMaterial({ map: grid(0x30302e, 0x7a776f, anisotropy) }),
    });
    scene.add(land.mesh);

    // Arbolitos de maqueta: una bola de hueso sobre un palito, en fila a los dos lados.
    const tree = mergeGeometries([new THREE.CylinderGeometry(0.1, 0.1, 6.5, 5).toNonIndexed().translate(0, 3.25 - DROP, 0), new THREE.IcosahedronGeometry(2, 1).translate(0, 7.6 - DROP, 0)])!;
    tree.computeVertexNormals();
    const clay = new THREE.MeshLambertMaterial({ color: 0xbdb8ae, flatShading: true });
    for (const side of [1, -1]) {
      const row = along(track, tree, clay, 18, side * (h + 8), undefined, side > 0 ? 0 : 9);
      row.castShadow = true;
      scene.add(row);
    }

    // Manzanas de volúmenes: hueso casi todos, algunos grises, más altos lejos de la pista.
    const rand = rng(77);
    const dummy = new THREE.Object3D(), tint = new THREE.Color();
    const block = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    const blocks = new THREE.InstancedMesh(block, new THREE.MeshStandardMaterial({ roughness: 0.95 }), 1100);
    let placed = 0;
    for (let gx = -9; gx <= 9; gx++) for (let gz = -9; gz <= 9; gz++) {
      const bx = track.center[0] + gx * 44, bz = track.center[1] + gz * 44;
      const pieces = 1 + Math.floor(rand() * 3);
      for (let k = 0; k < pieces; k++) {
        const w = 8 + Math.floor(rand() * 3) * 6, l = 8 + Math.floor(rand() * 3) * 6;
        const x = bx + (rand() - 0.5) * (34 - w), z = bz + (rand() - 0.5) * (34 - l);
        const d = land.distanceAt(x, z);
        if (d < h + 14 + Math.max(w, l) * 0.7) continue;
        dummy.position.set(x, land.heightAt(x, z) - 0.5, z);
        dummy.scale.set(w, 4 + rand() * rand() * Math.min(120, 10 + d * 0.5), l);
        dummy.updateMatrix();
        blocks.setMatrixAt(placed, dummy.matrix);
        const pick = rand();
        blocks.setColorAt(placed++, tint.set(pick < 0.72 ? 0xe6e2d9 : pick < 0.9 ? 0x8d8a84 : 0x3a3a37).multiplyScalar(0.9 + rand() * 0.1));
      }
    }
    blocks.count = placed;
    blocks.castShadow = true;
    scene.add(blocks);

    // Las guías de la lámina: círculos de construcción dibujados en el piso.
    const guides: number[] = [];
    const [ox, oz] = track.center;
    for (const [cx, cz, r] of [[ox, oz, 90], [ox, oz, 210], [ox + 120, oz - 60, 60], [ox - 130, oz + 50, 75], [ox, oz, 360]]) {
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
      place(track, (k / sectors) * track.length + 90, 0, mark);
      mark.position.y += 0.03;
      scene.add(mark);
    }

    // El pórtico de largada: dos patas de carbón y un dintel de hueso con el nombre.
    const gate = new THREE.Group();
    const leg = new THREE.MeshStandardMaterial({ color: 0x1a1a19, roughness: 0.8 });
    for (const x of [-h - 2.6, h + 2.6]) gate.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 8.4, 0.7).translate(x, 4.2 - 0.4, 0), leg));
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(h * 2 + 6, 1.9, 0.8).translate(0, 8.2, 0), bone);
    const name = new THREE.Mesh(new THREE.PlaneGeometry(h * 2 + 5, 1.5).rotateY(Math.PI).translate(0, 8.2, -0.42), new THREE.MeshBasicMaterial({ map: label('GALFREDEV · CARRERA', CARBON, null, 1024, 128), transparent: true }));
    gate.add(lintel, name);
    gate.traverse((o) => { o.castShadow = o !== name; });
    place(track, 120, 0, gate);
    scene.add(gate);

    return { env: envFrom(skyDome({ top: 0xa09d94, horizon: 0x2a2a28, ground: 0x0c0c0c, curve: 0.8 }), [[0xffffff, 0, 70, 0, 120]]), sun: key, shadowRange: 110 };
  },
  leader(car: THREE.Group): void {
    // La única cinta de la pantalla va con el que lidera.
    const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: label('1  VALE', CARBON, CINTA), fog: false }));
    tag.scale.set(3.6, 0.9, 1);
    tag.position.y = 2.5;
    car.add(tag);
  },
};
