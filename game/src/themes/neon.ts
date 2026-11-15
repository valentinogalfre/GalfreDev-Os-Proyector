import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { glow } from '../world/car';
import { rng } from '../world/noise';
import { along } from '../world/props';
import { DROP, envFrom, ground, skyDome, stars } from '../world/scenery';
import { fade, label, roadTexture, wetTexture, windows } from '../world/textures';
import { embankment, place, ribbon } from '../world/track';
import type { Stage, Theme, World } from './theme';

const CYAN = 0x19e6ff, MAGENTA = 0xff2bd0, VIOLET = 0x7a5cff, AMBER = 0xffa020, RED = 0xff3050;
/** Los carteles de la avenida: texto, tinta y fondo. */
const ADS: [string, number, number][] = [
  ['GALFREDEV', CYAN, 0x0a0a12], ['NITRO', 0xffffff, MAGENTA], ['JUNTADA', AMBER, 0x0a0a12], ['PARED 24 H', 0x0a0a12, CYAN],
  ['CARRERA', 0xffffff, VIOLET], ['CINE', 0xf1ede6, 0x0a0a12], ['VUELTA 3/3', MAGENTA, 0x0a0a12], ['OS · PROYECTOR', 0x0a0a12, RED],
];

/** Lo que brilla pasa de 1 a propósito: es lo que hace que el resplandor lo encuentre. */
function lit(color: number, gain: number, extra: THREE.MeshBasicMaterialParameters = {}): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(gain), ...extra });
}

