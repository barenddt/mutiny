import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import { useEffect, useState } from "react"

import type { AppRouter } from "../server"

const { HOST, PORT } = process.env

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://${HOST}:${PORT}/trpc`,
    }),
  ],
})

const App = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    trpc.osInfo.query().then((data) => setData(data))
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <h1>TRPC Example</h1>
      <code
        style={{
          whiteSpace: "pre-wrap",
          padding: 5,
          backgroundColor: "black",
          borderRadius: 5,
        }}
      >
        {JSON.stringify(data, null, 2)}
      </code>
    </div>
  )
}

export default App
