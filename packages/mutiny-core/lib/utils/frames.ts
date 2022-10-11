import { Frame, FrameInfo } from "../types/core"

import axios from "axios"

export async function getFrames(): Promise<FrameInfo[]> {
  try {
    const response = await axios.get("http://localhost:8080/json")
    const json: FrameInfo[] = await response.data
    return json
  } catch (error) {
    throw new Error("Could not get frames")
  }
}

export async function getFrameInfo(frame: Frame): Promise<FrameInfo> {
  try {
    const pages = await getFrames()
    const page = pages.find((p) => p.title === frame)
    if (!page) {
      throw new Error(`Page not found`)
    }
    return page
  } catch (error) {
    throw new Error("Could not get frame info")
  }
}
