import * as THREE from 'three';

/**
 * Hornea la luz en el paisaje. El sol y el cielo no se mueven y el paisaje tampoco, así que la luz de cada vértice se
 * calcula una vez al cargar y queda guardada como color. El proyector deja de calcularla en cada punto de la pantalla
 * (medido en el equipo: unos 2 ms por cuadro) y las piezas repetidas pasan a ser una sola malla.
 */
export function bakeLight(scene: THREE.Scene): void {
  scene.updateMatrixWorld(true);
  const suns: { dir: THREE.Vector3; color: THREE.Color }[] = [], skies: { up: THREE.Vector3; sky: THREE.Color; ground: THREE.Color }[] = [];
  scene.traverse((o) => {
    const sun = o as THREE.DirectionalLight, dome = o as THREE.HemisphereLight;
    // La división por π es la del material difuso: así el resultado es el mismo que calculaba la placa.
    if (sun.isDirectionalLight) suns.push({ dir: sun.position.clone().sub(sun.target.position).normalize(), color: sun.color.clone().multiplyScalar(sun.intensity / Math.PI) });
    if (dome.isHemisphereLight) skies.push({ up: dome.position.clone().normalize(), sky: dome.color.clone().multiplyScalar(dome.intensity / Math.PI), ground: dome.groundColor.clone().multiplyScalar(dome.intensity / Math.PI) });
  });
  const flatOf = new Map<THREE.Material, THREE.MeshBasicMaterial>();
  const unlit = (from: THREE.MeshLambertMaterial): THREE.MeshBasicMaterial => {
    let to = flatOf.get(from);
    if (!to) flatOf.set(from, to = new THREE.MeshBasicMaterial({
      color: from.color, map: from.map, transparent: from.transparent, opacity: from.opacity, side: from.side, fog: from.fog,
      alphaTest: from.alphaTest, depthWrite: from.depthWrite, vertexColors: true,
    }));
    return to;
  };
  const n = new THREE.Vector3(), p = new THREE.Vector3(), tint = new THREE.Color(), whole = new THREE.Matrix4(), turn = new THREE.Matrix3();
  const todo: THREE.Mesh[] = [];
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh, m = mesh.material as THREE.MeshLambertMaterial;
    if (mesh.isMesh && !Array.isArray(m) && (m.isMeshLambertMaterial || (m as unknown as THREE.MeshStandardMaterial).isMeshStandardMaterial) && mesh.geometry.attributes.normal) todo.push(mesh);
  });
  for (const mesh of todo) {
    const from = mesh.material as THREE.MeshLambertMaterial, many = mesh as THREE.InstancedMesh;
    const copies = many.isInstancedMesh ? many.count : 1;
    let source = mesh.geometry;
    if (from.flatShading && source.index) { source = source.toNonIndexed(); source.computeVertexNormals(); }
    const at = source.attributes.position, normal = source.attributes.normal, uv = source.attributes.uv, own = from.vertexColors ? source.attributes.color : undefined;
    const count = at.count, corners = source.index ? source.index.count : count;
    const position = new Float32Array(copies * count * 3), color = new Float32Array(copies * count * 3), coord = uv ? new Float32Array(copies * count * 2) : null;
    const index = new Uint32Array(copies * corners);
    for (let c = 0; c < copies; c++) {
      if (many.isInstancedMesh) { many.getMatrixAt(c, whole); whole.premultiply(mesh.matrixWorld); } else whole.copy(mesh.matrixWorld);
      turn.getNormalMatrix(whole);
      for (let i = 0; i < count; i++) {
        const o = (c * count + i) * 3;
        p.fromBufferAttribute(at, i).applyMatrix4(whole).toArray(position, o);
        n.fromBufferAttribute(normal, i).applyMatrix3(turn).normalize();
        let r = 0, g = 0, b = 0;
        for (const { up, sky, ground } of skies) { const w = 0.5 * n.dot(up) + 0.5; r += ground.r + (sky.r - ground.r) * w; g += ground.g + (sky.g - ground.g) * w; b += ground.b + (sky.b - ground.b) * w; }
        for (const { dir, color: shine } of suns) { const w = Math.max(0, n.dot(dir)); r += shine.r * w; g += shine.g * w; b += shine.b * w; }
        if (own) { r *= own.getX(i); g *= own.getY(i); b *= own.getZ(i); }
        if (many.instanceColor) { many.getColorAt(c, tint); r *= tint.r; g *= tint.g; b *= tint.b; }
        color[o] = r; color[o + 1] = g; color[o + 2] = b;
        if (coord) { coord[(c * count + i) * 2] = uv.getX(i); coord[(c * count + i) * 2 + 1] = uv.getY(i); }
      }
      for (let j = 0; j < corners; j++) index[c * corners + j] = c * count + (source.index ? source.index.getX(j) : j);
    }
    const baked = new THREE.BufferGeometry();
    baked.setAttribute('position', new THREE.BufferAttribute(position, 3));
    baked.setAttribute('color', new THREE.BufferAttribute(color, 3));
    if (coord) baked.setAttribute('uv', new THREE.BufferAttribute(coord, 2));
    baked.setIndex(new THREE.BufferAttribute(index, 1));
    // La malla nueva ya está en su lugar del mundo: reemplaza a la original sin heredar su posición.
    const still = new THREE.Mesh(baked, unlit(from));
    still.name = mesh.name;
    still.renderOrder = mesh.renderOrder;
    still.matrixAutoUpdate = false;
    scene.add(still);
    mesh.removeFromParent();
    if (source !== mesh.geometry) source.dispose();
    mesh.geometry.dispose();
  }
}
