import { Frame } from "./types/core"
import { FrameClient } from "./frame"
import chalk from "chalk"
import fs from "fs-extra"
import { default as nodeWatch } from "node-watch"
import path from "path"

export type ServiceConfig = {
  watch: boolean
}

export async function startService(config: ServiceConfig) {
  const { watch } = config

  const frame = new FrameClient(Frame.SP)

  frame.on("connected", async (client: FrameClient) => {
    const appEntry = path.join(process.cwd(), ".mutiny/app/index.js")
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
          console.log(chalk.magentaBright("Hot reloading..."))
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
    console.log("Closing CDP...")

    if (frame.CDP) {
      frame.CDP.close()
    }

    process.exit()
  })
}
