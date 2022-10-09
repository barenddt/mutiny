import path from "path"

import { default as nodeWatch } from "node-watch"
import { Options, build as tsupBuild } from "tsup"

import { AppConfig, MUTINY_BUILD_DIR } from "../utils"
import { logger } from "../utils/logger"

export type BuildOptions = {
  watch?: boolean
}

// const serverConfig: Options = {
//   entry: [server.entry],
//   outDir: MUTINY_BUILD_DIR + "/server",
//   format: ["cjs"],
//   clean: true,
//   silent: true,
// }

export async function buildApp(config: AppConfig, buildOpts: BuildOptions) {
  const log = logger({ scope: "app:build", color: "green" })

  const time = Date.now()

  const tsupConf: Options = {
    entry: [config.entry],
    outDir: MUTINY_BUILD_DIR + "/app",
    format: ["cjs"],
    clean: true,
    silent: true,
  }

  log(`building entry ${config.entry}`)
  await tsupBuild(tsupConf)
  log(`build success in ${Date.now() - time}ms`)

  if (buildOpts.watch) {
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

    log("watching for changes...")
  }
}

// export async function buildServer(
//   buildOpts: BuildOptions,
//   tsupConfig?: Options
// ) {
//   console.log(chalk.green("Building server..."))

//   await tsupBuild({
//     entry: [server.entry],
//     outDir: MUTINY_BUILD_DIR + "/server",
//     format: ["cjs"],
//     clean: true,
//     ...tsupConfig,
//   })

//   console.log(chalk.green("Built server"))
// }
