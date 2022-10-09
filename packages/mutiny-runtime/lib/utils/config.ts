import path from "path"

import fs from "fs-extra"
import { z } from "zod"

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

export const MutinyConfigSchema = z.object({
  app: z.object(
    {
      entry: z.string({ required_error: "app.entry is required" }),
      watchDir: z
        .string({ invalid_type_error: "app.watchDir must be a string" })
        .optional(),
    },
    { required_error: "app is required" }
  ),
  server: z.object(
    {
      entry: z.string({ required_error: "server.entry is required" }),
      watchDir: z
        .string({ invalid_type_error: "server.watchDir must be a string" })
        .optional(),
    },
    { required_error: "server is required" }
  ),
})

export function loadMutinyConfig(): MutinyConfig {
  const configPath = path.resolve(process.cwd(), MUTINY_CONFIG_FILE)

  if (!fs.existsSync(configPath)) {
    throw new Error("Mutiny config file not found")
  }

  const config = fs.readJSONSync(configPath)

  const result = MutinyConfigSchema.safeParse(config)

  if (!result.success) {
    throw new Error(result.error.message)
  }

  return result.data
}
