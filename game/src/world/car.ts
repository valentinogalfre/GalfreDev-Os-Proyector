import * as THREE from 'three';

interface Station { z: number; w: number; y0: number; y1: number }

const RING = 24;

function spow(v: number, e: number): number {
  return Math.sign(v) * Math.pow(Math.abs(v), e);
}

/** Une secciones redondeadas a lo largo del auto. [taper] angosta la parte de arriba. */
function loft(stations: Station[], exponent: number, taper: number): THREE.BufferGeometry {
  const p: number[] = [], index: number[] = [];
  stations.forEach((s) => {
    const mid = (s.y0 + s.y1) / 2, hh = (s.y1 - s.y0) / 2;
    for (let k = 0; k < RING; k++) {
      const a = (k / RING) * Math.PI * 2;
      const up = Math.max(0, Math.sin(a));
      p.push(s.w * spow(Math.cos(a), 2 / exponent) * (1 - (1 - taper) * up * up), mid + hh * spow(Math.sin(a), 2 / exponent), s.z);
    }
  });
  for (let i = 0; i < stations.length - 1; i++) {
    for (let k = 0; k < RING; k++) {
      const a = i * RING + k, b = i * RING + ((k + 1) % RING), c = a + RING, d = b + RING;
      index.push(a, b, c, b, d, c);
    }
  }
  for (const [at, flip] of [[0, false], [stations.length - 1, true]] as [number, boolean][]) {
    const s = stations[at], center = p.length / 3;
    p.push(0, (s.y0 + s.y1) / 2, s.z);
    for (let k = 0; k < RING; k++) {
      const a = at * RING + k, b = at * RING + ((k + 1) % RING);
      if (flip) index.push(center, a, b); else index.push(center, b, a);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

const HULL: Station[] = [
  { z: -2.2, w: 0.74, y0: 0.4, y1: 0.8 },
  { z: -1.95, w: 0.93, y0: 0.26, y1: 0.93 },
  { z: -1.0, w: 0.97, y0: 0.2, y1: 0.9 },
  { z: 0.0, w: 0.97, y0: 0.2, y1: 0.82 },
  { z: 1.0, w: 0.96, y0: 0.2, y1: 0.74 },
  { z: 1.85, w: 0.9, y0: 0.22, y1: 0.63 },
  { z: 2.2, w: 0.7, y0: 0.3, y1: 0.5 },
];

const CABIN: Station[] = [
  { z: -1.8, w: 0.6, y0: 0.8, y1: 0.88 },
  { z: -1.0, w: 0.76, y0: 0.8, y1: 1.17 },
  { z: -0.2, w: 0.78, y0: 0.78, y1: 1.23 },
  { z: 0.5, w: 0.76, y0: 0.74, y1: 1.1 },
  { z: 1.2, w: 0.66, y0: 0.68, y1: 0.76 },
];

let glowTexture: THREE.Texture | null = null;

export function glow(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

export function halo(color: number, size: number, opacity = 1): THREE.Sprite {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color, blending: THREE.AdditiveBlending, depthWrite: false, opacity, fog: false }));
  s.scale.setScalar(size);
  return s;
}

export interface CarStyle { paint: number; accent: number; underglow?: number }

/** Un cupé armado con código: mira hacia +Z y apoya las ruedas en y = 0. */
export function buildCar(style: CarStyle): THREE.Group {
  const car = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: style.paint, metalness: 0.55, roughness: 0.28, envMapIntensity: 1.3 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x06080a, metalness: 0.9, roughness: 0.08, envMapIntensity: 1.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0b0b0b, metalness: 0.2, roughness: 0.7 });
  const rim = new THREE.MeshStandardMaterial({ color: 0xbfc3c7, metalness: 0.9, roughness: 0.3 });

  car.add(new THREE.Mesh(loft(HULL, 3.4, 0.84), paint));
  car.add(new THREE.Mesh(loft(CABIN, 2.6, 0.72), glass));

  const tyre = new THREE.CylinderGeometry(0.35, 0.35, 0.28, 20).rotateZ(Math.PI / 2);
  const disc = new THREE.CylinderGeometry(0.22, 0.22, 0.29, 10).rotateZ(Math.PI / 2);
  for (const x of [-0.86, 0.86]) for (const z of [-1.38, 1.36]) {
    const wheel = new THREE.Group();
    wheel.add(new THREE.Mesh(tyre, dark), new THREE.Mesh(disc, rim));
    wheel.position.set(x, 0.35, z);
    wheel.name = 'wheel';
    car.add(wheel);
  }

  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.04, 0.34), dark);
  wing.position.set(0, 1.06, -2.02);
  car.add(wing);
  for (const x of [-0.55, 0.55]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.16), dark);
    post.position.set(x, 0.95, -2.0);
    car.add(post);
  }
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 0.5), dark);
  splitter.position.set(0, 0.2, 2.02);
  car.add(splitter);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.16, 3.0), dark);
  sill.position.set(0, 0.24, 0);
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.3), dark);
  diffuser.position.set(0, 0.36, -2.1);
  car.add(sill, diffuser);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.07, 0.05), new THREE.MeshBasicMaterial({ color: 0xff2a1a, fog: false }));
  tail.position.set(0, 0.72, -2.2);
  car.add(tail);
  for (const x of [-0.56, 0.56]) {
    const h = halo(0xff2010, 0.95, 0.55);
    h.position.set(x, 0.72, -2.26);
    car.add(h);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.05), new THREE.MeshBasicMaterial({ color: 0xfff4dc, fog: false }));
    lamp.position.set(x * 1.05, 0.53, 2.17);
    car.add(lamp);
  }
  // El charco de luz de los faros sobre el asfalto.
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 11), new THREE.MeshBasicMaterial({ map: glow(), color: 0xffe2b0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.3 }));
  beam.rotation.x = -Math.PI / 2;
  beam.position.set(0, 0.05, 6.4);
  car.add(beam);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 1.3), new THREE.MeshBasicMaterial({ color: style.accent }));
  stripe.position.set(0, 0.795, 1.45);
  stripe.rotation.x = 0.105;
  car.add(stripe);

  if (style.underglow !== undefined) {
    const under = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 8.6), new THREE.MeshBasicMaterial({ map: glow(), color: style.underglow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9 }));
    under.rotation.x = -Math.PI / 2;
    under.position.y = 0.045;
    car.add(under);
  }
  // Sombra de contacto: una mancha bajo el auto, sin mapa de sombras.
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 5.4), new THREE.MeshBasicMaterial({ map: glow(), color: 0x000000, transparent: true, opacity: 0.85, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  car.add(shadow);
  return car;
}
