import http from "node:http"
import { readFileSync } from "node:fs"
import { readPong} from "./services/service.js"
import { timerRun, latestTimestamp } from "./timestamp.js"

const port = Number(process.env.PORT) || 3000
const message_path = String(process.env.CONFIG_PATH) || ""

const message = readFileSync(message_path,'utf8')
const env = String(process.env.MESSAGE)

timerRun()

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    console.log("Request started")
    try {
      const pongs = await readPong()
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify({"file content": message,env:"MESSAGE="+env, timeStamp: latestTimestamp, pongs: pongs.pongs}))
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
