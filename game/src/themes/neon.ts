import * as THREE from 'three';
import { glow } from '../world/car';
import { rng } from '../world/noise';
import { DROP, envFrom, ground, skyDome, stars } from '../world/scenery';
import { fade, roadTexture, wetTexture, windows } from '../world/textures';
import { embankment, ribbon } from '../world/track';
import type { Stage, Theme } from './theme';

const CYAN = 0x19e6ff, MAGENTA = 0xff2bd0;

/** Ciudad de noche después de la lluvia: asfalto mojado y luces de neón. */
export const neon: Theme = {
  name: 'Neón',
  exposure: 1.15,
  cars: [
    { paint: 0x0d0d12, accent: CYAN, underglow: CYAN },
    { paint: 0xd0145a, accent: 0xffffff, underglow: MAGENTA },
    { paint: 0xe8e8f0, accent: MAGENTA, underglow: 0x7a5cff },
    { paint: 0x1a2a8a, accent: CYAN, underglow: CYAN },
    { paint: 0xe4a32b, accent: 0x111111, underglow: 0xffa020 },
    { paint: 0x13805a, accent: 0xffffff, underglow: 0x30ff9a },
  ],
  build({ scene, track, anisotropy }: Stage): THREE.Scene {
    scene.fog = new THREE.FogExp2(0x140a2c, 0.0052);
    const sky = skyDome({ top: 0x03020a, horizon: 0x4a1560, ground: 0x05030c, curve: 0.3, clouds: { dark: 0x0a0618, lit: 0x7a2a8a, cover: 0.5 } });
    scene.add(sky, stars(400, 4));
    scene.add(new THREE.HemisphereLight(0x6a6cd0, 0x2a0a34, 1.2));
    const key = new THREE.DirectionalLight(0xb48cff, 1.0);
    key.position.set(-40, 80, 30);
    scene.add(key);

    const period = 32;
    scene.add(new THREE.Mesh(
      ribbon(track, track.half, 0, -track.half, 0),
      new THREE.MeshStandardMaterial({
        map: roadTexture({ base: 0x16161d, grain: 0.07, edge: 0xdfe6ff, dash: 0xdfe6ff, period, width: track.half * 2 }, anisotropy),
        roughnessMap: wetTexture(period, anisotropy), roughness: 1, metalness: 0, envMapIntensity: 1.1,
      }),
    ));

    // Muro bajo con una línea de led arriba y su reflejo pintado sobre la pista mojada.
    const wall = new THREE.MeshStandardMaterial({ color: 0x15151c, roughness: 0.6, side: THREE.DoubleSide });
    const smear = fade();
    for (const [side, color] of [[1, CYAN], [-1, MAGENTA]] as [number, number][]) {
      const edge = side * (track.half + 0.6);
      scene.add(new THREE.Mesh(ribbon(track, edge, 0.9, edge, -0.1), wall));
      scene.add(new THREE.Mesh(ribbon(track, edge, 0.98, edge, 0.84), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, fog: false })));
      scene.add(new THREE.Mesh(
        ribbon(track, edge, 0.03, edge - side * 4.2, 0.03),
        new THREE.MeshBasicMaterial({ map: smear, color, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      ));
    }
    const concrete = new THREE.MeshStandardMaterial({ color: 0x101016, roughness: 0.7 });
    scene.add(embankment(track, concrete, concrete, 1.2, 3.2, DROP + 0.6));

    const land = ground(track, {
      center: [25, 120], size: 1500, segments: 90, relief: 0, flat: 20, scale: 0.01, seed: 2,
      material: new THREE.MeshStandardMaterial({ color: 0x0c0c12, roughness: 0.35, metalness: 0.3 }),
    });
    scene.add(land.mesh);

    // Arcos sobre la pista, alternando color, con el reflejo debajo.
    const dummy = new THREE.Object3D();
    const arcs = Math.floor(track.n / 45);
    const frame = new THREE.BoxGeometry(1, 1, 1);
    const beams = new THREE.InstancedMesh(frame, new THREE.MeshBasicMaterial({ fog: false }), arcs * 3);
    const pools = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: glow(), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }), arcs);
    const tint = new THREE.Color();
    const span = track.half + 1.4, top = 8.5;
    for (let a = 0; a < arcs; a++) {
      const i = a * 45 + 10;
      const c = track.pos[i], t = track.tan[i], l = track.left[i];
      tint.set(a % 2 ? MAGENTA : CYAN);
      const yaw = Math.atan2(t.x, t.z);
      [[0, top, span * 2 + 0.3, 0.3], [span, top / 2, 0.3, top], [-span, top / 2, 0.3, top]].forEach(([off, y, w, h], k) => {
        dummy.position.set(c.x + l.x * off, c.y + y, c.z + l.z * off);
        dummy.rotation.set(0, yaw, 0);
        dummy.scale.set(w, h, 0.3);
        dummy.updateMatrix();
        beams.setMatrixAt(a * 3 + k, dummy.matrix);
        beams.setColorAt(a * 3 + k, tint);
      });
      dummy.position.set(c.x, c.y + 0.04, c.z);
      dummy.scale.set(track.half * 2.6, 1, 26);
      dummy.updateMatrix();
      pools.setMatrixAt(a, dummy.matrix);
      pools.setColorAt(a, tint);
    }
    scene.add(beams, pools);

    // Edificios en tres alturas, cada una con su fachada, fuera del corredor de la pista.
    const rand = rng(31);
    const sizes: [number, number][] = [[22, 36], [26, 78], [30, 140]];
    const lots: [number, number, number, number][] = [];
    for (let gx = -20; gx <= 20; gx++) for (let gz = -20; gz <= 20; gz++) {
      const x = 25 + gx * 36 + (rand() - 0.5) * 8, z = 120 + gz * 36 + (rand() - 0.5) * 8;
      const d = land.distanceAt(x, z);
      if (d < track.half + 26) continue;
      const tall = rand() < Math.min(0.7, d / 300) ? 2 : rand() < 0.55 ? 1 : 0;
      lots.push([x, land.heightAt(x, z), z, tall]);
    }
    const signs: number[] = [], signColors: number[] = [];
    const palette = [CYAN, MAGENTA, 0xffa020, 0x7a5cff, 0xff3050];
    const signMesh = new THREE.InstancedMesh(frame, new THREE.MeshBasicMaterial(), lots.length);
    let signCount = 0;
    sizes.forEach(([w, h], kind) => {
      const mine = lots.filter((lot) => lot[3] === kind);
      const map = windows(60 + kind);
      map.repeat.set(w / 28, h / 56);
      const box = new THREE.BoxGeometry(w, h, w).translate(0, h / 2, 0);
      // El techo no lleva ventanas.
      const uv = box.attributes.uv as THREE.BufferAttribute;
      for (let v = 8; v < 16; v++) uv.setXY(v, 0, 0);
      const mesh = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ map }), mine.length);
      mine.forEach(([x, y, z], i) => {
        const stretch = 0.75 + rand() * 0.5;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, stretch, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, tint.setHSL(0.58 + rand() * 0.3, 0.4, 0.5 + rand() * 0.3));
        if (rand() < 0.55) {
          // Un cartel vertical en la esquina que da a la pista.
          tint.set(palette[Math.floor(rand() * palette.length)]);
          const long = 8 + rand() * Math.min(26, h * 0.4);
          const sx = x + (rand() < 0.5 ? -1 : 1) * (w / 2 + 0.9), sz = z + (rand() < 0.5 ? -1 : 1) * (w / 2 + 0.9);
          const sy = y + h * stretch * (0.25 + rand() * 0.45);
          dummy.position.set(sx, sy, sz);
          dummy.scale.set(1.5, long, 1.5);
          dummy.updateMatrix();
          signMesh.setMatrixAt(signCount, dummy.matrix);
          signMesh.setColorAt(signCount++, tint);
          signs.push(sx, sy, sz);
          signColors.push(tint.r, tint.g, tint.b);
        }
        if (kind === 2) {
          signs.push(x, y + h * stretch + 2, z);
          signColors.push(1, 0.1, 0.1);
        }
      });
      scene.add(mesh);
    });
    signMesh.count = signCount;
    scene.add(signMesh);
    // El resplandor de todos los carteles y las balizas, en un solo dibujo.
    const haloGeometry = new THREE.BufferGeometry();
    haloGeometry.setAttribute('position', new THREE.Float32BufferAttribute(signs, 3));
    haloGeometry.setAttribute('color', new THREE.Float32BufferAttribute(signColors, 3));
    scene.add(new THREE.Points(haloGeometry, new THREE.PointsMaterial({ map: glow(), size: 38, vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })));

    return envFrom(sky, [[CYAN, 60, 30, 0, 90], [MAGENTA, -60, 30, 0, 90], [0xffffff, 0, 70, 40, 90], [MAGENTA, 0, 20, -70, 90], [CYAN, 0, 25, 70, 90]]);
  },
};
