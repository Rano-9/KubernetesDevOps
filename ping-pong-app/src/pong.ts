import http from "node:http"

const port = Number(process.env.PORT) || 3001

let count = 0

const updateCounter = (currentCounter: number) => {
    count = currentCounter + 1 
    return count
}

const server = http.createServer( async (req, res) => {
  
  if (req.url === "/pings"){
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ pongs: count}))
    return
  }
  if (req.url === "/pingpong") {
    
    const counter = updateCounter(count)
    
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: `Pong ${counter}` }))
    return
  }

  res.writeHead(404, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ error: "Not Found" }))
})

server.listen(port, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${port}`)
})
