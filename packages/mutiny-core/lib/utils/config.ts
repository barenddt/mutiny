import { MUTINY_CONFIG_FILE } from "./constants"
import fs from "fs-extra"
import { parse } from "dotenv"
import path from "path"
import { z } from "zod"

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
  server?: ServerConfig
}

export const MutinyConfigSchema = z.object({
  app: z.object(
    {
      entry: z.string({ required_error: "app.entry is required" }),
      watchDir: z.string({ invalid_type_error: "app.watchDir must be a string" }).optional(),
    },
    { required_error: "app is required" }
  ),
  server: z
    .object(
      {
        entry: z.string({ required_error: "server.entry is required" }),
        watchDir: z.string({ invalid_type_error: "server.watchDir must be a string" }).optional(),
      },
      { required_error: "server is required" }
    )
    .optional(),
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

export function loadDotEnv(): Record<string, string> | null {
  const envPath = path.resolve(process.cwd(), ".env")

  if (!fs.existsSync(envPath)) {
    return null
  }

  const env = parse(fs.readFileSync(envPath, "utf-8"))

  return env
}
