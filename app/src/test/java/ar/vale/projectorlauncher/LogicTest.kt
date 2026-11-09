package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.claude.AppMatch
import ar.vale.projectorlauncher.claude.KeyVault
import ar.vale.projectorlauncher.media.ResumePolicy
import ar.vale.projectorlauncher.media.Srt
import ar.vale.projectorlauncher.ui.SvgPath
import ar.vale.projectorlauncher.wall.WordClock
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class LogicTest {

    @Test
    fun `contrato - la hora se redondea a cinco minutos y dice lo que un porteño diria`() {
        assertEquals("Son las tres y cuarto de la tarde.", WordClock.phrase(15, 14).text)
        assertEquals("Son las tres y media de la tarde.", WordClock.phrase(15, 31).text)
        assertEquals("Son las cuatro menos cuarto de la tarde.", WordClock.phrase(15, 44).text)
        assertEquals("Son las nueve de la mañana.", WordClock.phrase(9, 2).text)
    }

    @Test
    fun `contrato - la una va en singular`() {
        assertEquals("Es la una de la tarde.", WordClock.phrase(13, 0).text)
        assertEquals("Es la una menos diez de la tarde.", WordClock.phrase(12, 50).text.replace("del mediodía", "de la tarde"))
    }

    @Test
    fun `contrato - medianoche y mediodia tienen nombre propio`() {
        assertEquals("Es medianoche.", WordClock.phrase(0, 1).text)
        assertEquals("Es medianoche.", WordClock.phrase(23, 58).text)
        assertEquals("Son las doce del mediodía.", WordClock.phrase(12, 0).text)
    }

    @Test
    fun `contrato - toda hora del dia tiene frase y la palabra marcada esta adentro`() {
        for (h in 0..23) for (m in 0..59) {
            val p = WordClock.phrase(h, m)
            assertTrue("$h:$m", p.text.contains(p.mark))
            assertTrue("$h:$m", p.text.endsWith("."))
        }
    }

    @Test
    fun `contrato - el lector de trazados entiende los comandos del logo`() {
        val c = SvgPath.parse("M1 2L3-4H5V6Q1 2 3 4C1 2 3 4 5 6Z")
        assertEquals("MLHVQCZ", c.map { it.op }.joinToString(""))
        assertEquals(listOf(3f, -4f), c[1].args)
    }

    @Test
    fun `contrato - un comando repetido sin letra cuenta como otro`() {
        assertEquals(2, SvgPath.parse("L1 2 3 4").size)
    }

    @Test
    fun `contrato - un comando que el logo no usa se rechaza`() {
        assertThrows(IllegalArgumentException::class.java) { SvgPath.parse("A1 2 3 4 5 6 7") }
    }

    @Test
    fun `contrato - el wordmark real del kit se puede leer entero`() {
        val lines = File("src/main/assets/brand/wordmark.txt").readLines().drop(1).filter { it.isNotBlank() }
        assertEquals("galfredev".length, lines.size)
        lines.forEach { assertTrue(SvgPath.parse(it.split('\t')[3]).isNotEmpty()) }
    }

    @Test
    fun `contrato - abrir una app elige lo mas parecido y no inventa`() {
        val apps = listOf("Netflix", "Just Player", "YouTube", "Files", "VLC")
        assertEquals(4, AppMatch.best("vlc", apps))
        assertEquals(1, AppMatch.best("player", apps))
        assertEquals(2, AppMatch.best("you", apps))
        assertEquals(0, AppMatch.best("NETFLIX", apps))
        assertNull(AppMatch.best("spotify", apps))
        assertNull(AppMatch.best("", apps))
    }

    @Test
    fun `contrato - abrir una app ignora acentos`() {
        assertEquals(0, AppMatch.best("musica", listOf("Música")))
    }

    @Test
    fun `contrato - una busqueda de dos letras no coincide por casualidad en medio de un nombre`() {
        assertNull(AppMatch.best("et", listOf("Netflix")))
    }

    @Test
    fun `contrato - la clave se limpia y solo pasa si tiene forma de clave`() {
        assertEquals("sk-ant-api03-abcdefghijklmnop", KeyVault.clean("  sk-ant-api03-abcdefghijklmnop\n"))
        assertNull(KeyVault.clean("hola"))
        assertNull(KeyVault.clean("sk-ant-corta"))
        assertNull(KeyVault.clean("sk-ant-api03 con espacios adentro"))
    }

    @Test
    fun `contrato - la reanudacion ignora el principio y el final`() {
        assertNull(ResumePolicy.positionToKeep(5_000, 3_600_000))
        assertNull(ResumePolicy.positionToKeep(3_590_000, 3_600_000))
        assertNotNull(ResumePolicy.positionToKeep(1_800_000, 3_600_000))
    }

    @Test
    fun `contrato - los subtitulos aparecen solo en su momento`() {
        val cues = Srt.parse("1\n00:00:01,000 --> 00:00:02,500\nHola\ncon dos líneas\n\n2\n00:00:03,000 --> 00:00:04,000\nChau\n")
        assertEquals(2, cues.size)
        assertEquals("Hola\ncon dos líneas", Srt.at(cues, 1500)?.text)
        assertNull(Srt.at(cues, 2700))
        assertEquals("Chau", Srt.at(cues, 3000)?.text)
    }

    @Test
    fun `contrato - un subtitulo roto no rompe la pelicula`() {
        assertTrue(Srt.parse("esto no es un srt").isEmpty())
    }

    @Test
    fun `contrato - cada archivo abre con lo que corresponde`() {
        assertEquals(FileKind.VIDEO, MediaTypes.kindOf(File("a.MKV")))
        assertEquals(FileKind.AUDIO, MediaTypes.kindOf(File("a.flac")))
        assertEquals(FileKind.IMAGE, MediaTypes.kindOf(File("a.heic")))
        assertEquals(FileKind.PDF, MediaTypes.kindOf(File("a.pdf")))
        assertEquals(FileKind.APK, MediaTypes.kindOf(File("a.apk")))
        assertEquals(FileKind.OTHER, MediaTypes.kindOf(File("a.exe")))
    }
}
