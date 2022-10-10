import { MUTINY_BUILD_DIR, loadMutinyConfig, logger } from "./utils"

import { Frame } from "./types/core"
import { FrameClient } from "./frame"
import { buildApp } from "./build"
import fs from "fs-extra"
import keypress from "keypress"
import { default as nodeWatch } from "node-watch"
import path from "path"

keypress(process.stdin)

const log = logger({ scope: "service", color: "magenta" })

export type ServiceConfig = {
  watch: boolean
}

export async function startService(config: ServiceConfig) {
  const { app } = loadMutinyConfig()
  const { watch } = config

  await buildApp(app, { watch })

  const frame = new FrameClient(Frame.SP)

  log("service started. waiting for frame to connect...")

  frame.on("connected", async (client: FrameClient) => {
    log(`injected mutiny into frame`)

    const appEntry = path.join(
      process.cwd(),
      MUTINY_BUILD_DIR,
      "app",
      "index.global.js"
    )

    const script = fs.readFileSync(appEntry, "utf-8")

    await client.injectScript(script)

    client.CDP.on("Page.loadEventFired", async () => {
      await client.injectScript(script)
    })

    if (watch) {
      nodeWatch(
        path.join(process.cwd(), ".mutiny/app"),
        { recursive: true },
        async () => {
          log("change detected, hot-reloading app...")
          const script = fs.readFileSync(appEntry, "utf-8")
          await client.injectScript(script)
        }
      )
    }
  })

  frame.on("disconnected", (client) => {
    client.CDP.close()
  })

  process.on("SIGINT", () => {
    log("service stopped")

    if (frame.CDP) {
      log("closing frame connection...")
      frame.CDP.close()
    }

    process.exit()
  })

  process.stdin.on("keypress", function (_ch, key) {
    if (key && key.ctrl && key.name == "r") {
      frame.hardReload()
    }

    if (key && key.ctrl && key.name == "c") {
      process.emit("SIGINT")
    }
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()
}
