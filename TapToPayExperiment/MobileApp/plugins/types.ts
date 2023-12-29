export interface BrandAppManifest {
  ios: {
    icon: string
    bundleIdentifierDev: string
    bundleIdentifier: string
    provisioningProfile: string
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
