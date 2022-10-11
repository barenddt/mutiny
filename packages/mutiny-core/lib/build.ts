import { AppConfig, MUTINY_BUILD_DIR, loadDotEnv } from "./utils"
import { Options, build as tsupBuild } from "tsup"

import globals from "esbuild-plugin-globals"
import { logger } from "./utils/logger"
import { default as nodeWatch } from "node-watch"
import path from "path"

const log = logger({ scope: "app:build", color: "green" })

export type Opts = {
  watch?: boolean
}

export async function buildApp(config: AppConfig, opts: Opts) {
  const time = Date.now()

  const env = loadDotEnv()

  if (env) {
    log("loaded .env file")
  }

  const tsupConf: Options = {
    entry: [config.entry],
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

  log(`building entry ${config.entry}`)
  await tsupBuild(tsupConf)
  log(`build success in ${Date.now() - time}ms`)

  if (opts.watch) {
    if (!config.watchDir) {
      throw new Error("No watchDir specified in mutiny.config.json")
    }

    nodeWatch(
      path.join(process.cwd(), config.watchDir),
      { recursive: true },
      async () => {
        const time = Date.now()
        log(`change detected, rebuilding entry ${config.entry}...`)
        await tsupBuild(tsupConf)
        log("build success in " + (Date.now() - time) + "ms")
      }
    )

    log("ready for changes...")
  }
}
