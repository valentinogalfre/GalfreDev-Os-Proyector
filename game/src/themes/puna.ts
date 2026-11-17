import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng, fbm } from '../world/noise';
import { along, bend, gantry, wires } from '../world/props';
import { DROP, ground, ridge, skyDome } from '../world/scenery';
import { gradient, gravel, label, roadTexture, stripes } from '../world/textures';
import { embankment, ribbon } from '../world/track';
import type { Stage, Theme, World } from './theme';

const SUN = new THREE.Vector3(-0.72, 0.27, 0.64).normalize();
/** Los estratos del cerro, de abajo hacia arriba. */
const STRATA = [0xa8502f, 0xc9703c, 0xe0a060, 0xead0a0, 0x9a5a78, 0x6f8a62, 0xd07840, 0x8a3a2a, 0xd9b48a, 0x7a4a6a].map((c) => new THREE.Color(c));

/** Un cardón: tronco acanalado y dos brazos que suben. */
function cardon(fine: boolean): THREE.BufferGeometry {
  const column = (r: number, h: number) => {
    // Las tapas quedan dentro de la cúpula o del suelo: no se ven y son triángulos que el proyector paga igual.
    const g = new THREE.CylinderGeometry(r * 0.92, r, h, 10, 1, true).translate(0, h / 2, 0);
    const p = g.attributes.position as THREE.BufferAttribute;
    // Las costillas: una arista sí y una no se meten hacia adentro.
    for (let i = 0; i < p.count; i++) {
      const a = Math.atan2(p.getZ(i), p.getX(i));
      const k = 0.86 + 0.14 * Math.abs(Math.cos(a * 5));
      p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k);
    }
    return g;
  };
  const dome = (r: number) => new THREE.SphereGeometry(r * 0.92, 10, fine ? 4 : 2, 0, Math.PI * 2, 0, Math.PI / 2);
  const parts: THREE.BufferGeometry[] = [column(0.42, 6.4), dome(0.42).translate(0, 6.4, 0)];
  for (const [side, at, tall] of [[1, 2.5, 2.8], [-1, 3.4, 2.1]] as [number, number, number][]) {
    parts.push(new THREE.TorusGeometry(0.75, 0.24, fine ? 6 : 5, fine ? 6 : 3, Math.PI / 2).rotateZ(Math.PI).rotateY(side > 0 ? 0 : Math.PI).translate(side * 0.75, at + 0.75, 0));
    parts.push(column(0.26, tall).translate(side * 1.5, at + 0.75, 0));
    parts.push(dome(0.26).translate(side * 1.5, at + 0.75 + tall, 0));
  }
  return mergeGeometries(parts.map((g) => g.toNonIndexed()))!;
}

