"""
Adapta un auto de Quaternius (CC0, poly.pizza) a lo que espera el juego, sin tocar su geometría:

  python3 adaptar.py <entrada.glb> <salida.glb>

- Los materiales pasan a llamarse por lo que son (paint, trim, glass, head, tail, dark, tyre, rim): el juego decide el
  color de cada pieza por ese nombre.
- Queda una sola rueda, la delantera izquierda. De ella el juego saca dónde van las cuatro y de qué tamaño son.
- El auto se lleva al largo del auto de la carrera y se apoya en el piso; la distancia entre ejes va anotada en la escena.
"""
import json, struct, sys

LENGTH = 4.5
ROLE = {'White': 'paint', 'Orange': 'paint', 'DarkOrange': 'trim', 'Windows': 'glass', 'Grey': 'dark', 'Headlights': 'head', 'TailLights': 'tail'}
WHEEL = {'Black': 'tyre', 'Grey': 'rim'}

src, out = sys.argv[1:3]
blob = open(src, 'rb').read()
size = struct.unpack('<I', blob[12:16])[0]
gltf, rest = json.loads(blob[20:20 + size]), blob[20 + size:]
nodes, meshes, materials, accessors = gltf['nodes'], gltf['meshes'], gltf['materials'], gltf['accessors']

def box(node):
    lo, hi = [1e9] * 3, [-1e9] * 3
    for p in meshes[node['mesh']]['primitives']:
        a = accessors[p['attributes']['POSITION']]
        lo, hi = [min(x, y) for x, y in zip(lo, a['min'])], [max(x, y) for x, y in zip(hi, a['max'])]
    return lo, hi

wheels = [n for n in nodes if 'Wheel' in n.get('name', '')]
body = next(n for n in nodes if 'mesh' in n and n not in wheels)
front = next(n for n in wheels if 'FrontLeft' in n['name'])
back = next(n for n in wheels if 'Back' in n['name'])
scale = LENGTH / (box(body)[1][2] - box(body)[0][2])
ground = box(front)[0][1]
wheelbase = ((box(front)[0][2] + box(front)[1][2]) - (box(back)[0][2] + box(back)[1][2])) / 2 * scale

by_name = {}
def material(name):
    if name not in by_name:
        materials.append({'name': name, 'pbrMetallicRoughness': {'baseColorFactor': [1, 1, 1, 1]}})
        by_name[name] = len(materials) - 1
    return by_name[name]
for node, roles in ((body, ROLE), (front, WHEEL)):
    for p in meshes[node['mesh']]['primitives']:
        p['material'] = material(roles[materials[p['material']]['name']])

keep = [nodes.index(body), nodes.index(front)]
for i in keep:
    nodes[i]['scale'] = [scale] * 3
    nodes[i]['translation'] = [0, -ground * scale, 0]
gltf['scenes'][gltf.get('scene', 0)]['nodes'] = keep
gltf['scenes'][gltf.get('scene', 0)]['extras'] = {'wheelbase': round(wheelbase, 4)}

text = json.dumps(gltf, separators=(',', ':')).encode()
text += b' ' * (-len(text) % 4)
open(out, 'wb').write(blob[:8] + struct.pack('<I', 12 + 8 + len(text) + len(rest)) + struct.pack('<I', len(text)) + b'JSON' + text + rest)
print(f'{out}: escala {scale:.3f}, entre ejes {wheelbase:.2f} m, {len(text) + len(rest) + 20} bytes')
