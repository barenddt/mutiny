import { defineConfig } from "tsup"
import globals from "esbuild-plugin-globals"

export default defineConfig({
  entry: ["lib/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  external: ["react", "react-dom"],
})
