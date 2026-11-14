import http from "node:http"
import { writeFile } from "node:fs/promises"
import { readLog, type LogEntry } from "./service.js";

const port = Number(process.env.PORT) || 3001
const logPath = process.env.LOG_PATH || "./log.json"

let counter = 0

const updateCounter = (currentCounter: LogEntry) => {
    const count = {...currentCounter, pongs : (currentCounter.pongs! + 1) } 
    return count
}

const server = http.createServer( async (req, res) => {
  if (req.url === "/pingpong") {
    const data = await readLog()

    const counter = updateCounter(data)
    
    await writeFile(logPath, JSON.stringify(counter), "utf-8")

    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: `Pong ${counter.pongs}` }))
    return
  }

  res.writeHead(404, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ error: "Not Found" }))
})

server.listen(port, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${port}`)
})
