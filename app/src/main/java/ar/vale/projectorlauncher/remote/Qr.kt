package ar.vale.projectorlauncher.remote

/**
 * Generador de códigos QR para la dirección de emparejamiento. Es propio porque ZXing sumaría
 * medio megabyte por un solo código: modo byte, corrección M, versiones 1 a 10.
 * El contrato lo protege una prueba que lee el resultado con ZXing.
 */
object Qr {

    class Matrix(val size: Int, private val modules: BooleanArray) {
        operator fun get(x: Int, y: Int): Boolean = modules[y * size + x]
    }

    private const val MAX_VERSION = 10
    private val ECC_PER_BLOCK = intArrayOf(-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26)
    private val BLOCKS = intArrayOf(-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5)
    private const val FORMAT_ECC_M = 0

    fun encode(text: String): Matrix {
        val data = text.toByteArray(Charsets.UTF_8)
        val version = (1..MAX_VERSION).firstOrNull { fits(it, data.size) }
            ?: throw IllegalArgumentException("texto demasiado largo para el QR")
        val codewords = interleave(version, pad(version, data))
        return Builder(version).build(codewords)
    }

    private fun rawModules(version: Int): Int {
        var bits = (16 * version + 128) * version + 64
        if (version >= 2) {
            val align = version / 7 + 2
            bits -= (25 * align - 10) * align - 55
            if (version >= 7) bits -= 36
        }
        return bits
    }

    private fun dataCodewords(version: Int) = rawModules(version) / 8 - ECC_PER_BLOCK[version] * BLOCKS[version]

    private fun countBits(version: Int) = if (version <= 9) 8 else 16

    private fun fits(version: Int, bytes: Int) = 4 + countBits(version) + bytes * 8 <= dataCodewords(version) * 8

    private fun pad(version: Int, data: ByteArray): ByteArray {
        val capacity = dataCodewords(version)
        val bits = ArrayList<Boolean>(capacity * 8)
        fun put(value: Int, length: Int) {
            for (i in length - 1 downTo 0) bits.add(value ushr i and 1 != 0)
        }
        put(0b0100, 4)
        put(data.size, countBits(version))
        data.forEach { put(it.toInt() and 0xFF, 8) }
        put(0, minOf(4, capacity * 8 - bits.size))
        put(0, (8 - bits.size % 8) % 8)
        val out = ByteArray(capacity)
        for (i in 0 until bits.size / 8) {
            var value = 0
            for (j in 0 until 8) value = value shl 1 or (if (bits[i * 8 + j]) 1 else 0)
            out[i] = value.toByte()
        }
        var filler = 0xEC
        for (i in bits.size / 8 until capacity) {
            out[i] = filler.toByte()
            filler = filler xor 0xEC xor 0x11
        }
        return out
    }

    private fun interleave(version: Int, data: ByteArray): ByteArray {
        val blocks = BLOCKS[version]
        val eccLength = ECC_PER_BLOCK[version]
        val raw = rawModules(version) / 8
        val shortBlocks = blocks - raw % blocks
        val shortLength = raw / blocks
        val generator = generator(eccLength)
        val all = ArrayList<ByteArray>(blocks)
        var offset = 0
        for (i in 0 until blocks) {
            val size = shortLength - eccLength + if (i < shortBlocks) 0 else 1
            val part = data.copyOfRange(offset, offset + size)
            offset += size
            val ecc = remainder(part, generator)
            val block = ByteArray(shortLength + 1)
            part.copyInto(block)
            ecc.copyInto(block, block.size - eccLength)
            all.add(block)
        }
        val out = ByteArray(raw)
        var k = 0
        for (i in 0..shortLength) {
            for (j in 0 until blocks) {
                // Los bloques cortos no tienen dato en la columna del byte extra.
                if (i != shortLength - eccLength || j >= shortBlocks) out[k++] = all[j][i]
            }
        }
        return out
    }

    private fun multiply(x: Int, y: Int): Int {
        var z = 0
        for (i in 7 downTo 0) {
            z = z shl 1 xor (z ushr 7) * 0x11D
            z = z xor (y ushr i and 1) * x
        }
        return z
    }

    private fun generator(degree: Int): ByteArray {
        val result = ByteArray(degree)
        result[degree - 1] = 1
        var root = 1
        for (i in 0 until degree) {
            for (j in 0 until degree) {
                result[j] = multiply(result[j].toInt() and 0xFF, root).toByte()
                if (j + 1 < degree) result[j] = (result[j].toInt() xor result[j + 1].toInt()).toByte()
            }
            root = multiply(root, 2)
        }
        return result
    }

    private fun remainder(data: ByteArray, divisor: ByteArray): ByteArray {
        val result = ByteArray(divisor.size)
        for (b in data) {
            val factor = (b.toInt() xor result[0].toInt()) and 0xFF
            System.arraycopy(result, 1, result, 0, result.size - 1)
            result[result.size - 1] = 0
            for (i in result.indices) {
                result[i] = (result[i].toInt() xor multiply(divisor[i].toInt() and 0xFF, factor)).toByte()
            }
        }
        return result
    }

    private class Builder(private val version: Int) {
        private val size = version * 4 + 17
        private val modules = BooleanArray(size * size)
        private val reserved = BooleanArray(size * size)

        fun build(codewords: ByteArray): Matrix {
            drawPatterns()
            drawCodewords(codewords)
            var best = 0
            var bestPenalty = Int.MAX_VALUE
            for (mask in 0 until 8) {
                applyMask(mask)
                drawFormat(mask)
                val penalty = penalty()
                if (penalty < bestPenalty) {
                    best = mask
                    bestPenalty = penalty
                }
                applyMask(mask)
            }
            applyMask(best)
            drawFormat(best)
            return Matrix(size, modules)
        }

