import { readFile, writeFile } from "node:fs/promises"

export type LogEntry = {
  timestamp?: string[]
  pongs?: number
}

const logPath = process.env.LOG_PATH || "./log.json"

export const readLog = async (): Promise<LogEntry> => {
  try {
    const rawData = await readFile(logPath, "utf8")
    const parsedData = JSON.parse(rawData) as Partial<LogEntry>

    return {
      pongs: parsedData.pongs ? parsedData.pongs : 0
    }
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException

    if (nodeError.code === "ENOENT") {
      const defaultLog: LogEntry = { pongs: 0 }
      await writeFile(logPath, JSON.stringify(defaultLog), "utf-8")
      return defaultLog
    }

    console.log(error)
    return { timestamp: [], pongs : 0 }
  }
}
