const App = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h2>{process.env.TEST}</h2>
    <img src="https://media.tenor.com/VFFJ8Ei3C2IAAAAM/rickroll-rick.gif" alt="Rick Astley" />
  </div>
)

export default App
