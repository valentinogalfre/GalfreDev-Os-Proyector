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
    const k = Math.min(1, Math.max(0, (n - 0.4) * 2.6));
    const rough = 0.11 + 0.17 * k * k * (3 - 2 * k);
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

/** Fachada de noche. Tres tipos: oficinas en grilla, pisos corridos de vidrio y viviendas con pocas luces. */
export function windows(seed: number, kind: 'grid' | 'bands' | 'homes'): THREE.Texture {
  const cell = 32, cols = 8, rows = 16;
  const [c, g] = canvas(cols * cell, rows * cell);
  const rand = rng(seed);
  g.fillStyle = '#080a12';
  g.fillRect(0, 0, c.width, c.height);
  // Los parantes de la fachada: apenas más claros, para que la torre tenga forma aunque esté apagada.
  g.fillStyle = '#121624';
  for (let k = 0; k <= cols; k++) g.fillRect(k * cell - 1, 0, 2, c.height);
  const cool = ['#cfe6ff', '#9fd8ff', '#e8f2ff', '#7fd0ff'], warm = ['#ffd9a0', '#ffe9c8', '#ffc078', '#ff9ad0'];
  for (let r = 0; r < rows; r++) {
    const y = r * cell;
    if (kind === 'bands') {
      // Pisos enteros de vidrio: algunos prendidos de punta a punta, otros por tramos.
      const on = rand();
      g.fillStyle = '#0d111d';
      g.fillRect(0, y + 9, c.width, 16);
      if (on < 0.45) {
        const from = on < 0.2 ? 0 : Math.floor(rand() * cols), to = on < 0.2 ? cols : Math.min(cols, from + 1 + Math.floor(rand() * 5));
        g.globalAlpha = 0.45 + rand() * 0.55;
        g.fillStyle = cool[Math.floor(rand() * cool.length)];
        g.fillRect(from * cell + 2, y + 9, (to - from) * cell - 4, 16);
        g.globalAlpha = 1;
      }
      continue;
    }
    const office = kind === 'grid' && rand() < 0.16;
    for (let k = 0; k < cols; k++) {
      const on = rand() < (office ? 0.9 : kind === 'grid' ? 0.26 : 0.16);
      const tones = kind === 'homes' || rand() < 0.2 ? warm : cool;
      g.globalAlpha = on ? 0.4 + rand() * 0.6 : 1;
      g.fillStyle = on ? tones[Math.floor(rand() * tones.length)] : '#0c0f1a';
      if (kind === 'homes') g.fillRect(k * cell + 9, y + 9, 13, 15); else g.fillRect(k * cell + 5, y + 7, 22, 18);
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

/** Un rótulo: texto en una tipografía de la marca ([font] es peso y familia), sobre un bloque de color o suelto. */
export function label(text: string, ink: number, block: number | null, w = 256, h = 64, font = "800 Archivo"): THREE.Texture {
  const [c, g] = canvas(w, h);
  if (block !== null) {
    g.fillStyle = css(block);
    g.fillRect(0, 0, w, h);
  }
  g.fillStyle = css(ink);
  let size = Math.round(h * 0.68);
  g.font = `${font.replace(' ', ` ${size}px `)}, system-ui, sans-serif`;
  // Si el texto no entra a lo ancho, se achica hasta que entre.
  const wide = g.measureText(text).width;
  if (wide > w * 0.88) size = Math.floor((size * w * 0.88) / wide);
  g.font = `${font.replace(' ', ` ${size}px `)}, system-ui, sans-serif`;
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

/** Un degradé vertical de dos colores, para laderas lejanas ya metidas en la bruma. */
export function gradient(top: number, bottom: number): THREE.Texture {
  const [c, g] = canvas(4, 64);
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, css(top));
  grad.addColorStop(1, css(bottom));
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

/** Pedregullo: manchas claras y oscuras sobre gris medio, para multiplicar sobre el color del suelo. */
export function gravel(seed: number, anisotropy: number): THREE.Texture {
  const S = 256;
  const [c, g] = canvas(S, S);
  const rand = rng(seed);
  const soft = tileNoise(S, 9, seed);
  const img = g.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const v = 215 + (soft[i] - 0.5) * 40 + (rand() - 0.5) * 34;
    img.data.set([v, v, v, 255], i * 4);
  }
  g.putImageData(img, 0, 0);
  for (let k = 0; k < 260; k++) {
    const x = rand() * S, y = rand() * S, r = 0.6 + rand() * rand() * 3.4;
    g.fillStyle = rand() < 0.5 ? 'rgba(70,60,55,.5)' : 'rgba(255,250,240,.6)';
    for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) { g.beginPath(); g.ellipse(x + dx, y + dy, r, r * (0.5 + rand() * 0.5), rand() * 3, 0, 6.3); g.fill(); }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = anisotropy;
  return t;
}
