#!/usr/bin/env python3
"""Genera los íconos de la app con las reglas del manual de marca.

Manual, sección 05: lineales, trazo de 1,7 sobre grilla de 24, puntas redondeadas, sin relleno.
Los primeros son los del kit (src/piezas/_m.j2) copiados tal cual; el resto son los que
necesita un sistema operativo y el kit no trae, dibujados con la misma regla.

Uso: python3 scripts/brand/build_icons.py
"""
import pathlib

REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = REPO / "app/src/main/res/drawable"
NS = 'xmlns:android="http://schemas.android.com/apk/res/android"'


def circle(cx, cy, r):
    return f"M{cx - r} {cy}a{r} {r} 0 1 0 {2 * r} 0a{r} {r} 0 1 0 {-2 * r} 0z"


def rect(x, y, w, h, rx=0):
    if rx == 0:
        return f"M{x} {y}h{w}v{h}h{-w}z"
    return (f"M{x + rx} {y}h{w - 2 * rx}a{rx} {rx} 0 0 1 {rx} {rx}v{h - 2 * rx}"
            f"a{rx} {rx} 0 0 1 {-rx} {rx}h{-(w - 2 * rx)}a{rx} {rx} 0 0 1 {-rx} {-rx}"
            f"v{-(h - 2 * rx)}a{rx} {rx} 0 0 1 {rx} {-rx}z")


