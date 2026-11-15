import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng, fbm } from '../world/noise';
import { DROP, envFrom, ground, ridge, skyDome } from '../world/scenery';
import { roadTexture, strata, stripes } from '../world/textures';
import { embankment, ribbon } from '../world/track';
import type { Stage, Theme } from './theme';

const SUN = new THREE.Vector3(-0.93, 0.085, 0.36).normalize();

function cardon(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.34, 0.4, 6, 7).translate(0, 3, 0);
  const cap = new THREE.SphereGeometry(0.34, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, 6, 0);
  const parts = [trunk, cap];
  for (const [side, at, tall] of [[1, 2.4, 2.6], [-1, 3.3, 1.9]] as [number, number, number][]) {
    parts.push(new THREE.CylinderGeometry(0.22, 0.22, 1, 6).rotateZ(Math.PI / 2).translate(side * 0.7, at, 0));
    parts.push(new THREE.CylinderGeometry(0.22, 0.24, tall, 6).translate(side * 1.2, at + tall / 2, 0));
    parts.push(new THREE.SphereGeometry(0.22, 6, 3, 0, Math.PI * 2, 0, Math.PI / 2).translate(side * 1.2, at + tall, 0));
  }
  return mergeGeometries(parts)!;
}

/** Atardecer en la Puna: cerros de colores, cardones y la ruta sola. */
export const puna: Theme = {
  name: 'Puna',
  exposure: 1.05,
  cars: [
    { paint: 0xf1ede6, accent: 0x111111 },
    { paint: 0xb3261e, accent: 0xf1ede6 },
    { paint: 0x111111, accent: 0xe4a32b },
    { paint: 0x1f4e5f, accent: 0xe4a32b },
    { paint: 0xe4a32b, accent: 0x111111 },
    { paint: 0x4a2b6b, accent: 0xf1ede6 },
  ],
  build({ scene, track, anisotropy }: Stage): THREE.Scene {
    scene.fog = new THREE.FogExp2(0xe9966c, 0.00072);
    const sky = skyDome({
      top: 0x18204f, horizon: 0xffa25e, ground: 0x8a4a34, sun: SUN, sunColor: 0xffd49a, curve: 0.55,
      clouds: { dark: 0x5a3f74, lit: 0xff9a5e, cover: 0.4 },
    });
    scene.add(sky);

    scene.add(new THREE.HemisphereLight(0xa79ae0, 0x8a4326, 1.7));
    const sun = new THREE.DirectionalLight(0xffa860, 3.6);
    sun.position.copy(SUN).multiplyScalar(100);
    scene.add(sun);

    // Asfalto algo liso: con el sol tan bajo devuelve un brillo largo hacia la cámara.
    scene.add(new THREE.Mesh(
      ribbon(track, track.half, 0, -track.half, 0),
      new THREE.MeshStandardMaterial({ map: roadTexture({ base: 0x3d3835, grain: 0.1, edge: 0xf1ede6, dash: 0xe4a32b, period: 32, width: track.half * 2 }, anisotropy), roughness: 0.5, metalness: 0, envMapIntensity: 0.5 }),
    ));
    scene.add(embankment(track, new THREE.MeshLambertMaterial({ color: 0xa87352 }), new THREE.MeshLambertMaterial({ color: 0x9a5f40 }), 2.6, 12, DROP + 0.6));

    // Guardarraíl del lado de afuera y mojones del lado de adentro.
    const rail = new THREE.MeshStandardMaterial({ color: 0xb9b4aa, metalness: 0.8, roughness: 0.45, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(ribbon(track, track.half + 1.2, 0.85, track.half + 1.2, 0.4), rail));
    const kerb = new THREE.MeshLambertMaterial({ map: stripes(0xb3261e, 0xf1ede6, 4) });
    scene.add(new THREE.Mesh(ribbon(track, -track.half + 0.05, 0.015, -track.half - 0.9, 0.05), kerb));

    const sand = new THREE.Color(0xb9764c), red = new THREE.Color(0x8f3f2a), pale = new THREE.Color(0xd9a878), tint = new THREE.Color();
    const land = ground(track, {
      center: [25, 120], size: 1900, segments: 190, relief: 46, flat: 26, scale: 0.006, seed: 11,
      material: new THREE.MeshLambertMaterial({ vertexColors: true }),
      color: (h, x, z) => tint.copy(sand).lerp(red, Math.min(1, Math.max(0, h / 40))).lerp(pale, fbm(x * 0.03, z * 0.03, 3, 5) * 0.7),
    });
    scene.add(land.mesh);

    // Los cerros de colores, en dos cordones: el de atrás, más alto y ya metido en la bruma.
    const near = strata([0x7a3626, 0xb5532f, 0xd98a4a, 0xe9c08a, 0x8a4a6b, 0x5f7a5a, 0xc96a3a, 0xa8482e], 5);
    const far = strata([0x4a2f55, 0x6a3c62, 0x93506a, 0xb0646c], 9);
    near.anisotropy = far.anisotropy = anisotropy;
    scene.add(ridge({ center: [25, 120], radius: 600, height: 170, base: -24, seed: 3, map: near, repeat: 7, jagged: 1.6, shade: 1.0 }));
    scene.add(ridge({ center: [25, 120], radius: 880, height: 330, base: -30, seed: 8, map: far, repeat: 5, jagged: 1.1, shade: 0.9 }));

    const rand = rng(21);
    const dummy = new THREE.Object3D();
    const spots: [number, number, number][] = [];
    while (spots.length < 260) {
      const x = 25 + (rand() - 0.5) * 700, z = 120 + (rand() - 0.5) * 700;
      const d = land.distanceAt(x, z);
      if (d > track.half + 7 && d < 190 && rand() < 1.15 - d / 190) spots.push([x, land.heightAt(x, z), z]);
    }
    const cacti = new THREE.InstancedMesh(cardon(), new THREE.MeshLambertMaterial({ color: 0x4f6a3a }), 110);
    const rocks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({ color: 0x8a4a34, flatShading: true }), 150);
    spots.forEach(([x, y, z], i) => {
      dummy.position.set(x, y - 0.2, z);
      dummy.rotation.set(0, rand() * 6.28, 0);
      if (i < 110) {
        dummy.scale.setScalar(0.7 + rand() * 0.9);
        dummy.updateMatrix();
        cacti.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.set(0.6 + rand() * 2.4, 0.4 + rand() * 1.2, 0.6 + rand() * 2.4);
        dummy.updateMatrix();
        rocks.setMatrixAt(i - 110, dummy.matrix);
      }
    });
    scene.add(cacti, rocks);

    return envFrom(sky);
  },
};
