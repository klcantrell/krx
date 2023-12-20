import path from "path"
import fs from "fs"

function applyAppBrand() {
  const brandName = process.env.APP_BRAND_NAME

  const themeSourcePath = path.join(__dirname, "..", "brand/theme", `${brandName}.ts`)
  const themeDestinationPath = path.join(__dirname, "..", "app/theme", "brand.ts")
  if (brandName && fs.existsSync(themeSourcePath)) {
    fs.copyFileSync(themeSourcePath, themeDestinationPath)
  } else {
    const themeDefaultPath = path.join(__dirname, "..", "brand/theme", "default.ts")
    fs.copyFileSync(themeDefaultPath, themeDestinationPath)
  }

  const imagesSourcePath = path.join(__dirname, "..", "brand/assets", `${brandName}`, "images")
  const imagesDestinationPath = path.join(__dirname, "..", "assets/brand/images")
  if (brandName && fs.existsSync(imagesDestinationPath)) {
    fs.cpSync(imagesSourcePath, imagesDestinationPath, { recursive: true })
  } else {
    const imagesDefaultPath = path.join(__dirname, "..", "brand/assets", "default", "images")
    fs.cpSync(imagesDefaultPath, imagesDestinationPath, { recursive: true })
  }

  const translationsSourcePath = path.join(__dirname, "..", "brand/copy", `${brandName}`, "en.ts")
  const translationsDestinationPath = path.join(__dirname, "..", "app/i18n/brand", "en.ts")
  if (brandName && fs.existsSync(imagesDestinationPath)) {
    fs.cpSync(translationsSourcePath, translationsDestinationPath, { recursive: true })
  } else {
    const translationsDefaultPath = path.join(__dirname, "..", "brand/copy", "default", "en.ts")
    fs.cpSync(translationsDefaultPath, translationsDestinationPath, { recursive: true })
  }
}

applyAppBrand()
