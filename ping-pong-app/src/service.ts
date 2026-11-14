import { readFile, writeFile } from "node:fs/promises"

export type LogEntry = {
  timestamp: string[]
  pongs?: number
}

const logPath = process.env.LOG_PATH || "./log.json"

export const readLog = async (): Promise<LogEntry> => {
  try {
    const rawData = await readFile(logPath, "utf8")
    const parsedData = JSON.parse(rawData) as Partial<LogEntry>
    console.log(parsedData)
    return {...parsedData,
      timestamp: Array.isArray(parsedData.timestamp)
        ? parsedData.timestamp.filter((entry): entry is string => typeof entry === "string")
        : [],
    }
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException

    if (nodeError.code === "ENOENT") {
      const defaultLog: LogEntry = { timestamp: [] , pongs: 0}
      await writeFile(logPath, JSON.stringify(defaultLog), "utf-8")
      return defaultLog
    }

    console.log(error)
    return { timestamp: [] }
  }
}
