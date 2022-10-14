import http from "http"

const { PORT } = process.env
// Allow cors
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")

  if (req.url === "/ping") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "pong" }))
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
