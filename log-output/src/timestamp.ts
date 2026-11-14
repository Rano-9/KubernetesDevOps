import { writeFile } from "node:fs/promises"
import {readLog, type LogEntry} from "./service.js"

const logPath = process.env.LOG_PATH || "./log.json"
const randomString = Math.random().toString(36).slice(3)

const timerRun = async (): Promise<void> => {
  const now = new Date()
  const format = [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getFullYear()).slice(-2),
  ].join("-")

  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join(":")

  const timestamp = `${format} ${time} ${randomString}`

  try {
    const data = await readLog()
    const nextLog: LogEntry = {...data, timestamp: [...data.timestamp, timestamp] }
    await writeFile(logPath, JSON.stringify(nextLog))
  } catch (error) {
    console.log(error)
  }

  console.log(timestamp)
  setTimeout(timerRun, 5000)
}

void timerRun()

