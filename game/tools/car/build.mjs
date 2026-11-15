// Convierte el "Car Concept" de Khronos (CC-BY 4.0) en un auto liviano para el juego:
// sin interior, pocas piezas, pocos triángulos y una sola textura de oclusión.
import { NodeIO, PropertyType } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, flatten, join, prune, quantize, simplifyPrimitive, textureCompress, weld } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const [src, out, budget = '1'] = process.argv.slice(2);
const scale = Number(budget);

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(src);
const root = doc.getRoot();
const scene = root.listScenes()[0];

// El interior no se ve tras el vidrio oscuro; lo de atrás sí, porque cierra la cola del auto.
const DROP = /^(Interior(?!Rear)|Engine|BodyHoodInterior|BodyWindshieldWipers|License|Axles)/;
const SPARE_WHEELS = /^Wheel(FrontR|RearL|RearR)$/;

// Las pinzas de freno no giran: pasan al cuerpo antes de sacar tres de las cuatro ruedas.
for (const node of root.listNodes()) {
  if (!/BrakePad$/.test(node.getName())) continue;
  const world = node.getWorldMatrix();
  scene.addChild(node);
  node.setMatrix(world);
}
for (const node of root.listNodes()) {
  if (DROP.test(node.getName()) || SPARE_WHEELS.test(node.getName())) {
    node.traverse((n) => n.setMesh(null));
    node.listChildren().filter((c) => !/^Body/.test(c.getName())).forEach((c) => c.dispose());
    if (SPARE_WHEELS.test(node.getName())) node.dispose();
  }
}

// Materiales: quedan el color, el metal y la oclusión. Lo demás lo decide el juego.
const ROLE = [
  [/^Paint 1/, 'paint'], [/^Paint 2/, 'trim'], [/^Glass$/, 'glass'], [/^Brakelight$/, 'tail'],
  [/^Signallight$/, 'signal'], [/^Headlight$/, 'head'], [/^Brake$/, 'caliper'],
  [/^(Rim1|Rim2|Disc)$/, 'rim'], [/^(Tireside|Tiretread)$/, 'tyre'], [/^Mirror$/, 'glass'],
];
const roles = new Map();
const used = new Set();
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial();
    const name = mat?.getName() ?? '';
    const role = ROLE.find(([re]) => re.test(name))?.[1] ?? 'dark';
    if (!roles.has(role)) {
      const fresh = doc.createMaterial(role).setRoughnessFactor(0.5).setMetallicFactor(0);
      if (role === 'paint' || role === 'trim' || role === 'dark') fresh.setOcclusionTexture(mat?.getOcclusionTexture() ?? null);
      roles.set(role, fresh);
    }
    prim.setMaterial(roles.get(role));
    used.add(role);
    for (const semantic of prim.listSemantics()) {
      const keep = semantic === 'POSITION' || semantic === 'NORMAL' ||
        (semantic === 'TEXCOORD_1' && roles.get(role).getOcclusionTexture());
      if (!keep) prim.setAttribute(semantic, null);
    }
  }
}
for (const mat of root.listMaterials()) if (!roles.has(mat.getName()) || roles.get(mat.getName()) !== mat) mat.dispose();

await doc.transform(dedup({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.TEXTURE] }), weld());

await MeshoptSimplifier.ready;
const RATIO = { paint: 0.55, trim: 0.5, dark: 0.5, glass: 0.4, rim: 0.1, tyre: 1, caliper: 0.04, tail: 1, head: 1, signal: 1 };
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const role = prim.getMaterial().getName();
    const ratio = Math.min(1, RATIO[role] * scale);
    // Las piezas chicas y repetidas aguantan más error que los paneles, donde se nota en el reflejo.
    const error = scale < 1 || role === 'rim' || role === 'caliper' ? 0.012 : 0.002;
    if (ratio < 1) simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio, error, lockBorder: true });
  }
}

await doc.transform(
  flatten(),
  join(),
  prune({ propertyTypes: [PropertyType.NODE, PropertyType.MESH, PropertyType.ACCESSOR, PropertyType.TEXTURE, PropertyType.PRIMITIVE] }),
  textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [1024, 1024], quality: 82 }),
  quantize({ quantizePosition: 14, quantizeNormal: 8, quantizeTexcoord: 12 }),
);

let tris = 0;
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const n = prim.getIndices().getCount() / 3; tris += n;
  console.log(prim.getMaterial().getName().padEnd(8), n);
}
await io.write(out, doc);
console.log('triángulos', tris, 'texturas', root.listTextures().map((t) => t.getSize().join('x') + ' ' + (t.getImage().byteLength / 1024 | 0) + 'kB').join(', '));
