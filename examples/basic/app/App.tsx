import { useEffect, useState } from "react"

const App = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch("http://127.0.0.1:3325/os-info")
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
      <code
        style={{
          whiteSpace: "pre-wrap",
          fontSize: 12,
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
