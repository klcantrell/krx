export const app = {
  name: "TapToPayExperiment",
  slug: "TapToPayExperiment",
  scheme: "taptopayexperiment",
}

export const ios = {
  icon: "./brand/assets/default/app-icon/ios-universal.png",
  bundleIdentifier: "com.taptopayexperiment",
  splash: {
    image: "./brand/assets/default/splash-screen/logo.png",
    tabletImage: "./brand/assets/default/splash-screen/logo.png",
    backgroundColor: "#191015",
  },
}

export const android = {
  icon: "./brand/assets/default/app-icon/android-legacy.png",
  adaptiveIcon: {
    foregroundImage: "./brand/assets/default/app-icon/android-adaptive-foreground.png",
    backgroundImage: "./brand/assets/default/app-icon/android-adaptive-background.png",
  },
  package: "com.taptopayexperiment",
  splash: {
    image: "./brand/assets/default/splash-screen/logo.png",
    backgroundColor: "#191015",
  },
}
