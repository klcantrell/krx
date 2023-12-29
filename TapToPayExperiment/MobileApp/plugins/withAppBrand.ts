import { ConfigPlugin } from "expo/config-plugins"
import { ExpoConfig } from "@expo/config"
import path from "path"

import type { BrandAppManifest } from "./types"

export const withAppBrand: ConfigPlugin<{ projectRoot: string }> = (config, { projectRoot }) => {
  const brandName = process.env.APP_BRAND_NAME ?? "default"
  const sourcePath = path.join(projectRoot, "brand/app-manifest", `${brandName}.ts`)

  const { ios, android, app } = require(sourcePath)
  updateConfig(config, { ios, android, app })

  return config
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
