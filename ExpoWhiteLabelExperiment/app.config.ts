import { ExpoConfig, ConfigContext } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config, projectRoot }: ConfigContext): Partial<ExpoConfig> => {
  const plugins = config.plugins ?? []

  plugins.push(require("./plugins/withSplashScreen").withSplashScreen)
  plugins.push([require("./plugins/withAppBrand").withAppBrand, { projectRoot }])

  if (process.env.APP_ENV === "development") {
    plugins.push(require("./plugins/withAndroidNetworkConfig").withAndroidNetworkConfig)
  }

  return {
    ...config,
    plugins,
  }
}