/** Ciudad de noche después de la lluvia: asfalto mojado y luces de neón. */
export const neon: Theme = {
  name: 'Neón',
  exposure: 1.1,
  layout: [
    [0, 0, 0], [160, 0, 0], [300, 0, 0], [340, 0, 30], [350, 0, 120], [340, 0, 200], [280, 0, 230], [200, 0, 225], [150, 2, 250],
    [100, 5, 235], [40, 8, 255], [-40, 8, 250], [-110, 5, 235], [-150, 2, 180], [-155, 0, 90], [-140, 0, 25], [-90, 0, 0],
  ],
  half: 8,
  start: 60,
  bloom: [0.42, 0.6, 0.95],
  night: true,
  cars: [
    { paint: 0xe8e8f0, accent: MAGENTA, underglow: MAGENTA },
    { paint: 0xd0145a, accent: 0xffffff, underglow: AMBER },
    { paint: 0x0d0d12, accent: CYAN, underglow: CYAN },
    { paint: 0x1a2a8a, accent: CYAN, underglow: CYAN },
    { paint: 0xe4a32b, accent: 0x111111, underglow: AMBER },
    { paint: 0x13805a, accent: 0xffffff, underglow: 0x30ff9a },
  ],
  build({ scene, track, anisotropy }: Stage): World {
    scene.fog = new THREE.FogExp2(0x1a0d36, 0.0034);
    const sky = skyDome({ top: 0x03020a, horizon: 0x5a1a70, ground: 0x05030c, curve: 0.3, clouds: { dark: 0x0c0820, lit: 0x8a3098, cover: 0.55 } });
    scene.add(sky, stars(400, 4));
    scene.add(new THREE.HemisphereLight(0x7a7ce0, 0x3a1048, 1.5));
    const key = new THREE.DirectionalLight(0xb48cff, 1.2);
    key.position.set(-40, 80, 30);
    scene.add(key);

    const period = 32, h = track.half;
    scene.add(new THREE.Mesh(
      ribbon(track, h, 0, -h, 0),
      new THREE.MeshStandardMaterial({
        map: roadTexture({ base: 0x15151c, grain: 0.07, edge: 0xdfe6ff, dash: 0xdfe6ff, period, width: h * 2 }, anisotropy),
        roughnessMap: wetTexture(period, anisotropy), roughness: 1, metalness: 0, envMapIntensity: 0.5,
      }),
    ));

    // Muro bajo con una línea de led arriba y su reflejo pintado sobre la pista mojada.
    const wall = new THREE.MeshStandardMaterial({ color: 0x191922, roughness: 0.55, side: THREE.DoubleSide });
    const smear = fade();
    for (const [side, color] of [[1, CYAN], [-1, MAGENTA]] as [number, number][]) {
      const edge = side * (h + 0.6);
      scene.add(new THREE.Mesh(ribbon(track, edge, 0.95, edge, -0.1), wall));
      scene.add(new THREE.Mesh(ribbon(track, edge, 1.02, edge, 0.9), lit(color, 1.8, { side: THREE.DoubleSide, fog: false })));
      scene.add(new THREE.Mesh(
        ribbon(track, edge, 0.03, edge - side * 3.2, 0.03),
        new THREE.MeshBasicMaterial({ map: smear, color, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
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

    // Farolas a los dos lados, alternadas, cada una con su charco de luz en el asfalto.
    const steel = new THREE.MeshStandardMaterial({ color: 0x23232c, roughness: 0.5, metalness: 0.6 });
    const every = 64, lamps = Math.floor(track.length / every) * 2;
    const lampPools = pool(lamps, 0.32);
    for (const side of [1, -1]) {
      const reach = -side * 3.4;
      const post = mergeGeometries([
        new THREE.CylinderGeometry(0.1, 0.14, 9, 6).translate(0, 4.5, 0),
        new THREE.BoxGeometry(Math.abs(reach), 0.12, 0.16).translate(reach / 2, 9, 0),
      ])!;
      const phase = side > 0 ? 0 : every / 2;
      scene.add(along(track, post, steel, every, side * (h + 1.6), undefined, phase));
      scene.add(along(track, new THREE.BoxGeometry(1.1, 0.1, 0.34).translate(reach, 8.92, 0), lit(0xdfeaff, 3, { fog: false }), every, side * (h + 1.6), undefined, phase));
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

    // Arcos sobre la pista, alternando color, con el reflejo debajo.
    const gap = 110, arcs = Math.floor(track.n / gap);
    const frame = new THREE.BoxGeometry(1, 1, 1);
    const beams = new THREE.InstancedMesh(frame, new THREE.MeshBasicMaterial({ fog: false }), arcs * 3);
    const arcPools = pool(arcs, 0.5);
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

    // Carteles de la avenida, sobre dos patas, de frente al que llega.
    ADS.forEach(([text, ink, block], k) => {
      const side = k % 2 ? 1 : -1;
      const board = new THREE.Mesh(new THREE.PlaneGeometry(15, 5).rotateY(Math.PI), lit(0xffffff, 0.85, { map: label(text, ink, block, 384, 128), fog: false }));
      place(track, (k + 0.45) * (track.length / ADS.length), side * (h + 10), board);
      board.rotateY(side * 0.5);
      board.position.y += 9;
      const legs = new THREE.Mesh(mergeGeometries([-5, 5].map((x) => new THREE.BoxGeometry(0.3, 12, 0.3).translate(x, -6.5, 0.3)))!, steel);
      board.add(legs);
      scene.add(board);
    });

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
    const strips = new THREE.InstancedMesh(frame, new THREE.MeshBasicMaterial(), lots.length * 4);
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
      const mesh = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ map }), mine.length);
      mine.forEach(([x, y, z], i) => {
        const stretch = 0.7 + rand() * 0.6, height = tall * stretch;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, stretch, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, tint.setHSL(0.56 + rand() * 0.3, 0.35, 0.72 + rand() * 0.28).multiplyScalar(1.5));
        if (rand() < (which === 2 ? 0.6 : 0.35)) {
          // Tubos de neón: en las torres, las cuatro aristas; en lo bajo, un cartel vertical.
          tint.set(palette[Math.floor(rand() * palette.length)]).multiplyScalar(2.2);
          const corners = which === 2 ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[rand() < 0.5 ? 1 : -1, rand() < 0.5 ? 1 : -1]];
          const long = which === 2 ? height : 8 + rand() * Math.min(26, height * 0.4);
          for (const [cx, cz] of corners) {
            dummy.position.set(x + cx * (w / 2 + 0.3), y + (which === 2 ? height / 2 : height * (0.3 + rand() * 0.4)), z + cz * (w / 2 + 0.3));
            dummy.scale.set(which === 2 ? 0.5 : 1.6, long, which === 2 ? 0.5 : 1.6);
            dummy.updateMatrix();
            strips.setMatrixAt(stripCount, dummy.matrix);
            strips.setColorAt(stripCount++, tint);
          }
        }
        if (which === 2) {
          beacons.push(x, y + height + 2, z);
          beaconColors.push(1, 0.1, 0.1);
        }
      });
      scene.add(mesh);
    });
    strips.count = stripCount;
    scene.add(strips);
    // Las balizas de las torres, en un solo dibujo.
    const points = new THREE.BufferGeometry();
    points.setAttribute('position', new THREE.Float32BufferAttribute(beacons, 3));
    points.setAttribute('color', new THREE.Float32BufferAttribute(beaconColors, 3));
    scene.add(new THREE.Points(points, new THREE.PointsMaterial({ map: glow(), size: 30, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false })));

    return { env: envFrom(sky, [[CYAN, 60, 34, 0, 50], [MAGENTA, -60, 34, 0, 50], [0xffffff, 0, 70, 40, 60], [MAGENTA, 0, 26, -70, 40], [CYAN, 0, 30, 70, 40], [VIOLET, 40, 50, 60, 30], [AMBER, -50, 44, -50, 24]]) };
  },
};
