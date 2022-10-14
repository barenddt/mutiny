import { useEffect, useState } from "react"

const App = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch("http://127.0.0.1:3325/ping")
      .then((res) => res.json())
      .then((data) => setData(data))
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
      <h1>Basic Example</h1>
      {JSON.stringify(data)}
    </div>
  )
}

export default App
