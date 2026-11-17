import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { wordmark } from '../world/brand';
import { rng } from '../world/noise';
import { along, billboard, gantry } from '../world/props';
import { DROP, ground, skyDome } from '../world/scenery';
import { grid, label, roadTexture, stripes } from '../world/textures';
import { embankment, place, ribbon } from '../world/track';
import type { Stage, Theme, World } from './theme';

const CARBON = 0x111111, HUESO = 0xf1ede6, CINTA = 0xe4a32b, GRIS = 0xa19c92;
const MONO = '500 "Geist Mono"';

/** La lámina de construcción del manual hecha maqueta: carbón, hueso y una sola cinta. */
export const cinta: Theme = {
  name: 'Cinta',
  exposure: 1.0,
  // Una ese larga que entra dos veces al medio de la lámina, y la recta de abajo para llegar lanzado.
  layout: [
    [0, 0, 0], [180, 0, 0], [250, 0, 35], [258, 0, 110], [205, 0, 150], [135, 0, 118], [78, 0, 150], [75, 0, 215], [140, 0, 245],
    [215, 0, 232], [262, 0, 265], [240, 0, 318], [150, 0, 325], [40, 0, 312], [-60, 0, 300], [-112, 0, 235], [-88, 0, 165],
    [-122, 0, 95], [-75, 0, 12],
  ],
  half: 7,
  wall: 7.1,
  start: 900,
  // Una rampa en cada recta, con su empuje, y un empuje más en el medio de la ese.
  pads: [
    { kind: 'ramp', at: 0.025, lane: 0 }, { kind: 'boost', at: 0.065, lane: -0.6 }, { kind: 'boost', at: 0.33, lane: 0 },
    { kind: 'boost', at: 0.59, lane: 0.6 }, { kind: 'ramp', at: 0.63, lane: 0 },
  ],
  grade: { bloom: [0.2, 0.6, 1.1], vignette: 0.55, speed: 0.11 },
  trail: CINTA,
  cars: [
    { paint: 0xd9d5cc, accent: CARBON },
    { paint: 0x242422, accent: HUESO },
    { paint: 0x8d8a84, accent: CARBON },
    { paint: 0xd9d5cc, accent: CARBON },
    { paint: 0x3a3a37, accent: HUESO },
    { paint: 0xb9b4aa, accent: CARBON },
  ],
  build({ scene, track, anisotropy, fine }: Stage): World {
    scene.fog = new THREE.FogExp2(0x2a2927, 0.0015);
    const sky = skyDome({ top: 0x141413, horizon: 0x55524c, ground: 0x1b1b1a, curve: 0.5, gain: 1.15 });
    scene.add(sky);
    scene.add(new THREE.HemisphereLight(0xfffaf0, 0x2e2d2b, 0.75));
    const key = new THREE.DirectionalLight(0xfff1dc, 3.6);
    key.position.set(-0.62, 0.46, 0.6);
    scene.add(key);

    const h = track.half;
    scene.add(new THREE.Mesh(
      ribbon(track, h, 0, -h, 0),
      new THREE.MeshStandardMaterial({ map: roadTexture({ base: 0x2b2b29, grain: 0.035, edge: HUESO, dash: 0x8d8a84, period: 32, width: h * 2 }, anisotropy), roughness: 0.9, envMapIntensity: 0.35 }),
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
      center: track.center, size: 2400, segments: 60, relief: 0, flat: 20, scale: 0.01, seed: 2,
      material: new THREE.MeshLambertMaterial({ map: grid(0x2c2c2a, 0x74716a, anisotropy) }),
    });
    scene.add(land.mesh);
    const floor = -DROP;

    // Arbolitos de maqueta: una bola de hueso sobre un palito, en fila a los dos lados.
    const tree = mergeGeometries([new THREE.CylinderGeometry(0.1, 0.1, 6.5, 5).toNonIndexed().translate(0, 3.25 + floor, 0), new THREE.IcosahedronGeometry(2, 1).translate(0, 7.6 + floor, 0)])!;
    tree.computeVertexNormals();
    const clay = new THREE.MeshLambertMaterial({ color: 0xbdb8ae, flatShading: true });
    for (const side of [1, -1]) {
      const row = along(track, tree, clay, 18, side * (h + 8), undefined, side > 0 ? 0 : 9);
      row.castShadow = true;
      scene.add(row);
    }

    // Manzanas de volúmenes: hueso casi todos, algunos grises. Cada uno lleva sus aristas en tinta.
    const rand = rng(77);
    const dummy = new THREE.Object3D(), tint = new THREE.Color(), ink = new THREE.Color();
    const block = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    const blocks = new THREE.InstancedMesh(block, new THREE.MeshStandardMaterial({ roughness: 0.95 }), 1500);
    const edges: number[] = [], edgeColors: number[] = [];
    const corner = new THREE.Vector3();
    const BOX = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    let placed = 0;
    const volume = (x: number, y: number, z: number, w: number, tall: number, l: number, color: number) => {
      dummy.position.set(x, y, z);
      dummy.scale.set(w, tall, l);
      dummy.updateMatrix();
      blocks.setMatrixAt(placed, dummy.matrix);
      blocks.setColorAt(placed++, tint.set(color).multiplyScalar(0.9 + rand() * 0.1));
      ink.set(color === 0xe6e2d9 ? 0x55524c : 0xcfcabf);
      for (const [a, b] of BOX) for (const v of [a, b]) {
        corner.set(x + ((v & 1) - 0.5) * (w + 0.06), y + (v & 2 ? tall + 0.03 : 0), z + ((v & 4 ? 1 : 0) - 0.5) * (l + 0.06));
        edges.push(corner.x, corner.y, corner.z);
        edgeColors.push(ink.r, ink.g, ink.b);
      }
    };
    const blocksOut = fine ? 9 : 6;
    for (let gx = -blocksOut; gx <= blocksOut; gx++) for (let gz = -blocksOut; gz <= blocksOut; gz++) {
      const bx = track.center[0] + gx * 44, bz = track.center[1] + gz * 44;
      const pieces = 1 + Math.floor(rand() * 3);
      for (let k = 0; k < pieces; k++) {
        const w = 8 + Math.floor(rand() * 3) * 6, l = 8 + Math.floor(rand() * 3) * 6;
        const x = bx + (rand() - 0.5) * (34 - w), z = bz + (rand() - 0.5) * (34 - l);
        const d = land.distanceAt(x, z);
        if (d < h + 14 + Math.max(w, l) * 0.7) continue;
        const pick = rand();
        const color = pick < 0.72 ? 0xe6e2d9 : pick < 0.9 ? 0x8d8a84 : 0x3a3a37;
        const tall = 4 + rand() * rand() * Math.min(120, 10 + d * 0.5);
        volume(x, floor, z, w, tall, l, color);
        // Las torres se escalonan: uno o dos cuerpos más angostos arriba.
        let top = floor + tall, sw = w, sl = l;
        for (let step = 0; step < 2 && tall > 22 && rand() < 0.6; step++) {
          sw *= 0.62;
          sl *= 0.62;
          const extra = tall * (0.2 + rand() * 0.25);
          volume(x, top, z, sw, extra, sl, color);
          top += extra;
        }
      }
    }
    blocks.count = placed;
    blocks.castShadow = true;
    scene.add(blocks);
    const outline = new THREE.BufferGeometry();
    outline.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
    outline.setAttribute('color', new THREE.Float32BufferAttribute(edgeColors, 3));
    scene.add(new THREE.LineSegments(outline, new THREE.LineBasicMaterial({ vertexColors: true })));

    // Las guías de la lámina: círculos de construcción y cotas en mono, dibujados en el piso.
    const guides: number[] = [];
    const [ox, oz] = track.center;
    const circles: [number, number, number][] = [[ox, oz, 90], [ox, oz, 210], [ox + 120, oz - 60, 60], [ox - 130, oz + 50, 75], [ox, oz, 360]];
    for (const [cx, cz, r] of circles) {
      for (let k = 0; k < 160; k++) {
        const a = (k / 160) * Math.PI * 2, b = ((k + 1) / 160) * Math.PI * 2;
        guides.push(cx + Math.cos(a) * r, floor + 0.2, cz + Math.sin(a) * r, cx + Math.cos(b) * r, floor + 0.2, cz + Math.sin(b) * r);
      }
      guides.push(cx - 4, floor + 0.2, cz, cx + 4, floor + 0.2, cz, cx, floor + 0.2, cz - 4, cx, floor + 0.2, cz + 4);
    }
    const lines = new THREE.BufferGeometry();
    lines.setAttribute('position', new THREE.Float32BufferAttribute(guides, 3));
    scene.add(new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ color: 0xb9b4aa, transparent: true, opacity: 0.6 })));

    // Los sectores, rotulados en el asfalto como números de lámina.
    const sectors = 8;
    for (let k = 0; k < sectors; k++) {
      const mark = new THREE.Mesh(
        new THREE.PlaneGeometry(9, 9).rotateX(-Math.PI / 2).rotateY(Math.PI),
        new THREE.MeshBasicMaterial({ map: label(String(k + 1).padStart(2, '0'), HUESO, null, 256, 256), transparent: true, opacity: 0.85, depthWrite: false }),
      );
      place(track, (k / sectors) * track.length + 90, 0, mark);
      mark.position.y += 0.03;
      scene.add(mark);
      const note = new THREE.Mesh(
        new THREE.PlaneGeometry(14, 2.2).rotateX(-Math.PI / 2).rotateY(Math.PI),
        new THREE.MeshBasicMaterial({ map: label(`SECTOR ${String(k + 1).padStart(2, '0')} · ${Math.round((k / sectors) * track.length + 90)} M`, GRIS, null, 512, 80, MONO), transparent: true, depthWrite: false }),
      );
      place(track, (k / sectors) * track.length + 90, h + 12, note);
      note.position.y = floor + 0.25;
      scene.add(note);
    }

    // La marca: el pórtico de largada, un muro liso sobre la recta y el wordmark pintado en la mesa.
    scene.add(gantry(track, 0, CARBON, HUESO));
    const mural = billboard(64, HUESO, CARBON);
    place(track, 95, -(h + 30), mural);
    mural.rotateY(-Math.PI / 2);
    mural.position.y = floor + 10;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(64, 20, 3).translate(0, 0, 1.6), new THREE.MeshStandardMaterial({ color: 0x1b1b1a, roughness: 0.9 }));
    slab.castShadow = true;
    mural.add(slab);
    scene.add(mural);
    const painted = new THREE.Mesh(new THREE.PlaneGeometry(150, 30).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: wordmark(HUESO, null, 2048, 410, 0.94), transparent: true, depthWrite: false }));
    place(track, 95, h + 46, painted);
    painted.rotateY(Math.PI / 2);
    painted.position.y = floor + 0.22;
    scene.add(painted);

    // La mesa de la maqueta es lisa y oscura: devuelve los volúmenes como un acrílico.
    const table = new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2).translate(ox, 0, oz);
    return { sun: key, shadowRange: 110, mirrors: [{ flat: table, y: floor + 0.05, look: { strength: 0.75, blur: 0.012 } }] };
  },
};
