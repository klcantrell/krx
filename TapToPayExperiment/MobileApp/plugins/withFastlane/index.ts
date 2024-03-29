import { ConfigPlugin, withPlugins, withDangerousMod } from "expo/config-plugins"
import fs from "fs"
import path from "path"
import Handlebars from "handlebars"

import type { BrandAppManifest } from "../types"

export const withFastlane: ConfigPlugin = (config) => {
  return withPlugins(config, [withFastlaneIos, withFastlaneAndroid])
}

const withFastlaneIos: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    (modConfig) => {
      const sourceDirectory = path.join(__dirname, "templates")
      const destinationDirectory = path.join(modConfig.modRequest.platformProjectRoot, "fastlane")

      if (!fs.existsSync(destinationDirectory)) {
        fs.mkdirSync(destinationDirectory, { recursive: true })
      }

      // get app manifest
      const brandName = process.env.APP_BRAND_NAME ?? "default"
      const brandManifestPath = path.join(
        modConfig.modRequest.projectRoot,
        "brand/app-manifest",
        `${brandName}.ts`,
      )

      const { ios, app } = require(brandManifestPath) as BrandAppManifest

      // generate Appfile
      const appFileTemplate = Handlebars.compile(
        fs.readFileSync(path.join(sourceDirectory, "iosAppfile"), {
          encoding: "utf8",
        }),
      )
      const appFile = appFileTemplate({
        bundleIdentifier: ios.bundleIdentifier,
        // TODO: make these configurable
        appleId: "cantrellkalalau@gmail.com",
        appStoreConnectTeam: "121157298",
        appleDeveloperTeam: "BMJG6U6BC7",
      })
      fs.writeFileSync(path.join(destinationDirectory, "Appfile"), appFile)

      // generate Fastfile
      const fastFileTemplate = Handlebars.compile(
        fs.readFileSync(path.join(sourceDirectory, "iosFastfile"), {
          encoding: "utf8",
        }),
      )
      const fastFile = fastFileTemplate({
        appName: app.name,
        scheme: app.name,
        buildConfiguration: "Release",
        // TODO: make this configurable
        appleDeveloperTeam: "BMJG6U6BC7",
        bundleIdentifier: ios.bundleIdentifier,
        provisioningProfile: ios.provisioningProfile,
      })
      fs.writeFileSync(path.join(destinationDirectory, "Fastfile"), fastFile)

      // copy Gemfile
      fs.copyFileSync(
        path.join(sourceDirectory, "Gemfile"),
        path.join(modConfig.modRequest.platformProjectRoot, "Gemfile"),
      )
      fs.copyFileSync(
        path.join(sourceDirectory, "Gemfile.lock"),
        path.join(modConfig.modRequest.platformProjectRoot, "Gemfile.lock"),
      )

      return modConfig
    },
  ])
}

const withFastlaneAndroid: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    (modConfig) => {
      const sourceDirectory = path.join(__dirname, "templates")
      const destinationDirectory = path.join(modConfig.modRequest.platformProjectRoot, "fastlane")

      if (!fs.existsSync(destinationDirectory)) {
        fs.mkdirSync(destinationDirectory, { recursive: true })
      }

      // get app manifest
      const brandName = process.env.APP_BRAND_NAME ?? "default"
      const brandManifestPath = path.join(
        modConfig.modRequest.projectRoot,
        "brand/app-manifest",
        `${brandName}.ts`,
      )

      const { android, app } = require(brandManifestPath) as BrandAppManifest

      // generate Appfile
      const appFileTemplate = Handlebars.compile(
        fs.readFileSync(path.join(sourceDirectory, "androidAppfile"), {
          encoding: "utf8",
        }),
      )
      const appFile = appFileTemplate({
        package: android.package,
      })
      fs.writeFileSync(path.join(destinationDirectory, "Appfile"), appFile)

      // generate Fastfile
      const fastFileTemplate = Handlebars.compile(
        fs.readFileSync(path.join(sourceDirectory, "androidFastfile"), {
          encoding: "utf8",
        }),
      )
      const fastFile = fastFileTemplate({
        keystoreName: `${app.name}.keystore`,
      })
      fs.writeFileSync(path.join(destinationDirectory, "Fastfile"), fastFile)

      // copy Gemfile
      fs.copyFileSync(
        path.join(sourceDirectory, "Gemfile"),
        path.join(modConfig.modRequest.platformProjectRoot, "Gemfile"),
      )
      fs.copyFileSync(
        path.join(sourceDirectory, "Gemfile.lock"),
        path.join(modConfig.modRequest.platformProjectRoot, "Gemfile.lock"),
      )

      return modConfig
    },
  ])
}
