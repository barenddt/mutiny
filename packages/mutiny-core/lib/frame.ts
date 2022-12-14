import { Frame, FrameInfo, LogLevel } from "./types/core"
import { formatConsoleMessage, getFrameInfo, logger } from "./utils"

import CDP from "chrome-remote-interface"
import { EventEmitter } from "node:events"

const log = logger({ scope: "service:frame", color: "magenta" })

export interface FrameClientOptions {
  pollInterval?: number
  logging?: {
    enable?: boolean
    logLevels?: LogLevel[]
  }
  agents?: {
    enableDOM?: boolean
    enableCSS?: boolean
    enableConsole?: boolean
    enablePage?: boolean
  }
}

const defaultOptions: FrameClientOptions = {
  pollInterval: 250,
  logging: {
    enable: false,
    logLevels: [LogLevel.DEBUG],
  },
  agents: {
    enableDOM: true,
    enableCSS: true,
    enableConsole: true,
    enablePage: true,
  },
}

export class FrameClient extends EventEmitter {
  private intervalId: NodeJS.Timeout | null = null
  private isConnected = false
  public CDP!: CDP.Client
  public frameInfo!: FrameInfo

  constructor(private frame: Frame, private options: FrameClientOptions = defaultOptions) {
    super()
    this.start()
  }

  public start() {
    if (this.intervalId) return clearInterval(this.intervalId)

    this.intervalId = setInterval(async () => {
      try {
        const frameInfo = await getFrameInfo(this.frame)
        if (this.isConnected) return
        this.frameInfo = frameInfo
        await this.initCDPClient(frameInfo)
        log(`${this.frame} frame connected`)
        this.isConnected = true
        this.emit("connected", this)
      } catch (e) {
        if (!this.isConnected) return
        log(`${this.frame} frame disconnected`)
        this.isConnected = false
        this.emit("disconnected", this)
      }
    }, this.options?.pollInterval || 500)
  }

  public stop() {
    if (this.intervalId) clearInterval(this.intervalId)
    if (this.CDP) this.CDP.close()
  }

  private async initCDPClient(frameInfo: FrameInfo) {
    if (this.CDP) await this.CDP.close()

    this.CDP = await CDP({
      target: frameInfo.webSocketDebuggerUrl,
    })

    if (this.options?.logging?.enable) {
      this.CDP["Console.messageAdded"](formatConsoleMessage(this.options?.logging))
    }

    await Promise.all([
      this.options?.agents?.enableDOM ? this.CDP.DOM.enable() : Promise.resolve(),
      this.options?.agents?.enableCSS ? this.CDP.CSS.enable() : Promise.resolve(),
      this.options?.agents?.enableConsole ? this.CDP.Console.enable() : Promise.resolve(),
      this.options?.agents?.enablePage ? this.CDP.Page.enable() : Promise.resolve(),
    ])
  }

  public async injectScript(script: string, silent?: boolean): Promise<void> {
    const time = Date.now()
    await this.CDP.Runtime.evaluate({
      expression: script,
      silent: silent || true,
    })
    log(`inject to ${this.frame} frame success in ${Date.now() - time}ms`)
  }

  public async addStyleSheet(css: string): Promise<string> {
    if (!this.options?.agents?.enableCSS) {
      throw new Error("CSS agent is not enabled")
    }

    const { styleSheetId } = await this.CDP.CSS.createStyleSheet({
      frameId: this.frameInfo.id,
    })

    await this.CDP.CSS.setStyleSheetText({
      styleSheetId,
      text: css,
    })

    return styleSheetId
  }

  public async removeStyleSheet(styleSheetId: string): Promise<void> {
    if (!this.options?.agents?.enableCSS) {
      throw new Error("CSS agent is not enabled")
    }

    await this.CDP.CSS.setStyleSheetText({
      styleSheetId,
      text: "",
    })
  }

  public async hardReload(): Promise<void> {
    if (!this.options?.agents?.enablePage) {
      throw new Error("Page agent is not enabled")
    }

    await this.CDP.Page.reload({ ignoreCache: true })
    log(`sent hard reload cmd to ${this.frame} frame`)
  }
}
