import { useEffect, useState } from "react"

const { HOST, PORT } = process.env

const App = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch(`http://${HOST}:${PORT}/os-info`)
      .then((res) => res.json())
      .then((data) => setData(data))

    return () => {}
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
      <h1>With Server Example</h1>
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
