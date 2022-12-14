import { FrameClientOptions } from "../frame"
import { LogLevel } from "../types/core"
import Protocol from "devtools-protocol"

export function formatConsoleMessage(debug?: FrameClientOptions["logging"]) {
  return function (message: Protocol.Console.MessageAddedEvent) {
    const { level, text } = message.message
    const { logLevels, enable } = debug || {}

    if (!enable) {
      return
    }

    if (logLevels && !logLevels.includes(level as LogLevel)) {
      return
    }

    console.log(text)
  }
}
