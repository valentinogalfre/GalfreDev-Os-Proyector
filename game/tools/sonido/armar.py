"""
Arma el archivo de sonido de la carrera a partir de grabaciones de dominio público (CC0, freesound.org).

  python3 armar.py <carpeta con los .wav mono a 22050 Hz> <salida.wav> <salida.ts>

Qué grabaciones hacen falta y de dónde salen está en LEEME.md.

El motor sale de una tirada en banco de pruebas en la que el auto sube de vueltas. Se toma el tramo donde sube
despacio, se le aplana el tono (dentro del tramo la grabación sigue subiendo) y se cierra en bucle con un número
entero de ciclos del motor. En el juego ese bucle se acelera o se frena según las vueltas de cada auto.
"""
import json, sys
import numpy as np, scipy.io.wavfile as wav, scipy.interpolate as ip

SR = 22050
GUARD = int(0.02 * SR)   # lo que se repite a cada lado de un bucle, para que el remuestreo no encuentre un borde
GAP = int(0.05 * SR)

def load(path):
    sr, x = wav.read(path)
    assert sr == SR, path
    return x.astype(float) / 32768

def f0(seg, lo, hi):
    seg = seg - seg.mean(); n = len(seg)
    ac = np.fft.irfft(abs(np.fft.rfft(seg * np.hanning(n), 2 * n)) ** 2)[:n]; ac /= ac[0]
    a, b = int(SR / hi), int(SR / lo)
    k = a + np.argmax(ac[a:b])
    p, q, r = ac[k - 1], ac[k], ac[k + 1]
    d = 0.5 * (p - r) / (p - 2 * q + r) if (p - 2 * q + r) else 0
    return SR / (k + d), ac[k]

def curve(x, t0, t1, start):
    """El tono a lo largo de la subida, siguiendo cada estimación cerca de la anterior para no saltar de octava."""
    t, f, pts = t0, start, []
    while t < t1:
        g, c = f0(x[int(t * SR):int((t + 0.16) * SR)], f * 0.9, f * 1.13)
        pts.append((t + 0.08, g, c)); f = g; t += 0.04
    pts = np.array(pts)
    return ip.UnivariateSpline(pts[:, 0], np.log(pts[:, 1]), w=pts[:, 2] ** 2, s=len(pts) * 0.0006)

def engine_loop(x, logf, a, b, target, fade=0.06):
    """
    Todo el tramo [a, b] de la subida llevado a un tono fijo y cerrado en bucle con un número entero de ciclos. Tiene
    que ser largo: un bucle de medio segundo se repite tan igual a sí mismo que suena a sintetizador.
    """
    edge = int(0.05 * SR)
    t = np.arange(a - 0.05, b + 0.05, 1 / SR)
    # Fase acumulada: en la señal aplanada, cada período dura exactamente 1/target.
    phase = np.cumsum(np.exp(logf(t))) / SR
    cycles = int((phase[-edge] - phase[edge] - fade * target) // 12) * 12
    n, k = int(round(cycles / target * SR)), int(fade * SR)
    want = phase[edge] + np.arange(n + k + 1) * target / SR
    flat = np.interp(np.interp(want, phase, t) * SR, np.arange(len(x)), x)
    loop = flat[:n].copy()
    ramp = np.linspace(0, 1, k)
    # El final se funde con lo que venía antes del principio: están en fase, así que la mezcla es lineal.
    loop[:k] = flat[:k] * ramp + flat[n:n + k] * (1 - ramp)
    return loop / np.sqrt((loop ** 2).mean()) * 0.16

def noise_loop(x, a, b, fade):
    """Un bucle de algo que no tiene tono (gomas, ripio): los extremos se funden a potencia constante."""
    seg = x[int(a * SR):int(b * SR)]
    k = int(fade * SR); n = len(seg) - k
    loop = seg[:n].copy()
    w = np.linspace(0, np.pi / 2, k)
    loop[:k] = seg[:k] * np.sin(w) + seg[n:n + k] * np.cos(w)
    return loop / np.sqrt((loop ** 2).mean()) * 0.16

def shot(x, a, b, tail):
    seg = x[int(a * SR):int(b * SR)].copy()
    k = int(tail * SR)
    seg[-k:] *= np.linspace(1, 0, k) ** 2
    seg[:32] *= np.linspace(0, 1, 32)
    return seg / abs(seg).max() * 0.9

def main(src, out_wav, out_ts):
    dyno = load(f'{src}/dyno.wav')
    logf = curve(dyno, 11.5, 24.4, 160)
    parts, table, at = [], {}, GAP

    def put(name, data, loop, extra=None):
        nonlocal at
        if loop:
            data = np.concatenate([data[-GUARD:], data, data[:GUARD]])
            entry = {'from': (at + GUARD) / SR, 'to': (at + len(data) - GUARD) / SR}
        else:
            entry = {'from': at / SR, 'to': (at + len(data)) / SR}
        entry.update(extra or {})
        table[name] = {k: round(v, 5) for k, v in entry.items()}
        parts.extend([data, np.zeros(GAP)])
        at += len(data) + GAP

    # Entre los 13 y los 19 segundos el motor sube despacio y parejo: de ahí sale un bucle largo y natural.
    loop = engine_loop(dyno, logf, 13.0, 19.0, 175)
    got, sure = f0(loop[:SR], 140, 220)
    seam = abs(loop[0] - loop[-1]) / np.abs(np.diff(loop)).mean()
    print(f'motor: {len(loop) / SR:.2f} s a 175 Hz · medido {got:.1f} Hz (certeza {sure:.2f}) · salto en la costura {seam:.1f}x el paso medio')
    put('motor', loop, True, {'hz': 175})
    put('gomas', noise_loop(load(f'{src}/614627.wav'), 3.5, 5.7, 0.2), True)
    put('ripio', noise_loop(load(f'{src}/341069.wav'), 1.0, 3.2, 0.2), True)
    put('golpe0', shot(load(f'{src}/332056.wav'), 0, 0.33, 0.08), False)
    put('golpe1', shot(load(f'{src}/332058.wav'), 0, 0.93, 0.15), False)
    put('golpe2', shot(load(f'{src}/592388.wav'), 0, 2.0, 0.5), False)
    put('nitro', shot(load(f'{src}/404333.wav'), 0, 2.4, 0.3), False)

    whole = np.concatenate([np.zeros(GAP)] + parts)
    wav.write(out_wav, SR, (np.clip(whole, -1, 1) * 32767).astype(np.int16))
    lines = ',\n'.join(f'  {name}: {json.dumps(entry)}' for name, entry in table.items())
    open(out_ts, 'w').write('// Hecho por tools/sonido/armar.py: dónde está cada sonido dentro de sonido.wav, en segundos.\n'
                            f'export const CLIPS = {{\n{lines}\n}};\n')
    print(f'{len(whole) / SR:.1f} s, {len(whole) * 2 // 1024} KB')

main(*sys.argv[1:4])
