import http from "http"
import os from "os"

const { PORT } = process.env

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.url === "/os-info") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        platform: os.platform(),
        release: os.release(),
        version: os.version(),
      })
    )
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
