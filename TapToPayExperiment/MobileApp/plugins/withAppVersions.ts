import { ConfigPlugin } from "expo/config-plugins"
import { ExpoConfig } from "@expo/config"

import Versions from "../versions.json"

export const withAppVersions: ConfigPlugin = (config) => {
  config.version = Versions.version

  const updatedIosConfig: ExpoConfig["ios"] = {
    ...config.ios,
    buildNumber: Versions.iosBuildNumber,
  }
  const updatedAndroidConfig: ExpoConfig["android"] = {
    ...config.android,
    versionCode: Versions.androidVersionCode,
  }

  config.ios = updatedIosConfig
  config.android = updatedAndroidConfig

  return config
}