/** Atardecer en la Puna: cerros de colores, cardones y la ruta sola. */
export const puna: Theme = {
  name: 'Puna',
  exposure: 0.78,
  layout: [
    [0, 0, 0], [140, 2, -20], [260, 8, 30], [300, 16, 140], [230, 24, 220], [130, 28, 200], [90, 30, 260], [170, 34, 330],
    [110, 38, 400], [0, 36, 380], [-90, 30, 300], [-60, 24, 200], [-150, 16, 150], [-230, 8, 60], [-180, 2, -30], [-90, 0, -20],
  ],
  half: 6.5,
  wall: 12,
  start: 820,
  grade: { bloom: [0.35, 0.6, 1.25], vignette: 0.5, speed: 0.11 },
  spray: { color: 0xc9a27e, opacity: 0.2, size: 2.6, additive: false },
  cars: [
    { paint: 0xb3261e, accent: 0xf1ede6 },
    { paint: 0xd6d2c8, accent: 0xb3261e },
    { paint: 0x141414, accent: 0xf1ede6 },
    { paint: 0x1f5a6e, accent: 0xf1ede6 },
    { paint: 0x2f5d3a, accent: 0xf1ede6 },
    { paint: 0x4a2b6b, accent: 0xf1ede6 },
  ],
  build({ scene, track, anisotropy, fine }: Stage): World {
    // En la calidad baja el paisaje lleva un tercio de las piezas y una malla más gruesa.
    const few = fine ? 1 : 0.35;
    scene.fog = new THREE.FogExp2(0xdca88c, 0.00052);
    const sky = skyDome({
      top: 0x3f63b4, horizon: 0xf6b98a, ground: 0x9a6248, sun: SUN, sunColor: 0xffe2b4, curve: 0.5, gain: 1.25,
      clouds: { dark: 0xa08aa8, lit: 0xffc896, cover: 0.27 },
    });
    scene.add(sky);
    // El disco del sol pasa de 1 para que el resplandor lo encuentre.
    const disc = new THREE.Mesh(new THREE.CircleGeometry(26, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd9a0).multiplyScalar(9), fog: false, transparent: true, depthWrite: false }));
    disc.position.copy(SUN).multiplyScalar(1450);
    disc.lookAt(0, 0, 0);
    const sunGroup = new THREE.Group();
    sunGroup.name = 'sky';
    sunGroup.add(disc);
    scene.add(sunGroup);

    scene.add(new THREE.HemisphereLight(0xa9bcf0, 0xa8683e, 1.7));
    const sun = new THREE.DirectionalLight(0xffc48c, 4.2);
    sun.position.copy(SUN);
    scene.add(sun);

    scene.add(new THREE.Mesh(
      ribbon(track, track.half, 0, -track.half, 0),
      new THREE.MeshStandardMaterial({ map: roadTexture({ base: 0x3a3836, grain: 0.12, edge: 0xf1ede6, dash: 0xe4a32b, period: 32, width: track.half * 2 }, anisotropy), roughness: 0.62, metalness: 0, envMapIntensity: 0.55 }),
    ));
    const grit = gravel(4, anisotropy);
    const shoulder = new THREE.MeshLambertMaterial({ color: 0xb58a68, map: grit });
    const slope = new THREE.MeshLambertMaterial({ color: 0xa87352, map: grit });
    scene.add(embankment(track, shoulder, slope, 7.6, 16, DROP + 0.6));
    const kerb = new THREE.MeshLambertMaterial({ map: stripes(0xb3261e, 0xf1ede6, 4) });
    scene.add(new THREE.Mesh(ribbon(track, -track.half + 0.05, 0.015, -track.half - 0.9, 0.05), kerb));
    scene.add(new THREE.Mesh(ribbon(track, track.half + 0.9, 0.05, track.half - 0.05, 0.015), kerb));

    // Guardarraíl con sus postes del lado de afuera.
    const steel = new THREE.MeshStandardMaterial({ color: 0xc4c0b8, metalness: 0.85, roughness: 0.4, side: THREE.DoubleSide });
    const rail = new THREE.Mesh(ribbon(track, track.half + 6.7, 0.5, track.half + 6.7, 0.14), steel);
    const posts = along(track, new THREE.BoxGeometry(0.1, 0.9, 0.12).translate(0, 0.08, 0), steel, 4, track.half + 6.78);
    rail.castShadow = posts.castShadow = true;
    scene.add(rail, posts);

    // Postes de luz de madera con su cable, del lado de adentro.
    const wood = new THREE.MeshLambertMaterial({ color: 0x4a3324 });
    const pole = mergeGeometries([new THREE.CylinderGeometry(0.11, 0.15, 9, 6).translate(0, 4.5, 0), new THREE.BoxGeometry(2.2, 0.14, 0.14).translate(0, 8.3, 0)])!;
    const poles = along(track, pole, wood, 46, -track.half - 8);
    poles.castShadow = true;
    scene.add(poles);
    for (const side of [-1, 1]) scene.add(wires(track, 46, -track.half - 8 + side, 8.4, 0.9, 0x241a14));

    // Flechas en las curvas, del lado de afuera, mirando al que llega.
    const arrow = new THREE.MeshBasicMaterial({ map: label('›››', 0x111111, 0xe4a32b, 128, 64), side: THREE.DoubleSide });
    for (const turn of [1, -1]) {
      const board = new THREE.PlaneGeometry(2.4, 1.2).rotateY(Math.PI).translate(0, 1.5, 0);
      if (turn > 0) board.scale(-1, 1, 1);
      const boards = along(track, board, arrow, 9, -turn * (track.half + 7.4), (s) => bend(track, s) * turn > 0.5);
      boards.castShadow = true;
      scene.add(boards);
    }

    const sand = new THREE.Color(0xc08a5e), dust = new THREE.Color(0xd8b088), tint = new THREE.Color(), band = new THREE.Color();
    const land = ground(track, {
      center: track.center, size: 3600, segments: fine ? 230 : 110, focus: 1.7, tile: 14, relief: 250, flat: 34, ramp: 520, scale: 0.0042, seed: 11,
      material: new THREE.MeshLambertMaterial({ vertexColors: true, map: grit }),
      color: (h, x, z) => {
        // Abajo arena; hacia arriba aparecen los estratos, ondulados por el ruido.
        const level = (h + 26 * fbm(x * 0.004, z * 0.004, 3, 7)) / 13;
        const i = Math.floor(level), f = level - i;
        band.copy(STRATA[((i % STRATA.length) + STRATA.length) % STRATA.length]).lerp(STRATA[(((i + 1) % STRATA.length) + STRATA.length) % STRATA.length], Math.max(0, (f - 0.75) * 4));
        const high = Math.min(1, Math.max(0, (h - 2) / 26));
        return tint.copy(sand).lerp(dust, fbm(x * 0.02, z * 0.02, 3, 5)).lerp(band, high * 0.92);
      },
    });
    scene.add(land.mesh);

    // Un cordón lejano, ya metido en la bruma, cierra el horizonte.
    scene.add(ridge({ around: fine ? 720 : 240, center: track.center, radius: 2300, height: 640, base: -40, seed: 8, map: gradient(0x8a6a8e, 0xb98a8a), repeat: 1, jagged: 1.3, shade: 1 }));

    const rand = rng(21);
    const dummy = new THREE.Object3D();
    const scatter = (count: number, reach: number, near: number, each: (i: number) => void) => {
      for (let i = 0; i < count;) {
        const x = track.center[0] + (rand() - 0.5) * reach * 2, z = track.center[1] + (rand() - 0.5) * reach * 2;
        const d = land.distanceAt(x, z);
        if (d < near || d > reach * 0.7 || rand() > 1.2 - d / (reach * 0.7)) continue;
        dummy.position.set(x, land.heightAt(x, z) - 0.15, z);
        dummy.rotation.set(0, rand() * 6.28, 0);
        each(i++);
      }
    };
    const cacti = new THREE.InstancedMesh(cardon(fine), new THREE.MeshLambertMaterial({ color: 0x5a7440 }), 170);
    cacti.count = Math.round(170 * few);
    scatter(cacti.count, 420, track.half + 8, (i) => {
      dummy.scale.setScalar(0.6 + rand() * 0.9);
      dummy.updateMatrix();
      cacti.setMatrixAt(i, dummy.matrix);
    });
    cacti.castShadow = true;
    // Tolas y pastos duros: matas bajas que le dan escala al suelo.
    const bushes = new THREE.InstancedMesh(new THREE.SphereGeometry(1, fine ? 6 : 5, fine ? 4 : 3), new THREE.MeshLambertMaterial(), 1000);
    bushes.count = Math.round(1000 * few);
    scatter(bushes.count, 380, track.half + 7, (i) => {
      const w = 0.5 + rand() * 1.1;
      dummy.scale.set(w, w * (0.45 + rand() * 0.4), w);
      dummy.updateMatrix();
      bushes.setMatrixAt(i, dummy.matrix);
      bushes.setColorAt(i, rand() < 0.6 ? tint.setHSL(0.1 + rand() * 0.03, 0.5, 0.2 + rand() * 0.1) : tint.setHSL(0.2 + rand() * 0.08, 0.3, 0.07 + rand() * 0.06));
    });
    const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshLambertMaterial({ flatShading: true }), 260);
    rocks.count = Math.round(260 * few);
    scatter(rocks.count, 420, track.half + 7.5, (i) => {
      dummy.rotation.set(rand() * 3, rand() * 6.28, rand() * 3);
      dummy.scale.set(0.5 + rand() * 2.6, 0.4 + rand() * 1.4, 0.5 + rand() * 2.6);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
      rocks.setColorAt(i, tint.setHSL(0.04 + rand() * 0.04, 0.4, 0.2 + rand() * 0.14));
    });
    rocks.castShadow = true;
    scene.add(cacti, bushes, rocks);

    scene.add(gantry(track, 0, 0xf1ede6, 0x111111));

    return { sun, shadowRange: 60, rays: disc };
  },
};
