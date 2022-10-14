import { BuildConfig, MUTINY_BUILD_DIR, MutinyConfig, loadDotEnv, loadMutinyConfig } from "./utils"
import { Options, build as tsupBuild } from "tsup"
import { RollupOptions, rollup } from "rollup"

import { ProcessEnvOptions } from "child_process"
import commonjs from "@rollup/plugin-commonjs"
import injectEnv from "rollup-plugin-inject-process-env"
import json from "@rollup/plugin-json"
import { logger } from "./utils/logger"
import nodeResolve from "@rollup/plugin-node-resolve"
import { default as nodeWatch } from "node-watch"
import path from "path"
import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"

export type RunBuildOpts = {
  watch: boolean
  scope?: keyof MutinyConfig
}

export async function build(options: RunBuildOpts) {
  const { watch, scope } = options
  const { server, app } = loadMutinyConfig()

  if ((!scope || scope === "server") && server) {
    await buildServer(server, watch)
  }

  if (!scope || scope === "app") {
    await buildApp(app, watch)
  }
}

export async function buildServer(config: BuildConfig, watch: boolean) {
  const log = logger({ scope: "build:server", color: "green" })
  const time = Date.now()

  const tsupConf: Options = {
    entry: [config.entry],
    outDir: MUTINY_BUILD_DIR + "/server",
    format: ["cjs"],
    clean: true,
    silent: true,
    minify: true,
  }

  log(`building ${config.entry}`)
  await tsupBuild(tsupConf)
  log(`build success in ${Date.now() - time}ms`)

  if (watch) {
    if (!config.watchDirs?.length) {
      throw new Error("No watchDirs specified in mutiny.config.json")
    }

    nodeWatch(makeWatchPaths(config.watchDirs), { recursive: true }, async () => {
      const time = Date.now()
      log(`change detected, rebuilding ${config.entry}...`)
      await tsupBuild(tsupConf)
      log(`build success in ${Date.now() - time}ms`)
    })

    log("ready for changes...")
  }
}

export async function buildApp(config: BuildConfig, watch: boolean) {
  const env = loadDotEnv()
  const log = logger({ scope: "build:app", color: "green" })
  const time = Date.now()

  log(`building ${config.entry}`)
  await rollupApp(config, env)
  log(`build success in ${Date.now() - time}ms`)

  if (watch) {
    if (!config.watchDirs?.length) {
      throw new Error("No watchDirs specified in mutiny.config.json")
    }

    nodeWatch(makeWatchPaths(config.watchDirs), { recursive: true }, async () => {
      const time = Date.now()
      log(`change detected, rebuilding ${config.entry}...`)
      await rollupApp(config, env)
      log(`build success in ${Date.now() - time}ms`)
    })

    log("ready for changes...")
  }
}

export async function rollupApp(config: BuildConfig, env: ProcessEnvOptions["env"] | undefined) {
  const rollupConfig: RollupOptions = {
    input: config.entry,
    context: "window",
    external: ["react", "react-dom"],
    plugins: [
      json(),
      typescript(),
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: false,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      injectEnv(env),
    ],
  }

  const bundle = await rollup(rollupConfig)

  return bundle.write({
    file: MUTINY_BUILD_DIR + "/app/index.js",
    format: "iife",
    globals: {
      react: "SP_REACT",
      "react-dom": "SP_REACTDOM",
    },
  })
}

export function makeWatchPaths(watchDirs: string[]): string[] {
  return watchDirs.map((dir) => path.join(process.cwd(), dir))
}
