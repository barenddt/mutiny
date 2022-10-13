import { BuildConfig, MUTINY_BUILD_DIR, MutinyConfig, loadDotEnv, loadMutinyConfig } from "./utils"
import { Options, build as tsupBuild } from "tsup"

import globals from "esbuild-plugin-globals"
import { logger } from "./utils/logger"
import { default as nodeWatch } from "node-watch"
import path from "path"

export type RunBuildOpts = {
  watch: boolean
  scope?: keyof MutinyConfig
}

export async function build(options: RunBuildOpts) {
  const { watch, scope } = options

  const mConfig = loadMutinyConfig()
  const env = loadDotEnv()

  if (!scope || scope === "server") {
    const serverConfig = createBuildServerConfig(mConfig, watch, env)

    if (serverConfig) {
      await runBuild(serverConfig)
    }
  }

  if (!scope || scope === "app") {
    const appConfig = createBuildAppConfig(mConfig, watch, env)
    await runBuild(appConfig)
  }
}

export function createBuildAppConfig(
  config: MutinyConfig,
  watch: boolean,
  env: Record<string, string> | null
): BuildOptions {
  const { app } = config

  const tsupConf: Options = {
    entry: [app.entry],
    outDir: MUTINY_BUILD_DIR + "/app",
    format: ["iife"],
    clean: true,
    silent: true,
    replaceNodeEnv: true,
    minify: true,
    external: ["react", "react-dom"],
    plugins: [
      globals({
        react: "SP_REACT",
        "react-dom": "SP_REACTDOM",
      }),
    ],
    env: env || {},
  }

  return { scope: "app", config: app, tsupConf, watch }
}

export function createBuildServerConfig(
  config: MutinyConfig,
  watch: boolean,
  env: Record<string, string> | null
): BuildOptions | null {
  const { server } = config

  if (!server) return null

  const tsupConf: Options = {
    entry: [server.entry],
    outDir: MUTINY_BUILD_DIR + "/server",
    format: ["cjs", "esm"],
    clean: true,
    silent: true,
    minify: true,
    env: env || {},
  }

  return { scope: "server", config: server, tsupConf, watch }
}

export interface BuildOptions {
  scope: keyof MutinyConfig
  config: BuildConfig
  tsupConf: Options
  watch: boolean
}

export async function runBuild(options: BuildOptions) {
  const { scope, config, tsupConf, watch } = options
  const log = logger({ scope: `build:${scope}`, color: "green" })
  const time = Date.now()

  const env = loadDotEnv()

  log(`building entry ${config.entry}`)
  await tsupBuild({ ...tsupConf, env: env ?? {} })
  log(`build success in ${Date.now() - time}ms`)

  if (watch) {
    if (!config.watchDirs?.length) {
      throw new Error("No watchDirs specified in mutiny.config.json")
    }

    nodeWatch(makeWatchPaths(config.watchDirs), { recursive: true }, async () => {
      const time = Date.now()
      log(`change detected, rebuilding entry ${config.entry}...`)
      await tsupBuild({ ...tsupConf, env: env ?? {} })
      log(`build success in ${Date.now() - time}ms`)
    })

    log("ready for changes...")
  }
}

export function makeWatchPaths(watchDirs: string[]): string[] {
  return watchDirs.map((dir) => path.join(process.cwd(), dir))
}
