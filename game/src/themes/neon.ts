import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { glow } from '../world/car';
import { rng } from '../world/noise';
import { along, billboard, gantry } from '../world/props';
import { DROP, ground, skyDome, stars } from '../world/scenery';
import { fade, label, roadTexture, wetTexture, windows } from '../world/textures';
import { embankment, place, ribbon } from '../world/track';
import type { Stage, Theme, World } from './theme';

const CYAN = 0x19e6ff, MAGENTA = 0xff2bd0, VIOLET = 0x7a5cff, AMBER = 0xffa020, RED = 0xff3050;
const CARBON = 0x111111, HUESO = 0xf1ede6;
/** Los letreros de la avenida: texto, tinta y fondo. El de la marca no va acá: ese es un archivo. */
const SIGNS: [string, number, number][] = [
  ['nitro', 0xffffff, MAGENTA], ['cine', CYAN, 0x0a0a12], ['hotel', 0x0a0a12, AMBER], ['24 h', MAGENTA, 0x0a0a12],
  ['arcade', 0xffffff, VIOLET], ['bar', RED, 0x0a0a12], ['ramen', 0x0a0a12, CYAN], ['radio', AMBER, 0x0a0a12],
];
/** Los carteles viales que cruzan la pista. */
const ROUTES = ['Centro  ↑', 'Puerto  ↗', 'Salida 12', 'Costanera  ↑'];

/** Lo que brilla pasa de 1 a propósito: es lo que hace que el resplandor lo encuentre. */
function lit(color: number, gain: number, extra: THREE.MeshBasicMaterialParameters = {}): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(gain), ...extra });
}

