import fs from "fs-extra"
import path from "path"
import { rollup } from "rollup"

export async function build() {
  fs.removeSync(path.join(process.cwd(), ".mutiny"))

  if (!fs.existsSync(path.join(process.cwd(), "rollup.config.js"))) {
    throw new Error("Rollup config file not found")
  }

  const config = require(path.join(process.cwd(), "rollup.config.js"))

  const bundle = await rollup(config)

  await bundle.write(config.output)

  console.log("Build successful")
}
