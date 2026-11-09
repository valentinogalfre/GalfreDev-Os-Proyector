#!/usr/bin/env python3
"""Genera las fuentes de la app desde el Kit de marca v2.

Las variables pesan 1 MB entre las tres y hacen trabajar de más a un SoC flojo.
Acá se fijan los pesos que usa la marca (Archivo 800/700, Instrument Sans 400/500,
Geist Mono 400/500) y se recortan al latín que usamos.

Uso: python3 scripts/brand/build_fonts.py "<carpeta 03_Tipografia del kit>"
"""
import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = REPO / "app/src/main/res/font"

# Latín básico + Latín-1 + puntuación tipográfica + flechas y símbolos de interfaz.
UNICODES = (
    list(range(0x20, 0x7F)) + list(range(0xA0, 0x100))
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC,
       0x2190, 0x2191, 0x2192, 0x2193, 0x00D7, 0x2212]
)

JOBS = [
    ("Archivo-Variable.ttf", {"wght": 800, "wdth": 100}, "archivo_extrabold.ttf"),
    ("Archivo-Variable.ttf", {"wght": 700, "wdth": 100}, "archivo_bold.ttf"),
    ("InstrumentSans-Variable.ttf", {"wght": 400, "wdth": 100}, "instrument_sans.ttf"),
    ("InstrumentSans-Variable.ttf", {"wght": 500, "wdth": 100}, "instrument_sans_medium.ttf"),
    ("GeistMono-Variable.ttf", {"wght": 400}, "geist_mono.ttf"),
    ("GeistMono-Variable.ttf", {"wght": 500}, "geist_mono_medium.ttf"),
]


def main(src: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, axes, target in JOBS:
        font = instantiateVariableFont(TTFont(pathlib.Path(src) / name), axes, inplace=False)
        options = subset.Options()
        options.layout_features = ["kern", "liga", "tnum", "lnum", "ccmp", "locl", "mark", "mkmk"]
        options.hinting = False
        options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]  # conserva copyright y licencia OFL
        options.notdef_outline = True
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=UNICODES)
        subsetter.subset(font)
        path = OUT / target
        font.save(path)
        print(f"{target:32} {path.stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    main(sys.argv[1])
