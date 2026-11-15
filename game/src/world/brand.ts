import * as THREE from 'three';
// El manual pide que el logo sea siempre un archivo: se toma el del kit de marca que ya trae el
// launcher, sin redibujarlo ni tipearlo, y se pinta solo en hueso o carbón sobre un bloque liso.
import svg from '../../../app/src/main/assets/remote/logo.svg?raw';

const [, , WIDE, TALL] = svg.match(/viewBox="([^"]+)"/)![1].split(' ').map(Number);
const OUTLINE = new Path2D(svg.match(/ d="([^"]+)"/)![1]);

function css(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

/** Pinta el wordmark centrado en [g], ocupando [fill] del ancho o del alto, lo que llegue primero. */
export function drawWordmark(g: CanvasRenderingContext2D, w: number, h: number, ink: number, fill = 0.78): void {
  const scale = Math.min((w * fill) / WIDE, (h * fill) / TALL);
  g.save();
  g.translate((w - WIDE * scale) / 2, (h - TALL * scale) / 2);
  g.scale(scale, scale);
  g.fillStyle = css(ink);
  g.fill(OUTLINE);
  g.restore();
}

/** El wordmark en una textura, sobre un bloque de color o suelto. */
export function wordmark(ink: number, block: number | null, w = 1024, h = 256, fill = 0.78): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  if (block !== null) {
    g.fillStyle = css(block);
    g.fillRect(0, 0, w, h);
  }
  drawWordmark(g, w, h, ink, fill);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
