import http from "http"
import os from "os"

const { PORT, HOST } = process.env

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")

  if (req.url === "/os-info") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        type: os.type(),
        arch: os.arch(),
        release: os.release(),
        platform: os.platform(),
      })
    )
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://${HOST}:${PORT}`)
})
