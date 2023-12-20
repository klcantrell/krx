export const app = {
  name: "CrabPods",
  slug: "CrabPods",
  scheme: "crabpods",
}

export const ios = {
  icon: "./brand/assets/crab/app-icon/ios-universal.png",
  bundleIdentifier: "com.crabpods",
  splash: {
    image: "./brand/assets/crab/splash-screen/logo.png",
    tabletImage: "./brand/assets/crab/splash-screen/logo.png",
    backgroundColor: "#3C3836",
  },
}

export const android = {
  icon: "./brand/assets/crab/app-icon/android-legacy.png",
  adaptiveIcon: {
    foregroundImage: "./brand/assets/crab/app-icon/android-adaptive-foreground.png",
    backgroundImage: "./brand/assets/crab/app-icon/android-adaptive-background.png",
  },
  package: "com.crabpods",
  splash: {
    image: "./brand/assets/crab/splash-screen/logo.png",
    backgroundColor: "#3C3836",
  },
}
