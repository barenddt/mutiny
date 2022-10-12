import Mutiny from "@mutiny/react"

const App = () => {
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
      <h1>Example App</h1>
    </div>
  )
}

Mutiny.createRoute({
  path: "/mutiny",
  render: <App />,
})
