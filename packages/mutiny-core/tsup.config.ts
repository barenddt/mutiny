import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["lib/index.ts", "lib/cli.ts"],
  format: ["cjs", "esm"],
  clean: true,
})
