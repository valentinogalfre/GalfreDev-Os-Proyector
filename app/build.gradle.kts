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
        versionCode = 1
        versionName = "0.1.0"
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