/** Ciudad de noche después de la lluvia: asfalto mojado y luces de neón. */
export const neon: Theme = {
  name: 'Neón',
  exposure: 1.1,
  layout: [
    [0, 0, 0], [160, 0, 0], [300, 0, 0], [340, 0, 30], [350, 0, 120], [340, 0, 200], [280, 0, 230], [200, 0, 225], [150, 0, 250],
    [100, 0, 235], [40, 0, 255], [-40, 0, 250], [-110, 0, 235], [-150, 0, 180], [-155, 0, 90], [-140, 0, 25], [-90, 0, 0],
  ],
  half: 8,
  start: 60,
  grade: { bloom: [1.0, 0.72, 0.85], vignette: 0.6, speed: 0.11 },
  night: true,
  spray: { color: 0xa9c6ff, opacity: 0.13, size: 2.6, additive: true },
  cars: [
    { paint: 0x2438d0, accent: MAGENTA, underglow: MAGENTA },
    { paint: 0xd0145a, accent: 0xffffff, underglow: AMBER },
    { paint: 0xe8e8f0, accent: CYAN, underglow: CYAN },
    { paint: 0x14141c, accent: CYAN, underglow: CYAN },
    { paint: 0xd98a1c, accent: 0x111111, underglow: AMBER },
    { paint: 0x13805a, accent: 0xffffff, underglow: 0x30ff9a },
  ],
  build({ scene, track, anisotropy }: Stage): World {
    scene.fog = new THREE.FogExp2(0x1a0d36, 0.0032);
    const sky = skyDome({ top: 0x05030f, horizon: 0x4a1a66, ground: 0x07040f, curve: 0.34, clouds: { dark: 0x0c0820, lit: 0x7a3090, cover: 0.55 } });
    scene.add(sky, stars(400, 4));
    scene.add(new THREE.HemisphereLight(0x8a8cf0, 0x4a1458, 1.5));
    const key = new THREE.DirectionalLight(0xb48cff, 0.9);
    key.position.set(-40, 80, 30);
    scene.add(key);

    const period = 32, h = track.half;
    const wet = wetTexture(period, anisotropy);
    const road = ribbon(track, h, 0, -h, 0);
    scene.add(new THREE.Mesh(road, new THREE.MeshStandardMaterial({
      map: roadTexture({ base: 0x15151c, grain: 0.07, edge: 0xdfe6ff, dash: 0xdfe6ff, period, width: h * 2 }, anisotropy),
      roughnessMap: wet, roughness: 1, metalness: 0, envMapIntensity: 0.22,
    })));

    // Muro bajo con una línea de led arriba y su reflejo pintado sobre la pista mojada.
    const wall = new THREE.MeshStandardMaterial({ color: 0x191922, roughness: 0.55, side: THREE.DoubleSide });
    const smear = fade();
    for (const [side, color] of [[1, CYAN], [-1, MAGENTA]] as [number, number][]) {
      const edge = side * (h + 0.6);
      scene.add(new THREE.Mesh(ribbon(track, edge, 0.95, edge, -0.1), wall));
      scene.add(new THREE.Mesh(ribbon(track, edge, 1.02, edge, 0.9), lit(color, 1.8, { side: THREE.DoubleSide, fog: false })));
      scene.add(new THREE.Mesh(
        ribbon(track, edge, 0.03, edge - side * 2.6, 0.03),
        new THREE.MeshBasicMaterial({ map: smear, color, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      ));
    }
    const concrete = new THREE.MeshStandardMaterial({ color: 0x101016, roughness: 0.7 });
    scene.add(embankment(track, concrete, concrete, 1.2, 3.2, DROP + 0.6));

    const land = ground(track, {
      center: track.center, size: 1700, segments: 90, relief: 0, flat: 20, scale: 0.01, seed: 2,
      material: new THREE.MeshStandardMaterial({ color: 0x0c0c12, roughness: 0.35, metalness: 0.3 }),
    });
    scene.add(land.mesh);

    const dummy = new THREE.Object3D(), tint = new THREE.Color();
    const pool = (count: number, opacity: number) => new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: glow(), transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }), count);
    const steel = new THREE.MeshStandardMaterial({ color: 0x23232c, roughness: 0.5, metalness: 0.6 });

    // Farolas a los dos lados, alternadas, cada una con su charco de luz en el asfalto.
    const every = 64, lamps = Math.floor(track.length / every) * 2;
    const lampPools = pool(lamps, 0.3);
    for (const side of [1, -1]) {
      const reach = -side * 3.4;
      const post = mergeGeometries([
        new THREE.CylinderGeometry(0.1, 0.14, 9, 6).translate(0, 4.5, 0),
        new THREE.BoxGeometry(Math.abs(reach), 0.12, 0.16).translate(reach / 2, 9, 0),
      ])!;
      const phase = side > 0 ? 0 : every / 2, off = side * (h + 1.6);
      scene.add(along(track, post, steel, every, off, undefined, phase));
      scene.add(along(track, new THREE.BoxGeometry(1.1, 0.1, 0.34).translate(reach, 8.92, 0), lit(0xdfeaff, 3, { fog: false }), every, off, undefined, phase));
      for (let k = 0; k < lamps / 2; k++) {
        place(track, k * every + phase, side * (h - 1.8), dummy);
        dummy.position.y += 0.05;
        dummy.scale.set(15, 1, 22);
        dummy.updateMatrix();
        const at = k * 2 + (side > 0 ? 0 : 1);
        lampPools.setMatrixAt(at, dummy.matrix);
        lampPools.setColorAt(at, tint.set(0xbcd0ff));
      }
    }
    scene.add(lampPools);

    // Arcos de neón sobre la pista, alternando color, con su charco de luz debajo.
    const gap = 110, arcs = Math.floor(track.n / gap);
    const frame = new THREE.BoxGeometry(1, 1, 1);
    const beams = new THREE.InstancedMesh(frame, new THREE.MeshBasicMaterial({ fog: false }), arcs * 3);
    const arcPools = pool(arcs, 0.45);
    const span = h + 1.4, top = 9.5;
    for (let a = 0; a < arcs; a++) {
      const i = a * gap + 60;
      const c = track.pos[i], t = track.tan[i], l = track.left[i];
      tint.set(a % 2 ? MAGENTA : CYAN);
      const yaw = Math.atan2(t.x, t.z);
      [[0, top, span * 2 + 0.24, 0.24], [span, top / 2, 0.24, top], [-span, top / 2, 0.24, top]].forEach(([off, y, w, tall], k) => {
        dummy.position.set(c.x + l.x * off, c.y + y, c.z + l.z * off);
        dummy.rotation.set(0, yaw, 0);
        dummy.scale.set(w, tall, 0.24);
        dummy.updateMatrix();
        beams.setMatrixAt(a * 3 + k, dummy.matrix);
        beams.setColorAt(a * 3 + k, tint.clone().multiplyScalar(2.4));
      });
      dummy.position.set(c.x, c.y + 0.04, c.z);
      dummy.scale.set(h * 2.6, 1, 26);
      dummy.updateMatrix();
      arcPools.setMatrixAt(a, dummy.matrix);
      arcPools.setColorAt(a, tint);
    }
    scene.add(beams, arcPools);

    // La largada, con el wordmark en hueso sobre carbón y sin brillo: el logo no lleva efectos.
    scene.add(gantry(track, 150, HUESO, CARBON));
    for (const [s, side] of [[520, 1], [1180, -1]] as [number, number][]) {
      const board = billboard(22, HUESO, CARBON);
      place(track, s, side * (h + 13), board);
      board.rotateY(side * 0.45);
      board.position.y += 10;
      board.add(new THREE.Mesh(mergeGeometries([-7, 7].map((x) => new THREE.BoxGeometry(0.35, 14, 0.35).translate(x, -7.5, 0.3)))!, steel));
      scene.add(board);
    }

    // Letreros verticales de neón al borde de la avenida, de frente al que llega.
    SIGNS.forEach(([text, ink, block], k) => {
      const side = k % 2 ? 1 : -1;
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.4).rotateY(Math.PI), lit(0xffffff, 1.5, { map: label(text, ink, block, 384, 100), fog: false }));
      place(track, (k + 0.2) * (track.length / SIGNS.length), side * (h + 6.5), sign);
      sign.rotateY(side * 0.35);
      sign.rotateZ(Math.PI / 2);
      sign.position.y += 9.5;
      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 17).rotateY(Math.PI / 2).translate(-1.5, 0, 0.3), steel);
      sign.add(mast);
      scene.add(sign);
    });

    // Carteles viales cruzando la pista, y pasarelas vidriadas entre edificios.
    ROUTES.forEach((text, k) => {
      const board = new THREE.Group();
      const s = (k + 0.62) * (track.length / ROUTES.length);
      board.add(new THREE.Mesh(new THREE.BoxGeometry(h * 2 + 5, 0.35, 0.35).translate(0, 8.4, 0), steel));
      for (const x of [-h - 2.4, h + 2.4]) board.add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 9, 0.35).translate(x, 4, 0), steel));
      board.add(new THREE.Mesh(new THREE.PlaneGeometry(8.5, 2.6).rotateY(Math.PI).translate(k % 2 ? 3.2 : -3.2, 6.9, -0.2), lit(0xffffff, 0.8, { map: label(text, 0xeaf2ff, 0x10306a, 384, 118, '500 "Instrument Sans"') })));
      place(track, s, 0, board);
      scene.add(board);
    });
    const bridgeMap = windows(90, 'bands');
    bridgeMap.repeat.set(2.4, 0.11);
    bridgeMap.offset.set(0, 0.02);
    for (const s of [330, 900, 1390]) {
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(h * 2 + 70, 4.2, 5), lit(0xffffff, 1.5, { map: bridgeMap }));
      place(track, s, 0, bridge);
      bridge.position.y += 17;
      scene.add(bridge);
    }

    // Edificios en tres tipos, cada uno con su fachada, fuera del corredor de la pista.
    const rand = rng(31);
    const kinds: [number, number, 'homes' | 'grid' | 'bands'][] = [[22, 34, 'homes'], [26, 80, 'grid'], [30, 150, 'bands']];
    const lots: [number, number, number, number][] = [];
    for (let gx = -22; gx <= 22; gx++) for (let gz = -22; gz <= 22; gz++) {
      const x = track.center[0] + gx * 36 + (rand() - 0.5) * 8, z = track.center[1] + gz * 36 + (rand() - 0.5) * 8;
      const d = land.distanceAt(x, z);
      if (d < h + 28) continue;
      lots.push([x, land.heightAt(x, z), z, rand() < Math.min(0.6, d / 320) ? 2 : rand() < 0.55 ? 1 : 0]);
    }
    const palette = [CYAN, MAGENTA, AMBER, VIOLET, RED];
    const strips = new THREE.InstancedMesh(frame, new THREE.MeshBasicMaterial(), lots.length * 5);
    let stripCount = 0;
    const beacons: number[] = [], beaconColors: number[] = [];
    kinds.forEach(([w, tall, kind], which) => {
      const mine = lots.filter((lot) => lot[3] === which);
      const map = windows(60 + which, kind);
      map.repeat.set(w / 28, tall / 56);
      const box = new THREE.BoxGeometry(w, tall, w).translate(0, tall / 2, 0);
      // El techo no lleva ventanas.
      const uv = box.attributes.uv as THREE.BufferAttribute;
      for (let v = 8; v < 16; v++) uv.setXY(v, 0, 0);
      // Cada edificio puede llevar un segundo cuerpo, más angosto, arriba.
      const mesh = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ map }), mine.length * 2);
      let used = 0;
      mine.forEach(([x, y, z]) => {
        const stretch = 0.7 + rand() * 0.6;
        let height = tall * stretch;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, stretch, 1);
        dummy.updateMatrix();
        tint.setHSL(0.56 + rand() * 0.3, 0.35, 0.72 + rand() * 0.28).multiplyScalar(1.5);
        mesh.setMatrixAt(used, dummy.matrix);
        mesh.setColorAt(used++, tint);
        if (which > 0 && rand() < 0.55) {
          const narrow = 0.5 + rand() * 0.25, extra = 0.18 + rand() * 0.3;
          dummy.position.set(x, y + height, z);
          dummy.scale.set(narrow, extra, narrow);
          dummy.updateMatrix();
          mesh.setMatrixAt(used, dummy.matrix);
          mesh.setColorAt(used++, tint);
          height += tall * extra;
        }
        if (which === 2) {
          // La antena y su baliza.
          dummy.position.set(x, y + height + 7, z);
          dummy.scale.set(0.5, 14, 0.5);
          dummy.updateMatrix();
          strips.setMatrixAt(stripCount, dummy.matrix);
          strips.setColorAt(stripCount++, tint.set(0x30303c));
          beacons.push(x, y + height + 14.5, z);
          beaconColors.push(1, 0.1, 0.1);
        }
        if (rand() < (which === 2 ? 0.6 : 0.35)) {
          // Tubos de neón: en las torres, las cuatro aristas; en lo bajo, un cartel vertical.
          tint.set(palette[Math.floor(rand() * palette.length)]).multiplyScalar(2.2);
          const corners = which === 2 ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[rand() < 0.5 ? 1 : -1, rand() < 0.5 ? 1 : -1]];
          const base = tall * stretch;
          const long = which === 2 ? base : 8 + rand() * Math.min(26, base * 0.4);
          for (const [cx, cz] of corners) {
            dummy.position.set(x + cx * (w / 2 + 0.3), y + (which === 2 ? base / 2 : base * (0.3 + rand() * 0.4)), z + cz * (w / 2 + 0.3));
            dummy.scale.set(which === 2 ? 0.5 : 1.6, long, which === 2 ? 0.5 : 1.6);
            dummy.updateMatrix();
            strips.setMatrixAt(stripCount, dummy.matrix);
            strips.setColorAt(stripCount++, tint);
          }
        }
      });
      mesh.count = used;
      scene.add(mesh);
    });
    strips.count = stripCount;
    scene.add(strips);
    // Las balizas de las torres, en un solo dibujo.
    const points = new THREE.BufferGeometry();
    points.setAttribute('position', new THREE.Float32BufferAttribute(beacons, 3));
    points.setAttribute('color', new THREE.Float32BufferAttribute(beaconColors, 3));
    scene.add(new THREE.Points(points, new THREE.PointsMaterial({ map: glow(), size: 30, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false })));

    return { mirrors: [{ flat: road, y: 0.012, look: { strength: 1.25, blur: 0.09, mask: wet, maskScale: 0.07 } }] };
  },
};
