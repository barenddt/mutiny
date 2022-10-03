import { Frame, FrameInfo, LogLevel } from "./types";

import { FrameClientOptions } from "./frame";
import Protocol from "devtools-protocol";
import axios from "axios";
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

export async function getFrames(): Promise<FrameInfo[]> {
  try {
    const response = await axios.get("http://localhost:8080/json");
    const json: FrameInfo[] = await response.data;
    return json;
  } catch (error) {
    throw new Error("Could not get frames");
  }
}

export async function getFrameInfo(frame: Frame): Promise<FrameInfo> {
  try {
    const pages = await getFrames();
    const page = pages.find((p) => p.title === frame);
    if (!page) {
      throw new Error(`Page not found`);
    }
    return page;
  } catch (error) {
    throw new Error("Could not get frame info");
  }
}
