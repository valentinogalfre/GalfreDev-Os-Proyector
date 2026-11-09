#!/usr/bin/env python3
"""Lleva el logo del Kit de marca v2 a recursos de Android.

No redibuja nada: toma el `d` de los SVG del kit (la regla es que el logo es un archivo)
y solo lo reparte. Genera:

  res/drawable/logo_wordmark.xml      wordmark, color de tinta del tema
  res/drawable/logo_symbol.xml        la g sola
  res/drawable/ic_launcher_foreground.xml, ic_launcher_background.xml
  res/drawable-xhdpi/banner.png       banner 320x180 para launchers de Android TV
  assets/brand/wordmark.txt           una letra por línea, para animar el arranque

Uso: python3 scripts/brand/build_logo.py "<carpeta 01_Logo del kit>"
"""
import pathlib
import re
import subprocess
import sys
import tempfile

REPO = pathlib.Path(__file__).resolve().parents[2]
RES = REPO / "app/src/main/res"
ASSETS = REPO / "app/src/main/assets/brand"
NS = 'xmlns:android="http://schemas.android.com/apk/res/android"'
CARBON = "#111111"
HUESO = "#F1EDE6"

TOKEN = re.compile(r"[MLHVQCZ]|-?\d*\.?\d+(?:e-?\d+)?", re.I)


def read_svg(path: pathlib.Path):
    text = path.read_text()
    view = [float(v) for v in re.search(r'viewBox="([^"]+)"', text).group(1).split()]
    d = re.search(r'<path[^>]* d="([^"]+)"', text).group(1)
    return view, d


def subpaths(d: str):
    """Corta el `d` en subtrazados absolutos (cada uno arranca con M)."""
    return [p for p in re.findall(r"M[^M]*", d)]


def bbox(sub: str):
    """Caja por puntos de control: alcanza para decidir qué contorno pertenece a qué letra."""
    tokens = TOKEN.findall(sub)
    xs, ys = [], []
    x = y = 0.0
    i = 0
    cmd = None
    while i < len(tokens):
        t = tokens[i]
        if t.isalpha():
            cmd = t
            i += 1
            if cmd in "Zz":
                continue
        if cmd in "ML":
            x, y = float(tokens[i]), float(tokens[i + 1]); i += 2
        elif cmd == "H":
            x = float(tokens[i]); i += 1
        elif cmd == "V":
            y = float(tokens[i]); i += 1
        elif cmd == "Q":
            xs.append(float(tokens[i])); ys.append(float(tokens[i + 1]))
            x, y = float(tokens[i + 2]), float(tokens[i + 3]); i += 4
        elif cmd == "C":
            xs += [float(tokens[i]), float(tokens[i + 2])]
            ys += [float(tokens[i + 1]), float(tokens[i + 3])]
            x, y = float(tokens[i + 4]), float(tokens[i + 5]); i += 6
        else:
            raise ValueError(f"comando no soportado: {cmd}")
        xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def letters(d: str):
    """Agrupa contornos y contraformas por letra y las ordena de izquierda a derecha."""
    items = [(bbox(s), s) for s in subpaths(d)]
    items.sort(key=lambda it: (it[0][2] - it[0][0]) * (it[0][3] - it[0][1]), reverse=True)
    groups = []
    for box, sub in items:
        for g in groups:
            b = g["box"]
            if box[0] >= b[0] and box[2] <= b[2] and box[1] >= b[1] and box[3] <= b[3]:
                g["subs"].append(sub)
                break
        else:
            groups.append({"box": box, "subs": [sub]})
    groups.sort(key=lambda g: g["box"][0])
    return groups


def compact(d: str) -> str:
    """Recorta decimales: un vector de pantalla no necesita 10 dígitos."""
    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), d)


