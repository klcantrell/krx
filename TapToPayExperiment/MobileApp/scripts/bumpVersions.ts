import path from "path"
import fs from "fs"

import Versions from "../versions.json"

const SUPPORTED_FLAGS = ["ios", "android"]

function bumpVersions() {
  if (process.argv.length > 3) {
    throw new Error(
      "Pass only 1 argument to modify a particular platform (e.g. 'npm run bumpVersions -- ios' to modify iOS). Multiple flags are not supported. To modify all platforms, pass no arguments",
    )
  }

  const newVersions: typeof Versions = {
    ...Versions,
  }
  const flag = process.argv.length === 3 ? process.argv[2] : undefined
  if (flag && !SUPPORTED_FLAGS.includes(flag.toLowerCase())) {
    throw new Error(
      `Unsupported platform - supported platforms include [${SUPPORTED_FLAGS.join(
        ", ",
      )}]. For example, to modify iOS, pass 'ios' as an argument.`,
    )
  }

  if (!flag || flag.toLowerCase() === "ios") {
    const previousIosBuildNumber = Number(Versions.iosBuildNumber)
    if (isNaN(previousIosBuildNumber)) {
      throw new Error("Previous iOS build number is not a number")
    }

    newVersions.iosBuildNumber = `${previousIosBuildNumber + 1}`
  }

  if (!flag || flag.toLowerCase() === "android") {
    newVersions.androidVersionCode = Versions.androidVersionCode + 1
  }

  const destinationPath = path.join(__dirname, "..", "versions.json")
  fs.writeFileSync(destinationPath, `${JSON.stringify(newVersions, null, 2)}\n`)
}

bumpVersions()
