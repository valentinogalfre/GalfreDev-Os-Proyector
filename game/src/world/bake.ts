import * as THREE from 'three';

/**
 * Hornea el paisaje. El sol y el cielo no se mueven y el paisaje tampoco, así que la luz de cada vértice se calcula
 * una vez al cargar y queda guardada como color; el proyector deja de calcularla en cada punto de la pantalla (medido
 * en el equipo: unos 2 ms por cuadro). Y como ya nada depende de dónde está cada pieza, todas las que comparten
 * textura y mezcla se funden en una sola malla: una orden de dibujo en lugar de decenas.
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
  type Source = THREE.MeshLambertMaterial | THREE.MeshBasicMaterial;
  const n = new THREE.Vector3(), p = new THREE.Vector3(), tint = new THREE.Color(), whole = new THREE.Matrix4(), turn = new THREE.Matrix3();
  const batches = new Map<string, THREE.Mesh[]>();
  const moving = (o: THREE.Object3D | null): boolean => o !== null && (o.name === 'sky' || moving(o.parent));
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh, m = mesh.material as Source;
    if (!mesh.isMesh || Array.isArray(m) || moving(mesh)) return;
    const lit = (m as THREE.MeshLambertMaterial).isMeshLambertMaterial || (m as unknown as THREE.MeshStandardMaterial).isMeshStandardMaterial;
    if (!lit && !(m as THREE.MeshBasicMaterial).isMeshBasicMaterial) return;
    // Lo translúcido se ordena pieza por pieza según la distancia; fundirlo lo desordena. Lo aditivo no depende del orden.
    if (m.transparent && m.blending !== THREE.AdditiveBlending) return;
    const key = [m.map?.uuid, m.transparent, m.opacity, m.blending, m.side, m.fog, m.alphaTest, m.depthWrite, mesh.renderOrder].join();
    const list = batches.get(key);
    if (list) list.push(mesh); else batches.set(key, [mesh]);
  });
  for (const meshes of batches.values()) {
    const first = meshes[0].material as Source;
    const parts = meshes.map((mesh) => {
      const from = mesh.material as Source, copies = (mesh as THREE.InstancedMesh).isInstancedMesh ? (mesh as THREE.InstancedMesh).count : 1;
      let source = mesh.geometry;
      if ((from as THREE.MeshLambertMaterial).flatShading && source.index) { source = source.toNonIndexed(); source.computeVertexNormals(); }
      return { mesh, from, copies, source, count: source.attributes.position.count, corners: source.index ? source.index.count : source.attributes.position.count };
    });
    const points = parts.reduce((sum, part) => sum + part.copies * part.count, 0), corners = parts.reduce((sum, part) => sum + part.copies * part.corners, 0);
    const position = new Float32Array(points * 3), color = new Float32Array(points * 3), coord = first.map ? new Float32Array(points * 2) : null;
    const index = new Uint32Array(corners);
    let v = 0, e = 0;
    for (const { mesh, from, copies, source, count, corners: each } of parts) {
      const many = mesh as THREE.InstancedMesh;
      const at = source.attributes.position, normal = source.attributes.normal, uv = source.attributes.uv, own = from.vertexColors ? source.attributes.color : undefined;
      const lit = !(from as THREE.MeshBasicMaterial).isMeshBasicMaterial && normal !== undefined;
      for (let c = 0; c < copies; c++) {
        if (many.isInstancedMesh) { many.getMatrixAt(c, whole); whole.premultiply(mesh.matrixWorld); } else whole.copy(mesh.matrixWorld);
        turn.getNormalMatrix(whole);
        if (many.instanceColor) many.getColorAt(c, tint); else tint.setRGB(1, 1, 1);
        tint.multiply(from.color);
        for (let i = 0; i < count; i++) {
          const o = (v + i) * 3;
          p.fromBufferAttribute(at, i).applyMatrix4(whole).toArray(position, o);
          let r = 1, g = 1, b = 1;
          if (lit) {
            n.fromBufferAttribute(normal, i).applyMatrix3(turn).normalize();
            r = g = b = 0;
            for (const { up, sky, ground } of skies) { const w = 0.5 * n.dot(up) + 0.5; r += ground.r + (sky.r - ground.r) * w; g += ground.g + (sky.g - ground.g) * w; b += ground.b + (sky.b - ground.b) * w; }
            for (const { dir, color: shine } of suns) { const w = Math.max(0, n.dot(dir)); r += shine.r * w; g += shine.g * w; b += shine.b * w; }
          }
          if (own) { r *= own.getX(i); g *= own.getY(i); b *= own.getZ(i); }
          color[o] = r * tint.r; color[o + 1] = g * tint.g; color[o + 2] = b * tint.b;
          if (coord && uv) { coord[(v + i) * 2] = uv.getX(i); coord[(v + i) * 2 + 1] = uv.getY(i); }
        }
        for (let j = 0; j < each; j++) index[e++] = v + (source.index ? source.index.getX(j) : j);
        v += count;
      }
      mesh.removeFromParent();
      if (source !== mesh.geometry) source.dispose();
      mesh.geometry.dispose();
    }
    const baked = new THREE.BufferGeometry();
    baked.setAttribute('position', new THREE.BufferAttribute(position, 3));
    baked.setAttribute('color', new THREE.BufferAttribute(color, 3));
    if (coord) baked.setAttribute('uv', new THREE.BufferAttribute(coord, 2));
    baked.setIndex(new THREE.BufferAttribute(index, 1));
    // La malla nueva ya está en coordenadas del mundo: no hereda la posición de ninguna de las que reemplaza.
    const still = new THREE.Mesh(baked, new THREE.MeshBasicMaterial({
      map: first.map, transparent: first.transparent, opacity: first.opacity, blending: first.blending, side: first.side, fog: first.fog,
      alphaTest: first.alphaTest, depthWrite: first.depthWrite, vertexColors: true,
    }));
    still.renderOrder = meshes[0].renderOrder;
    still.matrixAutoUpdate = false;
    scene.add(still);
  }
}
