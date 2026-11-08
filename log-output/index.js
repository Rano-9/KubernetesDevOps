const http = require("http")

const randomString = Math.random().toString(36).slice(3)
const port = Number(process.env.PORT) || 3000

const timerRun = () => {
    const now = new Date()
    const format = [String(now.getDate()).padStart(2,"0"),String(now.getMonth()).padStart(2,"0"),String(now.getFullYear()).slice(-2)].join("-")
    const time = [String(now.getHours()), String(now.getMinutes()), String(now.getSeconds())].join(":")
    console.log(format + " " + time +  " " + randomString )
    return (format + " " + time +  " " + randomString )
}
timerRun()

const server = http.createServer((req, res) => {

    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: timerRun() }))
        return
    }

    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Not logger" }))
})

server.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`)
})