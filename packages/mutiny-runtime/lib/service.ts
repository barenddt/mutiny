import path from "path"

import fs from "fs-extra"
import { default as nodeWatch } from "node-watch"

import { buildApp } from "./cli/build"
import { FrameClient } from "./frame"
import { Frame } from "./types/core"
import { MUTINY_BUILD_DIR, loadMutinyConfig } from "./utils"
import { logger } from "./utils/logger"

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
    const appEntry = path.join(
      process.cwd(),
      MUTINY_BUILD_DIR,
      "app",
      "index.js"
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
          log("change detected, reinjecting script...")
          const script = fs.readFileSync(appEntry, "utf-8")
          await client.injectScript(script)
          log("script reinjected")
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
}
