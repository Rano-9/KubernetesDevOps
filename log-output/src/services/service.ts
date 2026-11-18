import { readFile, writeFile } from "node:fs/promises"
import { api } from "./apiClient.js"

export type PongEntry = {
  pongs?: number
}

const pongPath = process.env.PONG_PATH || ""

export const readPong = async (): Promise<PongEntry> => {
  try {
    const pongResponse = await api.get<PongEntry>(pongPath)
    const data = pongResponse

    console.log(data)
    return data
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException

    console.log(error)
    return { pongs: 0 }
  }
}
