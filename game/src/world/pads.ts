import * as THREE from 'three';
import type { Pad } from '../sim/race';
import type { Theme } from '../themes/theme';
import { place, type Track } from './track';

/** Lo que la pista declara en fracciones de vuelta, puesto en metros: lo usan igual la carrera, la pared y cada celular. */
export function padsOf(theme: Theme, track: Track): Pad[] {
  return (theme.pads ?? []).map((pad) => ({
    kind: pad.kind,
    s: pad.at * track.length,
    d: pad.kind === 'boost' ? pad.lane * (track.half - 2.8) : 0,
    length: pad.kind === 'boost' ? 14 : 6,
    // La rampa cruza la pista entera: salta todo el que llega con velocidad. El empuje es de un carril y hay que ir a buscarlo.
    half: pad.kind === 'boost' ? 2.4 : track.half - 0.8,
  }));
}

function paint(draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  draw(canvas.getContext('2d')!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Alto de la rampa en su borde de salida, en metros. */
const LIP = 0.6;

/**
 * Las plataformas y las rampas de una pista, en dos piezas: una por cada dibujo. Las flechas de empuje corren
 * hacia adelante; [tick] las mueve.
 */
export function buildPads(track: Track, pads: Pad[]): { group: THREE.Group; tick(dt: number): void } {
  const group = new THREE.Group();
  const probe = new THREE.Object3D();
  const at = (s: number, d: number, lift: number): [number, number, number] => {
    place(track, s, d, probe);
    return [probe.position.x, probe.position.y + lift, probe.position.z];
  };
  const boost: number[] = [], boostUv: number[] = [], ramp: number[] = [], rampUv: number[] = [];
  const quad = (into: number[], uvs: number[], a: number[], b: number[], c: number[], d: number[], v0: number, v1: number, u = 1) => {
    into.push(...a, ...b, ...c, ...b, ...d, ...c);
    uvs.push(0, v0, u, v0, 0, v1, u, v0, u, v1, 0, v1);
  };
  for (const pad of pads) {
    const rows = pad.kind === 'boost' ? 7 : 3;
    for (let k = 0; k < rows; k++) {
      const s0 = pad.s + (k / rows) * pad.length, s1 = pad.s + ((k + 1) / rows) * pad.length;
      if (pad.kind === 'boost') {
        quad(boost, boostUv, at(s0, pad.d + pad.half, 0.05), at(s0, pad.d - pad.half, 0.05), at(s1, pad.d + pad.half, 0.05), at(s1, pad.d - pad.half, 0.05), (k / rows) * 3, ((k + 1) / rows) * 3);
        continue;
      }
      const h0 = (k / rows) * LIP + 0.03, h1 = ((k + 1) / rows) * LIP + 0.03;
      const l0 = at(s0, pad.d + pad.half, h0), r0 = at(s0, pad.d - pad.half, h0), l1 = at(s1, pad.d + pad.half, h1), r1 = at(s1, pad.d - pad.half, h1);
      // Las franjas se repiten cada dos metros, sea cual sea el ancho de la pista.
      quad(ramp, rampUv, l0, r0, l1, r1, k, k + 1, pad.half);
      // Los costados bajan hasta el asfalto, y atrás se cierra con una pared.
      quad(ramp, rampUv, at(s0, pad.d + pad.half, 0), l0, at(s1, pad.d + pad.half, 0), l1, 0.4, 0.5);
      quad(ramp, rampUv, r0, at(s0, pad.d - pad.half, 0), r1, at(s1, pad.d - pad.half, 0), 0.4, 0.5);
      if (k === rows - 1) quad(ramp, rampUv, l1, r1, at(s1, pad.d + pad.half, 0), at(s1, pad.d - pad.half, 0), 0.4, 0.5);
    }
  }
  const mesh = (points: number[], uvs: number[], material: THREE.Material) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    const made = new THREE.Mesh(geometry, material);
    made.matrixAutoUpdate = false;
    group.add(made);
  };
  // Flechas ámbar sobre un velo del mismo color: se leen de lejos y no tapan el asfalto.
  const arrows = paint((g) => {
    g.fillStyle = 'rgba(228,163,43,.3)';
    g.fillRect(0, 0, 64, 64);
    g.strokeStyle = '#ffc55a';
    g.lineWidth = 11;
    g.lineJoin = 'miter';
    g.beginPath();
    g.moveTo(6, 48); g.lineTo(32, 20); g.lineTo(58, 48);
    g.stroke();
  });
  if (boost.length) mesh(boost, boostUv, new THREE.MeshBasicMaterial({ map: arrows, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  // La rampa lleva las franjas de obra, ámbar y carbón: se distingue del asfalto en las tres pistas.
  const hazard = paint((g) => {
    g.fillStyle = '#e4a32b';
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#161616';
    for (const x of [-64, -32, 0, 32, 64]) { g.beginPath(); g.moveTo(x, 64); g.lineTo(x + 16, 64); g.lineTo(x + 80, 0); g.lineTo(x + 64, 0); g.fill(); }
  });
  if (ramp.length) mesh(ramp, rampUv, new THREE.MeshBasicMaterial({ map: hazard, side: THREE.DoubleSide, toneMapped: false }));
  return { group, tick: (dt) => { arrows.offset.y = (arrows.offset.y - dt * 1.8) % 1; } };
}
