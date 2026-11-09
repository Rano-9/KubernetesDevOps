const http = require("http")
const { error } = require("node:console")
const fs = require("node:fs/promises")

const port = Number(process.env.PORT) || 3000
const log_path = process.env.LOG_PATH || "./log.txt"

const readLog = async () => {
    let data = ""
    try {
        data = await fs.readFile(log_path,{encoding:"utf8"})
        console.log(data)
    } catch (err) {
        console.log(err)
    }
    if (data)
        return data
    else {
        return ""
    }
}

const server = http.createServer( async (req, res) => {
    let message = null
    if (req.url === "/") {
        console.log("Request started")
        try{
            message = (await readLog()).split("\n")
        } catch(err) { 
            console.log(err)
        }
        console.log("after split")
        console.log(message)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: message.at(-2) }))
        return
    }

    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Not logger" }))
})

server.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`)
})