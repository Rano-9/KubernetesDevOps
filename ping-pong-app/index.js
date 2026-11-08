const http = require("http")
const port = Number(process.env.PORT) || 3001

var counter = 0
const updateCounter = (counter) => {
    counter += 1
    return counter
}

const server = http.createServer((req, res) => {

    if (req.url === "/pingpong") {
        counter = updateCounter(counter)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: "Ping recieved", counter:counter }))
        return
    }
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Not Found" }))
})

server.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`)
})