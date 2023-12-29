import { ConfigPlugin } from "expo/config-plugins"
import { ExpoConfig } from "@expo/config"
import fs from "fs"
import path from "path"

export const withAppBrand: ConfigPlugin<{ projectRoot: string }> = (config, { projectRoot }) => {
  const brandName = process.env.APP_BRAND_NAME
  const sourcePath = path.join(projectRoot, "brand/app-manifest", `${brandName}.ts`)

  if (brandName && fs.existsSync(sourcePath)) {
    const { ios, android, app } = require(sourcePath)
    updateConfig(config, { ios, android, app })
  } else {
    const defaultPath = path.join(projectRoot, "brand/app-manifest", "default.ts")

    const { ios, android, app } = require(defaultPath)
    updateConfig(config, { ios, android, app })
  }

  return config
}

interface BrandAppManifest {
  ios: {
    icon: string
    bundleIdentifierDev: string
    bundleIdentifier: string
    splash: {
      image: string
      tabletImage: string
      backgroundColor: string
    }
  }
  android: {
    icon: string
    adaptiveIcon: {
      foregroundImage: string
      backgroundImage: string
    }
    packageDev: string
    package: string
    splash: {
      image: string
      backgroundColor: string
    }
  }
  app: {
    name: string
    slug: string
    scheme: string
  }
}

function updateConfig(config: ExpoConfig, { ios, android, app }: BrandAppManifest) {
  config.name = app.name
  config.slug = app.slug
  config.scheme = app.scheme

  const updatedIosConfig: ExpoConfig["ios"] = {
    ...config.ios,
    bundleIdentifier:
      process.env.APP_ENV === "development" ? ios.bundleIdentifierDev : ios.bundleIdentifier,
    icon: ios.icon,
    splash: {
      ...config.ios?.splash,
      ...ios.splash,
    },
  }
  const updatedAndroidConfig: ExpoConfig["android"] = {
    ...config.android,
    icon: android.icon,
    adaptiveIcon: android.adaptiveIcon,
    package: process.env.APP_ENV === "development" ? android.packageDev : android.package,
    splash: {
      ...config.android?.splash,
      ...android.splash,
    },
  }

  config.ios = updatedIosConfig
  config.android = updatedAndroidConfig
}
