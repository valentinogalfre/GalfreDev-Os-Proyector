import * as THREE from 'three';
import { rng } from './noise';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function css(color: number, alpha = 1): string {
  return `rgba(${(color >> 16) & 255},${(color >> 8) & 255},${color & 255},${alpha})`;
}

export interface RoadLook {
  base: number;
  grain: number;
  edge: number;
  dash: number;
  /** Metros de pista que cubre una repetición de la textura. */
  period: number;
  width: number;
}

/** Asfalto con sus líneas pintadas. La u cruza la pista y la v avanza en metros. */
export function roadTexture(look: RoadLook, anisotropy: number): THREE.Texture {
  const W = 512, H = 1024;
  const [c, g] = canvas(W, H);
  const rand = rng(7);
  g.fillStyle = css(look.base);
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 26000; i++) {
    const v = rand();
    g.fillStyle = v > 0.5 ? css(0xffffff, look.grain * rand()) : css(0x000000, look.grain * 1.6 * rand());
    g.fillRect(rand() * W, rand() * H, 1 + rand() * 2, 1 + rand() * 2);
  }
  // Huellas de goma: dos franjas más oscuras por carril.
  for (const u of [0.2, 0.38, 0.62, 0.8]) {
    const grad = g.createLinearGradient((u - 0.07) * W, 0, (u + 0.07) * W, 0);
    grad.addColorStop(0, css(0, 0));
    grad.addColorStop(0.5, css(0, 0.16));
    grad.addColorStop(1, css(0, 0));
    g.fillStyle = grad;
    g.fillRect((u - 0.07) * W, 0, 0.14 * W, H);
  }
  const px = W / look.width;
  g.fillStyle = css(look.edge, 0.92);
  g.fillRect(0.35 * px, 0, 0.16 * px, H);
  g.fillRect(W - 0.51 * px, 0, 0.16 * px, H);
  g.fillStyle = css(look.dash, 0.92);
  const dash = H / look.period;
  for (let m = 0; m < look.period; m += 8) g.fillRect(W / 2 - 0.07 * px, m * dash, 0.14 * px, 3.2 * dash);
  // Desgaste de la pintura.
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = css(look.base, 0.5 * rand());
    g.fillRect(rand() * W, rand() * H, 2, 1 + rand() * 5);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 1 / look.period);
  t.anisotropy = anisotropy;
  return t;
}

/** Ruido que encaja al repetirse, para charcos y manchas. */
function tileNoise(size: number, cells: number, seed: number): Float32Array {
  const rand = rng(seed);
  const lattice = new Float32Array(cells * cells).map(() => rand());
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const fx = (x / size) * cells, fy = (y / size) * cells;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const u = fx - x0, v = fy - y0;
    const su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
    const at = (i: number, j: number) => lattice[(j % cells) * cells + (i % cells)];
    out[y * size + x] = at(x0, y0) * (1 - su) * (1 - sv) + at(x0 + 1, y0) * su * (1 - sv) + at(x0, y0 + 1) * (1 - su) * sv + at(x0 + 1, y0 + 1) * su * sv;
  }
  return out;
}

/** Mapa de rugosidad de pista mojada: charcos lisos entre asfalto áspero. */
export function wetTexture(period: number, anisotropy: number): THREE.Texture {
  const S = 256;
  const [c, g] = canvas(S, S);
  const a = tileNoise(S, 7, 3), b = tileNoise(S, 29, 9);
  const img = g.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const n = a[i] * 0.6 + b[i] * 0.4;
    const rough = 0.2 + 0.16 * Math.min(1, Math.max(0, (n - 0.4) * 3));
    img.data.set([255, rough * 255, 0, 255], i * 4);
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2 / period);
  t.anisotropy = anisotropy;
  return t;
}

/** Franjas a lo largo de la pista: pianos, cinta, bordes. */
export function stripes(a: number, b: number, metres: number): THREE.Texture {
  const [c, g] = canvas(8, 64);
  g.fillStyle = css(a);
  g.fillRect(0, 0, 8, 32);
  g.fillStyle = css(b);
  g.fillRect(0, 32, 8, 32);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 1 / metres);
  t.magFilter = THREE.NearestFilter;
  return t;
}