ICONS = {
    # --- Del kit ---
    "ic_arrow": ["M3 12h17M14 6l6 6-6 6"],
    "ic_apps": [rect(3, 3, 7.5, 7.5, 1.6), rect(13.5, 3, 7.5, 7.5, 1.6),
                rect(3, 13.5, 7.5, 7.5, 1.6), rect(13.5, 13.5, 7.5, 7.5, 1.6)],
    "ic_chat": ["M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h-.5A1 1 0 0 1 4 15z"],
    "ic_ai": [circle(5, 6, 2.5), circle(19, 6, 2.5), circle(12, 18, 2.5),
              "M7.5 6h9M6.3 8.2l4.4 7.6M17.7 8.2l-4.4 7.6"],
    "ic_shield": ["M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z", "M8.5 12l2.5 2.5 4.5-5"],
    "ic_check": ["M5 12.5l4.5 4.5L19 7.5"],
    "ic_time": [circle(12, 12, 9), "M12 7v5l3 2"],
    "ic_globe": [circle(12, 12, 9), "M3 12h18M12 3c2.6 2.6 3.6 5.6 3.6 9s-1 6.4-3.6 9c-2.6-2.6-3.6-5.6-3.6-9s1-6.4 3.6-9z"],
    "ic_link": ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
    "ic_file": ["M6 2.5h8l4 4v15H6z", "M14 2.5v4h4M9 12h6M9 16h6"],
    # --- Propios del sistema, misma regla ---
    "ic_wifi": ["M2.5 9.2a14 14 0 0 1 19 0M6 13a9 9 0 0 1 12 0M9.4 16.6a4 4 0 0 1 5.2 0M12 20h.01"],
    "ic_bluetooth": ["M7 7l10 10-5 4.5V2.5L17 7 7 17"],
    "ic_display": [rect(3, 4.5, 18, 12, 2), "M9 20.5h6M12 16.5v4"],
    "ic_sound": ["M4 9.5v5h3.5l4.5 4v-13l-4.5 4z", "M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"],
    "ic_storage": [rect(3, 5, 18, 6, 1.6), rect(3, 13, 18, 6, 1.6), "M7 8h.01M7 16h.01"],
    "ic_home": ["M3.5 11L12 3.5l8.5 7.5", "M5.5 9.5v11h13v-11"],
    "ic_info": [circle(12, 12, 9), "M12 11v5.5M12 7.5h.01"],
    "ic_system": ["M4 7h9M17 7h3M4 17h3M11 17h9", circle(15, 7, 2), circle(9, 17, 2)],
    "ic_folder": ["M3 7a2 2 0 0 1 2-2h4.5l2 2.5H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
    "ic_video": [rect(3, 5, 18, 14, 2.5), "M10 9l5 3-5 3z"],
    "ic_audio": ["M9 18V6l10-2v12", circle(6.5, 18, 2.5), circle(16.5, 16, 2.5)],
    "ic_image": [rect(3, 4.5, 18, 15, 2.5), "M3.5 16l5-5 4 4 3-3 5 5", circle(15.5, 9, 1.5)],
    "ic_install": ["M12 3v12M7 10.5l5 5 5-5M4 20.5h16"],
    "ic_usb": [rect(7, 9, 10, 12, 2), "M9 9V3.5h6V9", "M10.5 6.2h.01M13.5 6.2h.01"],
    "ic_phone": [rect(6.5, 2.5, 11, 19, 2.5), "M11 18.5h2"],
    "ic_wall": [rect(3, 4, 18, 16, 1.6), "M7 15.5h10M7 11.5h6M7 8h3"],
    "ic_target": [circle(12, 12, 8), "M12 2v4M12 18v4M2 12h4M18 12h4M12 12h.01"],
    "ic_projector": [rect(2.5, 8, 19, 9, 2), circle(16, 12.5, 2.5), "M6 12.5h4M6 17v2M18 17v2"],
    "ic_power": ["M12 3v9", "M6.5 6.5a8 8 0 1 0 11 0"],
    "ic_star": ["M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8z"],
    "ic_search": [circle(10.5, 10.5, 6.5), "M15.5 15.5l5 5"],
    "ic_keyboard": [rect(2.5, 6, 19, 12, 2), "M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"],
    "ic_store": ["M5 8h14l-1 12.5H6z", "M9 8V6.5a3 3 0 0 1 6 0V8"],
    "ic_backspace": ["M8.5 5.5H20a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8.5L3 12z", "M12 9.5l5 5M17 9.5l-5 5"],
    "ic_space": ["M4 10v4h16v-4"],
    "ic_play": ["M7 4.5l13 7.5-13 7.5z"],
    "ic_pause": ["M8 5v14M16 5v14"],
    "ic_prev": ["M6 5v14M19 5L9 12l10 7z"],
    "ic_next": ["M18 5v14M5 5l10 7-10 7z"],
    "ic_back": ["M21 12H4M10 6l-6 6 6 6"],
    "ic_send": ["M4 12l16-8-6 16-3-7z"],
    "ic_refresh": ["M20 11a8 8 0 1 0-2.3 6.3", "M20 5v6h-6"],
    "ic_trash": ["M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13.5h9l1-13.5", "M10 11v5.5M14 11v5.5"],
    "ic_presentation": [rect(3, 4, 18, 12, 1.6), "M12 16v4.5M8 20.5h8M8 8.5h8M8 12h5"],
    "ic_moon": ["M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"],
    "ic_key": [circle(8, 15.5, 4.5), "M11.2 12.3L20 3.5M16 7.5l3 3M13 10.5l2 2"],
}


def vector(paths):
    body = "".join(
        f'    <path\n'
        f'        android:pathData="{d}"\n'
        f'        android:strokeColor="@color/ink"\n'
        f'        android:strokeWidth="1.7"\n'
        f'        android:strokeLineCap="round"\n'
        f'        android:strokeLineJoin="round" />\n'
        for d in paths
    )
    return (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<!-- Generado por scripts/brand/build_icons.py. No editar a mano. -->\n'
        f'<vector {NS}\n    android:width="24dp"\n    android:height="24dp"\n'
        '    android:viewportWidth="24"\n    android:viewportHeight="24">\n'
        f'{body}</vector>\n'
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, paths in ICONS.items():
        (OUT / f"{name}.xml").write_text(vector(paths))
    print(f"{len(ICONS)} íconos")


if __name__ == "__main__":
    main()
