import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"

export default [
  {
    input: "src/app/index.ts",
    plugins: [
      replace({
        preventAssignment: false,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      commonjs(),
      nodeResolve(),
      typescript(),
      json(),
    ],
    context: "window",
    external: ["react", "react-dom"],
    output: {
      name: "app",
      file: ".mutiny/app/index.js",
      globals: {
        react: "SP_REACT",
        "react-dom": "SP_REACTDOM",
      },
      format: "iife",
      exports: "default",
    },
  },
  {
    input: "src/server/index.ts",
    plugins: [commonjs(), nodeResolve(), typescript(), json()],
    output: {
      name: "server",
      file: ".mutiny/server/index.js",
      format: "cjs",
      exports: "default",
    },
  },
]
