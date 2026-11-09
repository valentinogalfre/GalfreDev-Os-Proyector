#!/usr/bin/env python3
"""Cuenta los píxeles de cinta en una captura. Imprime el número.

La prueba de humo lo usa para comprobar dos reglas de la marca sin mirar las capturas a mano: la
cinta marca el foco en las pantallas navegables, y nunca tapa una imagen o un video.

Decodifica el PNG a mano para no depender de nada en el CI. Sirve para lo que sale de
`adb exec-out screencap -p`: 8 bits por canal, RGB o RGBA y sin entrelazado.

Uso: python3 scripts/count_cinta.py captura.png
"""
import struct
import sys
import zlib

CINTA = (0xE4, 0xA3, 0x2B)
TOLERANCE = 3


def paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    return b if pb <= pc else c


def rows(path):
    data = open(path, "rb").read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"{path} no es un PNG")
    pos, idat, width, height, channels = 8, bytearray(), 0, 0, 0
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos:pos + 4])
        kind = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            width, height, depth, color, _, _, interlace = struct.unpack(">IIBBBBB", body)
            if depth != 8 or color not in (2, 6) or interlace:
                raise SystemExit(f"{path}: formato no soportado")
            channels = 3 if color == 2 else 4
        elif kind == b"IDAT":
            idat += body
        pos += 12 + length
    raw = zlib.decompress(bytes(idat))
    stride = width * channels
    previous = bytearray(stride)
    for y in range(height):
        start = y * (stride + 1)
        kind = raw[start]
        line = bytearray(raw[start + 1:start + 1 + stride])
        if kind == 1:
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 255
        elif kind == 2:
            for i in range(stride):
                line[i] = (line[i] + previous[i]) & 255
        elif kind == 3:
            for i in range(stride):
                left = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + (left + previous[i]) // 2) & 255
        elif kind == 4:
            for i in range(stride):
                left = line[i - channels] if i >= channels else 0
                corner = previous[i - channels] if i >= channels else 0
                line[i] = (line[i] + paeth(left, previous[i], corner)) & 255
        yield line, channels
        previous = line


def count(path):
    total = 0
    for line, channels in rows(path):
        for i in range(0, len(line), channels):
            if (abs(line[i] - CINTA[0]) <= TOLERANCE and abs(line[i + 1] - CINTA[1]) <= TOLERANCE
                    and abs(line[i + 2] - CINTA[2]) <= TOLERANCE):
                total += 1
    return total


if __name__ == "__main__":
    print(count(sys.argv[1]))
