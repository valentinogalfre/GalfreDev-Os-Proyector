package ar.vale.projectorlauncher

import ar.vale.projectorlauncher.remote.DeviceName
import org.junit.Assert.assertEquals
import org.junit.Test

/** El encabezado de la web del control muestra el nombre que el usuario le puso al equipo, no el código del modelo. */
class DeviceNameTest {

    @Test fun `el nombre del sistema gana sobre el modelo`() {
        assertEquals("Proyector del living", DeviceName.pick("Proyector del living", "HY300"))
    }

    @Test fun `sin nombre del sistema cae al modelo`() {
        assertEquals("HY300", DeviceName.pick(null, "HY300"))
    }

    @Test fun `un nombre vacio o de solo espacios cae al modelo`() {
        assertEquals("HY300", DeviceName.pick("", "HY300"))
        assertEquals("HY300", DeviceName.pick("   \t ", "HY300"))
    }

    @Test fun `se recortan los espacios de los bordes`() {
        assertEquals("Proyector del living", DeviceName.pick("  Proyector del living ", "HY300"))
        assertEquals("HY300", DeviceName.pick(null, " HY300 "))
    }
}
