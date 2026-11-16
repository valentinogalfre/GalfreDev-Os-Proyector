import * as THREE from 'three';
import { place, type Track } from './world/track';

/** Un auto en el mapa: dónde va, de qué color, y si es el de quien mira. */
export interface Dot { s: number; d: number; color: string; me?: boolean }

/**
 * La pista vista de arriba, con cada auto en su lugar. El trazado se dibuja una vez en un lienzo aparte;
 * en cada cuadro solo se copian ese dibujo y los puntos.
 */
export function mountMap(canvas: HTMLCanvasElement, track: Track, line = '#f1ede6'): (dots: Dot[]) => void {
  const probe = new THREE.Object3D();
  const steps = Math.max(48, Math.round(track.length / 8));
  const path: [number, number][] = [];
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let k = 0; k < steps; k++) {
    place(track, (k / steps) * track.length, 0, probe);
    path.push([probe.position.x, probe.position.z]);
    minX = Math.min(minX, probe.position.x); maxX = Math.max(maxX, probe.position.x);
    minZ = Math.min(minZ, probe.position.z); maxZ = Math.max(maxZ, probe.position.z);
  }
  const base = document.createElement('canvas');
  let size = 0, fit = 1, left = 0, top = 0;
  const to = (x: number, z: number): [number, number] => [left + (x - minX) * fit, top + (z - minZ) * fit];

  function layout(): void {
    size = canvas.width;
    base.width = canvas.width;
    base.height = canvas.height;
    const pad = Math.max(6, canvas.width * 0.09);
    fit = Math.min((canvas.width - pad * 2) / Math.max(1, maxX - minX), (canvas.height - pad * 2) / Math.max(1, maxZ - minZ));
    left = (canvas.width - (maxX - minX) * fit) / 2;
    top = (canvas.height - (maxZ - minZ) * fit) / 2;
    const g = base.getContext('2d')!;
    g.lineJoin = g.lineCap = 'round';
    g.beginPath();
    path.forEach(([x, z], k) => { const [px, py] = to(x, z); if (k) g.lineTo(px, py); else g.moveTo(px, py); });
    g.closePath();
    g.strokeStyle = 'rgba(17,17,17,.75)';
    g.lineWidth = Math.max(5, canvas.width * 0.06);
    g.stroke();
    g.strokeStyle = line;
    g.lineWidth = Math.max(2, canvas.width * 0.022);
    g.stroke();
    // La largada, cruzada sobre la pista.
    const [ax, ay] = to(...path[0]), [bx, by] = to(...path[1]);
    const n = Math.hypot(bx - ax, by - ay) || 1, w = Math.max(4, canvas.width * 0.045);
    g.beginPath();
    g.moveTo(ax - ((by - ay) / n) * w, ay + ((bx - ax) / n) * w);
    g.lineTo(ax + ((by - ay) / n) * w, ay - ((bx - ax) / n) * w);
    g.strokeStyle = '#e4a32b';
    g.stroke();
  }

  return (dots) => {
    const wide = Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 2)), tall = Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 2));
    if (!wide || !tall) return;
    if (canvas.width !== wide || canvas.height !== tall) { canvas.width = wide; canvas.height = tall; }
    if (size !== canvas.width || base.height !== canvas.height) layout();
    const g = canvas.getContext('2d')!;
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.drawImage(base, 0, 0);
    // El propio se dibuja al final y más grande: nunca queda tapado.
    for (const dot of dots.slice().sort((a, b) => Number(a.me ?? false) - Number(b.me ?? false))) {
      place(track, dot.s, dot.d, probe);
      const [x, y] = to(probe.position.x, probe.position.z), r = canvas.width * (dot.me ? 0.05 : 0.036);
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fillStyle = dot.color;
      g.fill();
      g.lineWidth = Math.max(1.5, canvas.width * (dot.me ? 0.016 : 0.01));
      g.strokeStyle = dot.me ? '#f1ede6' : '#111111';
      g.stroke();
    }
  };
}