def vector(view, d, color, width_dp, height_dp, translate=None, scale=None):
    group_open = group_close = ""
    if translate or scale:
        attrs = ""
        if scale:
            attrs += f' android:scaleX="{scale}" android:scaleY="{scale}"'
        if translate:
            attrs += f' android:translateX="{translate[0]}" android:translateY="{translate[1]}"'
        group_open, group_close = f"    <group{attrs}>\n", "    </group>\n"
    return (
        f'<?xml version="1.0" encoding="utf-8"?>\n'
        f'<!-- Generado por scripts/brand/build_logo.py desde el Kit de marca v2. No editar a mano. -->\n'
        f'<vector {NS}\n'
        f'    android:width="{width_dp}dp"\n    android:height="{height_dp}dp"\n'
        f'    android:viewportWidth="{view[2]}"\n    android:viewportHeight="{view[3]}">\n'
        f'{group_open}'
        f'    <path android:fillColor="{color}" android:pathData="{compact(d)}" />\n'
        f'{group_close}'
        f'</vector>\n'
    )


def main(logo_dir: str) -> None:
    base = pathlib.Path(logo_dir)
    word_view, word_d = read_svg(base / "wordmark/galfredev_wordmark_hueso.svg")
    sym_view, sym_d = read_svg(base / "simbolo/galfredev_simbolo_hueso.svg")

    drawable = RES / "drawable"
    drawable.mkdir(parents=True, exist_ok=True)
    (drawable / "logo_wordmark.xml").write_text(
        vector(word_view, word_d, "@color/ink", 199, 40))
    (drawable / "logo_symbol.xml").write_text(
        vector(sym_view, sym_d, "@color/ink", 40, 55))

    # Ícono adaptativo: lienzo de 108 dp con zona segura de 66 dp. La g ocupa 54 dp de alto.
    target_h = 54.0
    scale = target_h / sym_view[3]
    tx = (108 - sym_view[2] * scale) / 2
    ty = (108 - target_h) / 2
    fg = (
        f'<?xml version="1.0" encoding="utf-8"?>\n'
        f'<!-- Generado por scripts/brand/build_logo.py. No editar a mano. -->\n'
        f'<vector {NS}\n    android:width="108dp"\n    android:height="108dp"\n'
        f'    android:viewportWidth="108"\n    android:viewportHeight="108">\n'
        f'    <group android:translateX="{tx:.3f}" android:translateY="{ty:.3f}"'
        f' android:scaleX="{scale:.5f}" android:scaleY="{scale:.5f}">\n'
        f'        <path android:fillColor="{HUESO}" android:pathData="{compact(sym_d)}" />\n'
        f'    </group>\n</vector>\n'
    )
    (drawable / "ic_launcher_foreground.xml").write_text(fg)
    (drawable / "ic_launcher_background.xml").write_text(
        f'<?xml version="1.0" encoding="utf-8"?>\n'
        f'<shape {NS} android:shape="rectangle">\n'
        f'    <solid android:color="{CARBON}" />\n</shape>\n')

    # Letras sueltas para el arranque.
    ASSETS.mkdir(parents=True, exist_ok=True)
    groups = letters(word_d)
    names = "galfredev"
    if len(groups) != len(names):
        raise SystemExit(f"esperaba {len(names)} letras y salieron {len(groups)}")
    lines = [f"viewbox\t{word_view[2]}\t{word_view[3]}"]
    for name, g in zip(names, groups):
        b = g["box"]
        lines.append(f"{name}\t{b[0]:.2f}\t{b[2]:.2f}\t{compact(''.join(g['subs']))}")
    (ASSETS / "wordmark.txt").write_text("\n".join(lines) + "\n")

    # Banner para Android TV: wordmark hueso sobre carbón, con resguardo amplio.
    with tempfile.TemporaryDirectory() as tmp:
        svg = pathlib.Path(tmp) / "banner.svg"
        wm_w = 200.0
        s = wm_w / word_view[2]
        h = word_view[3] * s
        svg.write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">'
            f'<rect width="320" height="180" fill="{CARBON}"/>'
            f'<path fill="{HUESO}" transform="translate({(320 - wm_w) / 2} {(180 - h) / 2}) scale({s})" d="{word_d}"/>'
            f'</svg>')
        out = RES / "drawable-xhdpi"
        out.mkdir(parents=True, exist_ok=True)
        subprocess.run(["rsvg-convert", "-w", "320", "-h", "180", "-o", str(out / "banner.png"), str(svg)], check=True)

    for g, name in zip(groups, names):
        print(name, [round(v) for v in g["box"]], len(g["subs"]), "contornos")


if __name__ == "__main__":
    main(sys.argv[1])
