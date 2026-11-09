package ar.vale.projectorlauncher

import android.content.pm.PackageManager
import ar.vale.projectorlauncher.store.Downloader
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

@Suppress("DEPRECATION")
class SignatureFlagsTest {

    @Test
    fun `contrato - en Android 9 se pide la constante vieja o el APK parece mal firmado`() {
        val flags = Downloader.signatureFlags(28)
        assertTrue(flags and PackageManager.GET_SIGNATURES != 0)
        assertTrue(flags and PackageManager.GET_SIGNING_CERTIFICATES != 0)
    }

    @Test
    fun `contrato - antes de Android 9 solo existe la constante vieja`() {
        assertEquals(PackageManager.GET_SIGNATURES, Downloader.signatureFlags(26))
    }

    @Test
    fun `contrato - despues de Android 9 alcanza con la constante nueva`() {
        assertEquals(PackageManager.GET_SIGNING_CERTIFICATES, Downloader.signatureFlags(29))
    }
}
