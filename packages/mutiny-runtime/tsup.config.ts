import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["lib/index.ts", "lib/cli/index.ts"],
  format: ["cjs", "esm"],
})
