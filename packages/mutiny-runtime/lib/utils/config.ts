import path from "path"

import fs from "fs-extra"

import { MUTINY_CONFIG_FILE } from "./constants"

export interface AppConfig {
  entry: string
  watchDir?: string
}

export interface ServerConfig {
  entry: string
  watchDir?: string
}

export interface MutinyConfig {
  app: AppConfig
  server: ServerConfig
}

export function loadMutinyConfig(): MutinyConfig {
  const configPath = path.resolve(process.cwd(), MUTINY_CONFIG_FILE)

  if (!fs.existsSync(configPath)) {
    throw new Error("Mutiny config file not found")
  }

  const config = fs.readJSONSync(configPath)

  return config
}
