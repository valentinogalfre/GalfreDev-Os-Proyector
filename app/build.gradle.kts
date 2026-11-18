import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "ar.vale.projectorlauncher"
    compileSdk = 35

    defaultConfig {
        applicationId = "ar.vale.projectorlauncher"
        // Android 8.0+ (API 26): piso cómodo para estas pantallas y nos permite
        // un ícono adaptativo 100% vectorial (sin PNGs por densidad).
        minSdk = 26
        targetSdk = 35
        versionName = "1.4.0"
        // Sale de la versión: 1.4.0 es 10400. Nunca baja, así Android acepta cada actualización.
        versionCode = versionName!!.split(".").map(String::toInt).let { (a, b, c) ->
            require(b < 100 && c < 100) { "versionName $versionName: menor y parche tienen que ser menores que 100" }
            a * 10_000 + b * 100 + c
        }
    }

    signingConfigs {
        // Con minSdk 26 AGP firma solo con v2, y hay firmwares de proyector que rechazan esos APK.
        getByName("debug") {
            enableV1Signing = true
            enableV2Signing = true
        }
        // La clave de las versiones oficiales vive solo en los secretos del repo. Un proyector acepta
        // una actualización únicamente si viene firmada con la misma clave que la versión instalada.
        val keystore = System.getenv("GDOS_KEYSTORE")
        if (keystore != null) {
            create("release") {
                storeFile = file(keystore)
                storePassword = System.getenv("GDOS_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("GDOS_KEY_ALIAS")
                keyPassword = System.getenv("GDOS_KEYSTORE_PASSWORD")
                enableV1Signing = true
                enableV2Signing = true
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Sin la clave (un fork, una compu cualquiera) se firma con la de debug: compila igual,
            // pero esa copia no se puede actualizar desde las versiones oficiales.
            signingConfig = signingConfigs.findByName("release") ?: signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    testOptions {
        unitTests.isReturnDefaultValues = true
        // Algunos contratos leen estos archivos: si cambian, los tests tienen que volver a correr.
        unitTests.all {
            it.inputs.files("../docs/instalar.md", "../README.md", "src/main/res/values/strings.xml", "src/main/res/layout/activity_player.xml")
            // ReadmeTest cuenta los @Test de los propios tests: si se agrega o se saca uno, tiene que correr de nuevo.
            it.inputs.dir("src/test/java")
        }
    }

    lint {
        abortOnError = true
        // Se instala a mano (ADB / USB), no se publica en Play Store:
        // los avisos de "targetSdk exigido por Play" no aplican.
        disable += setOf("ExpiredTargetSdkVersion", "ExpiringTargetSdkVersion", "OldTargetApi")
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

// Nada de esto llega al APK: la app sigue sin dependencias. org.json va aparte porque el de
// Android no corre en la JVM, y ZXing lee los códigos QR propios para comprobarlos.
dependencies {
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.json:json:20240303")
    testImplementation("com.google.zxing:core:3.5.3")
}
