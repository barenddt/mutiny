import { build as tsupBuild } from "tsup"

import {
  AppConfig,
  MUTINY_BUILD_DIR,
  ServerConfig,
  loadMutinyConfig,
} from "../utils"

export interface BuildOptions {
  app?: boolean
  server?: boolean
}

export async function build(
  options: BuildOptions = { app: true, server: true }
) {
  const { app, server } = options
  const mConfig = loadMutinyConfig()

  if (app) {
    await buildApp(mConfig.app)
  }

  if (server) {
    await buildServer(mConfig.server)
  }

  console.log("Build complete!")
}

export function buildApp(config: AppConfig) {
  return tsupBuild({
    entry: [config.entry],
    outDir: MUTINY_BUILD_DIR + "/app",
    format: ["cjs"],
    clean: true,
  })
}

export function buildServer(config: ServerConfig) {
  return tsupBuild({
    entry: [config.entry],
    outDir: MUTINY_BUILD_DIR + "/server",
    format: ["cjs"],
    clean: true,
  })
}
