import http from "http"

const { PORT } = process.env

const server = http.createServer((req, res) => {
  if (req.url === "/ping") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "pong" }))
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