        private fun set(x: Int, y: Int, dark: Boolean) {
            modules[y * size + x] = dark
            reserved[y * size + x] = true
        }

        private fun drawPatterns() {
            for (i in 0 until size) {
                set(6, i, i % 2 == 0)
                set(i, 6, i % 2 == 0)
            }
            finder(3, 3)
            finder(size - 4, 3)
            finder(3, size - 4)
            val positions = alignment()
            for (i in positions.indices) {
                for (j in positions.indices) {
                    val corner = i == 0 && j == 0 || i == 0 && j == positions.size - 1 || i == positions.size - 1 && j == 0
                    if (!corner) align(positions[i], positions[j])
                }
            }
            drawFormat(0)
            if (version >= 7) drawVersion()
        }

        private fun finder(cx: Int, cy: Int) {
            for (dy in -4..4) {
                for (dx in -4..4) {
                    val x = cx + dx
                    val y = cy + dy
                    if (x !in 0 until size || y !in 0 until size) continue
                    val distance = maxOf(kotlin.math.abs(dx), kotlin.math.abs(dy))
                    set(x, y, distance != 2 && distance != 4)
                }
            }
        }

        private fun align(cx: Int, cy: Int) {
            for (dy in -2..2) {
                for (dx in -2..2) {
                    set(cx + dx, cy + dy, maxOf(kotlin.math.abs(dx), kotlin.math.abs(dy)) != 1)
                }
            }
        }

        private fun alignment(): IntArray {
            if (version == 1) return IntArray(0)
            val count = version / 7 + 2
            val step = (version * 4 + count * 2 + 1) / (count * 2 - 2) * 2
            val out = IntArray(count)
            out[0] = 6
            var position = size - 7
            for (i in count - 1 downTo 1) {
                out[i] = position
                position -= step
            }
            return out
        }

        private fun drawFormat(mask: Int) {
            val data = FORMAT_ECC_M shl 3 or mask
            var rem = data
            repeat(10) { rem = rem shl 1 xor (rem ushr 9) * 0x537 }
            val bits = (data shl 10 or rem) xor 0x5412
            fun bit(i: Int) = bits ushr i and 1 != 0
            for (i in 0..5) set(8, i, bit(i))
            set(8, 7, bit(6))
            set(8, 8, bit(7))
            set(7, 8, bit(8))
            for (i in 9 until 15) set(14 - i, 8, bit(i))
            for (i in 0 until 8) set(size - 1 - i, 8, bit(i))
            for (i in 8 until 15) set(8, size - 15 + i, bit(i))
            set(8, size - 8, true)
        }

        private fun drawVersion() {
            var rem = version
            repeat(12) { rem = rem shl 1 xor (rem ushr 11) * 0x1F25 }
            val bits = version shl 12 or rem
            for (i in 0 until 18) {
                val dark = bits ushr i and 1 != 0
                val a = size - 11 + i % 3
                val b = i / 3
                set(a, b, dark)
                set(b, a, dark)
            }
        }

        private fun drawCodewords(data: ByteArray) {
            var i = 0
            var right = size - 1
            while (right >= 1) {
                if (right == 6) right = 5
                for (vertical in 0 until size) {
                    for (j in 0..1) {
                        val x = right - j
                        val upward = right + 1 and 2 == 0
                        val y = if (upward) size - 1 - vertical else vertical
                        if (!reserved[y * size + x] && i < data.size * 8) {
                            modules[y * size + x] = data[i ushr 3].toInt() ushr 7 - (i and 7) and 1 != 0
                            i++
                        }
                    }
                }
                right -= 2
            }
        }

        private fun applyMask(mask: Int) {
            for (y in 0 until size) {
                for (x in 0 until size) {
                    val flip = when (mask) {
                        0 -> (x + y) % 2 == 0
                        1 -> y % 2 == 0
                        2 -> x % 3 == 0
                        3 -> (x + y) % 3 == 0
                        4 -> (x / 3 + y / 2) % 2 == 0
                        5 -> x * y % 2 + x * y % 3 == 0
                        6 -> (x * y % 2 + x * y % 3) % 2 == 0
                        else -> ((x + y) % 2 + x * y % 3) % 2 == 0
                    }
                    if (flip && !reserved[y * size + x]) modules[y * size + x] = !modules[y * size + x]
                }
            }
        }

        /** Las reglas de penalización del estándar: tiras largas, bloques y desbalance de oscuros. */
        private fun penalty(): Int {
            var total = 0
            for (line in 0 until size) {
                total += run { i -> modules[line * size + i] }
                total += run { i -> modules[i * size + line] }
            }
            var dark = 0
            for (y in 0 until size) {
                for (x in 0 until size) {
                    val c = modules[y * size + x]
                    if (c) dark++
                    if (x + 1 < size && y + 1 < size && c == modules[y * size + x + 1] &&
                        c == modules[(y + 1) * size + x] && c == modules[(y + 1) * size + x + 1]
                    ) total += 3
                }
            }
            val percent = dark * 100 / (size * size)
            return total + kotlin.math.abs(percent - 50) / 5 * 10
        }

        private fun run(at: (Int) -> Boolean): Int {
            var total = 0
            var length = 1
            for (i in 1 until size) {
                if (at(i) == at(i - 1)) {
                    length++
                    if (length == 5) total += 3 else if (length > 5) total++
                } else {
                    length = 1
                }
            }
            return total
        }
    }
}
