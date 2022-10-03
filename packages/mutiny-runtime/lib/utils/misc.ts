import { FrameClientOptions } from "../frame";
import { LogLevel } from "../types/core";
import Protocol from "devtools-protocol";
import fs from "fs-extra";
import path from "path";

export function loadScript(p: string): string {
  const script = fs.readFileSync(path.resolve(__dirname, p), "utf-8");
  return script;
}

export function formatConsoleMessage(debug?: FrameClientOptions["logging"]) {
  return function (message: Protocol.Console.MessageAddedEvent) {
    const { level, text } = message.message;
    const { logLevels, enable } = debug || {};

    if (!enable) {
      return;
    }

    if (logLevels && !logLevels.includes(level as LogLevel)) {
      return;
    }

    console.log(text);
  };
}
