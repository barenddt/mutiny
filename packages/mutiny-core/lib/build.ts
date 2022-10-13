import { MUTINY_BUILD_DIR, MutinyConfig, loadDotEnv } from "./utils"
import { Options, build as tsupBuild } from "tsup"

import globals from "esbuild-plugin-globals"
import { logger } from "./utils/logger"
import { default as nodeWatch } from "node-watch"
import path from "path"

const log = logger({ scope: "app:build", color: "green" })

export type Opts = {
  watch?: boolean
}

export async function buildApp(config: MutinyConfig, opts: Opts) {
  const time = Date.now()

  const env = loadDotEnv()

  if (env) {
    log("loaded .env file")
  }

  const tsupConf: Options = {
    entry: [config.appEntry],
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
    env: env ?? {},
  }

  log(`building entry ${config.appEntry}`)
  await tsupBuild(tsupConf)
  log(`build success in ${Date.now() - time}ms`)

  if (opts.watch) {
    if (!config.watchDirs?.length) {
      throw new Error("No watchDirs specified in mutiny.config.json")
    }

    nodeWatch(config.watchDirs.map(makeWatchPath), { recursive: true }, async () => {
      const time = Date.now()
      log(`change detected, rebuilding entry ${config.appEntry}...`)
      await tsupBuild(tsupConf)
      log("build success in " + (Date.now() - time) + "ms")
    })

    log("ready for changes...")
  }
}

export function makeWatchPath(watchDir: string) {
  return path.join(process.cwd(), watchDir)
}
