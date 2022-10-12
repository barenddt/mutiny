import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["lib/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  clean: true,
})