/** Degradé de un borde al otro, para los reflejos pintados sobre la pista. */
export function fade(): THREE.Texture {
  const [c, g] = canvas(64, 4);
  const grad = g.createLinearGradient(0, 0, 64, 0);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,.35)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 4);
  return new THREE.CanvasTexture(c);
}

/** Fachada de noche: una grilla de ventanas, pocas prendidas. */
export function windows(seed: number): THREE.Texture {
  const cell = 32, cols = 8, rows = 16;
  const [c, g] = canvas(cols * cell, rows * cell);
  const rand = rng(seed);
  g.fillStyle = '#06060b';
  g.fillRect(0, 0, c.width, c.height);
  const lit = ['#ffd9a0', '#ffe9c8', '#9fd8ff', '#ff7ad9', '#fff1d6', '#ffd9a0'];
  for (let r = 0; r < rows; r++) {
    // Algunos pisos enteros prendidos, como oficinas.
    const floor = rand() < 0.12;
    for (let k = 0; k < cols; k++) {
      const on = rand() < (floor ? 0.85 : 0.2);
      g.globalAlpha = on ? 0.35 + rand() * 0.65 : 1;
      g.fillStyle = on ? lit[Math.floor(rand() * lit.length)] : '#0b0c14';
      g.fillRect(k * cell + 7, r * cell + 8, 18, 15);
    }
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Papel cuadriculado de la lámina de construcción. */
export function grid(paper: number, line: number, anisotropy: number): THREE.Texture {
  const S = 512;
  const [c, g] = canvas(S, S);
  g.fillStyle = css(paper);
  g.fillRect(0, 0, S, S);
  g.strokeStyle = css(line, 0.35);
  g.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const p = (i / 5) * S + 0.5;
    g.beginPath();
    g.moveTo(p, 0); g.lineTo(p, S);
    g.moveTo(0, p); g.lineTo(S, p);
    g.stroke();
  }
  g.strokeStyle = css(line, 0.9);
  g.lineWidth = 2;
  g.strokeRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = anisotropy;
  return t;
}

/** Un rótulo: texto en la tipografía de la marca, sobre un bloque de color o suelto. */
export function label(text: string, ink: number, block: number | null, w = 256, h = 64): THREE.Texture {
  const [c, g] = canvas(w, h);
  if (block !== null) {
    g.fillStyle = css(block);
    g.fillRect(0, 0, w, h);
  }
  g.fillStyle = css(ink);
  g.font = `800 ${Math.round(h * 0.68)}px Archivo, system-ui, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, w / 2, h * 0.54);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** La ladera de un cerro de colores: estratos ondulados, con surcos de erosión. Encaja al repetirse a lo ancho. */
export function strata(bands: number[], seed: number): THREE.Texture {
  const W = 1024, H = 256;
  const [c, g] = canvas(W, H);
  const wave = tileNoise(W, 6, seed), fine = tileNoise(W, 40, seed + 1), streak = tileNoise(W, 150, seed + 2);
  const img = g.createImageData(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    // Las tres capas de ruido se leen en una fila cada una: solo importa cómo cambian a lo ancho.
    const lift = wave[x] * 2.2 + fine[x] * 0.5 + fine[((y * 3) % W) * W + x] * 0.25;
    const band = (1 - y / H) * bands.length * 0.9 + lift;
    const k = ((Math.floor(band) % bands.length) + bands.length) % bands.length;
    const edge = band - Math.floor(band);
    const shade = (edge < 0.08 ? 0.72 : 1) * (0.78 + 0.3 * streak[x]) * (0.9 + 0.2 * fine[((y * 7) % W) * W + ((x * 3) % W)]);
    const color = bands[k], i = (y * W + x) * 4;
    img.data[i] = ((color >> 16) & 255) * shade;
    img.data[i + 1] = ((color >> 8) & 255) * shade;
    img.data[i + 2] = (color & 255) * shade;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}
