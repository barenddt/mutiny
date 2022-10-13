import { MUTINY_CONFIG_FILE } from "./constants"
import fs from "fs-extra"
import { parse } from "dotenv"
import path from "path"
import { z } from "zod"

export interface MutinyConfig {
  appEntry: string
  serverEntry?: string
  watchDirs?: string[]
}

export const MutinyConfigSchema = z.object({
  appEntry: z.string({ required_error: "appEntry is required" }),
  serverEntry: z.string().optional(),
  watchDirs: z
    .array(z.string({ invalid_type_error: "watchDirs must be an array of strings" }))
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
