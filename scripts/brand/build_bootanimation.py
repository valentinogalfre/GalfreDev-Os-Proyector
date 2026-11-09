#!/usr/bin/env python3
"""Genera bootanimation.zip con la marca, para equipos con root.

Una app común no puede cambiar la animación de arranque del sistema: instalarla exige escribir
en /oem/media o /system/media. Ver docs/proyectores.md antes de intentarlo. El arranque que se
ve siempre, sin root, es el de la app (ui/BootView.kt).

La cinta entra por la izquierda y va descubriendo el wordmark. Lo que queda debajo se dibuja en
carbón, igual que en el sistema. Después va y viene mientras el equipo termina de arrancar: es
movimiento, no progreso, porque la cinta nunca indica un estado.

Usa assets/brand/wordmark.txt: el logo sale del archivo del kit, no se redibuja.

Uso: python3 scripts/brand/build_bootanimation.py [--size 1280x720] [--out archivo.zip]
Hace falta rsvg-convert y Pillow.
"""
import argparse
import io
import math
import pathlib
import subprocess
import zipfile

from PIL import Image

REPO = pathlib.Path(__file__).resolve().parents[2]
WORDMARK = REPO / "app/src/main/assets/brand/wordmark.txt"
CARBON = "#111111"
HUESO = "#F1EDE6"
CINTA = "#E4A32B"
FPS = 30
ENTRY_FRAMES = 48
LOOP_FRAMES = 96
MARGIN = 1 / 16
MARK_WIDTH = 0.42
BLOCK_WIDTH = 0.14
BLOCK_HEIGHT = 1.5


def read_wordmark():
    lines = WORDMARK.read_text().strip().split("\n")
    _, width, height = lines[0].split("\t")
    paths = [line.split("\t")[3] for line in lines[1:]]
    return float(width), float(height), " ".join(paths)


def frame_svg(size, mark, left, reveal):
    """Una imagen: el wordmark hasta `reveal`, y la cinta con su tramo en carbón."""
    width, height = size
    mark_w, mark_h, d = mark
    scale = width * MARK_WIDTH / mark_w
    x = width * MARGIN
    y = (height - mark_h * scale) / 2
    block_w = width * MARK_WIDTH * BLOCK_WIDTH
    block_h = mark_h * scale * BLOCK_HEIGHT
    block_y = (height - block_h) / 2
    letters = f'<path transform="translate({x:.2f} {y:.2f}) scale({scale:.5f})" d="{d}"'
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">
<defs>
<clipPath id="shown"><rect x="0" y="0" width="{reveal:.2f}" height="{height}"/></clipPath>
<clipPath id="under"><rect x="{left:.2f}" y="{block_y:.2f}" width="{block_w:.2f}" height="{block_h:.2f}"/></clipPath>
</defs>
<rect width="{width}" height="{height}" fill="{CARBON}"/>
<g clip-path="url(#shown)">{letters} fill="{HUESO}"/></g>
<rect x="{left:.2f}" y="{block_y:.2f}" width="{block_w:.2f}" height="{block_h:.2f}" fill="{CINTA}"/>
<g clip-path="url(#under)">{letters} fill="{CARBON}"/></g>
</svg>"""


def render(svg: str) -> bytes:
    png = subprocess.run(["rsvg-convert", "-f", "png"], input=svg.encode(), capture_output=True, check=True).stdout
    # Con pocos colores cada cuadro pesa poco: el zip va sin comprimir, lo exige el sistema.
    image = Image.open(io.BytesIO(png)).convert("RGB").quantize(colors=32)
    out = io.BytesIO()
    image.save(out, "PNG", optimize=True)
    return out.getvalue()


def track(size):
    """Dónde arranca y dónde descansa la cinta."""
    width = size[0]
    block = width * MARK_WIDTH * BLOCK_WIDTH
    start = -block
    rest = width * MARGIN + width * MARK_WIDTH + width * 0.02
    return start, rest


def entry_frames(size, mark):
    start, rest = track(size)
    for i in range(ENTRY_FRAMES):
        t = i / (ENTRY_FRAMES - 1)
        left = start + (rest - start) * (1 - (1 - t) ** 3)
        yield frame_svg(size, mark, left, left)


def loop_frames(size, mark):
    _, rest = track(size)
    far = size[0] * MARGIN
    for i in range(LOOP_FRAMES):
        # Va y vuelve al mismo lugar: el último cuadro empalma con el primero.
        t = (1 - math.cos(2 * math.pi * i / LOOP_FRAMES)) / 2
        yield frame_svg(size, mark, rest + (far - rest) * t, size[0])


def build(size, out: pathlib.Path):
    mark = read_wordmark()
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_STORED) as archive:
        archive.writestr("desc.txt", f"{size[0]} {size[1]} {FPS}\nc 1 0 part0\np 0 0 part1\n")
        for part, frames in (("part0", entry_frames(size, mark)), ("part1", loop_frames(size, mark))):
            for index, svg in enumerate(frames):
                archive.writestr(f"{part}/{index:05d}.png", render(svg))


def check(size, out: pathlib.Path):
    """Lo que el sistema exige de este zip. Si algo no cumple, el equipo arranca sin animación."""
    with zipfile.ZipFile(out) as archive:
        entries = archive.infolist()
        assert all(entry.compress_type == zipfile.ZIP_STORED for entry in entries), "tiene que ir sin comprimir"
        desc = archive.read("desc.txt").decode().split("\n")
        assert desc[0] == f"{size[0]} {size[1]} {FPS}", desc[0]
        for part, count in (("part0", ENTRY_FRAMES), ("part1", LOOP_FRAMES)):
            names = sorted(e.filename for e in entries if e.filename.startswith(part + "/"))
            assert len(names) == count, (part, len(names))
            first = Image.open(io.BytesIO(archive.read(names[0])))
            assert first.size == size, first.size


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--size", default="1280x720")
    parser.add_argument("--out", default=str(REPO / "build/brand/bootanimation.zip"))
    args = parser.parse_args()
    size = tuple(int(v) for v in args.size.split("x"))
    out = pathlib.Path(args.out)
    build(size, out)
    check(size, out)
    print(f"{out} · {out.stat().st_size // 1024} KB · {ENTRY_FRAMES + LOOP_FRAMES} cuadros")


if __name__ == "__main__":
    main()
