import {
  ConfigPlugin,
  AndroidConfig,
  withAndroidManifest,
  withPlugins,
  withDangerousMod,
} from "expo/config-plugins"
import fs from "fs"
import path from "path"

const NETWORK_CONFIG_FILE_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated using our withAndroidNetworkConfig Expo config plugin -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <!-- For React Native Hot-reloading system -->
        <!-- If you are running on a device insert your computer IP -->
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>

    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
`

export const withAndroidNetworkConfig: ConfigPlugin = (config) => {
  return withPlugins(config, [withCustomMainApplication, withNetworkConfigFile])
}

const withNetworkConfigFile: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    (modConfig) => {
      const xmlResourcesDirectory = path.join(
        modConfig.modRequest.platformProjectRoot,
        "app/src/main/res/xml",
      )
      const networkConfigFilePath = path.join(xmlResourcesDirectory, "network_security_config.xml")

      if (!fs.existsSync(xmlResourcesDirectory)) {
        fs.mkdirSync(xmlResourcesDirectory, { recursive: true })
      }

      fs.writeFileSync(networkConfigFilePath, NETWORK_CONFIG_FILE_CONTENT)

      return modConfig
    },
  ])
}

const withCustomMainApplication: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (modConfig) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(modConfig.modResults)

    mainApplication.$["android:networkSecurityConfig"] = "@xml/network_security_config"

    return modConfig
  })
}
