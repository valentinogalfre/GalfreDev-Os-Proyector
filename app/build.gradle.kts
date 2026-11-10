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
        versionCode = 4
        versionName = "1.2.0"
    }

    signingConfigs {
        // Con minSdk 26 AGP firma solo con v2, y hay firmwares de proyector que rechazan esos APK.
        getByName("debug") {
            enableV1Signing = true
            enableV2Signing = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    testOptions {
        unitTests.isReturnDefaultValues = true
        // Algunos contratos leen estos archivos: si cambian, los tests tienen que volver a correr.
        unitTests.all { it.inputs.files("../docs/instalar.md", "src/main/res/values/strings.xml", "src/main/res/layout/activity_player.xml") }
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
