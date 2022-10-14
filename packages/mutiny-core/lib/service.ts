import { MUTINY_BUILD_DIR, MutinyConfig, loadDotEnv, loadMutinyConfig, logger } from "./utils"

import { Frame } from "./types/core"
import { FrameClient } from "./frame"
import { build } from "./build"
import childProcess from "child_process"
import fs from "fs-extra"
import keypress from "keypress"
import { default as nodeWatch } from "node-watch"
import path from "path"

keypress(process.stdin)

const log = logger({ scope: "service", color: "magenta" })

export type ServiceConfig = {
  watch: boolean
  scope?: keyof MutinyConfig
}

export async function startDevService(options: ServiceConfig) {
  const mConfig = loadMutinyConfig()
  const { watch = true, scope } = options

  await build({ scope, watch })

  if ((!scope || scope === "server") && mConfig.server) {
    await startServerService({ watch })
  }

  if ((!scope || scope === "app") && mConfig.app) {
    await startAppService({ watch })
  }
}

export async function startAppService(config: ServiceConfig) {
  const { watch } = config

  const frame = new FrameClient(Frame.SP)

  log("service started. waiting for frame to connect...")

  frame.on("connected", async (client: FrameClient) => {
    const appEntry = path.join(process.cwd(), MUTINY_BUILD_DIR, "app", "index.js")

    const script = fs.readFileSync(appEntry, "utf-8")

    await client.injectScript(script)

    client.CDP.on("Page.loadEventFired", async () => {
      await client.injectScript(script)
    })

    if (watch) {
      nodeWatch(path.join(process.cwd(), ".mutiny/app"), { recursive: true }, async () => {
        log("change detected, hot-reloading app...")
        const script = fs.readFileSync(appEntry, "utf-8")
        await client.injectScript(script)
      })
    }
  })

  frame.on("disconnected", (client) => {
    client.CDP.close()
  })

  process.on("SIGINT", () => safeStop())

  process.stdin.on("keypress", function (_ch, key) {
    if (key && key.ctrl && key.name == "r") {
      if (frame.CDP) {
        frame.hardReload()
      }
    }

    if (key && key.ctrl && key.name == "c") {
      safeStop()
    }
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()

  function safeStop() {
    log("service stopped")

    if (frame.CDP) {
      log("closing frame connection...")
      frame.CDP.close()
    }

    process.exit()
  }
}

export async function startServerService(config: ServiceConfig) {
  const { watch } = config

  const env = loadDotEnv()

  const serverEntry = path.join(process.cwd(), MUTINY_BUILD_DIR, "server", "index.js")

  let server = childProcess.fork(serverEntry, [], {
    env,
    stdio: "inherit",
  })

  if (watch) {
    nodeWatch(path.join(process.cwd(), ".mutiny/server", "index.js"), { recursive: true }, () => {
      log("change detected, restarting server...")
      server.kill()

      server = childProcess.fork(serverEntry, [], {
        env,
        stdio: "inherit",
      })
    })
  }

  process.on("SIGINT", () => server.kill())

  process.stdin.on("keypress", function (_ch, key) {
    if (key && key.ctrl && key.name == "c") {
      server.kill()
      process.exit()
    }
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()
}
