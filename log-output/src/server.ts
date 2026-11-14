import http from "node:http"
import { readLog, type LogEntry} from "./service.js"

const port = Number(process.env.PORT) || 3000

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    console.log("Request started")

    try {
      const log = await readLog()
      const latestMessage = log.timestamp[log.timestamp.length - 1] ?? null

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ message: latestMessage }))
      return
    } catch (error) {
      console.log(error)
      res.writeHead(500, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: "Unable to read log" }))
      return
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ error: "Not logger" }))
})

server.listen(port, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${port}`)
})
