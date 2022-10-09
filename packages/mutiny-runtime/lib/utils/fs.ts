import fs from "fs-extra"
import path from "path"

export function checkFileExists(path: string): boolean {
  try {
    fs.accessSync(path)
    return true
  } catch (e) {
    return false
  }
}

type MutinyConfig = {}

export function loadMutinyConfig(): MutinyConfig {
  const configPath = path.resolve(process.cwd(), "mutiny.config.json")

  if (!checkFileExists(configPath)) {
    throw new Error("Mutiny config file not found")
  }

  const config = fs.readJSONSync(configPath)

  return config
}
