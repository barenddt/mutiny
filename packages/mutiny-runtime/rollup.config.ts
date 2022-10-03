import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import shabang from "rollup-plugin-preserve-shebang";

const bundle = (config) => ({
  ...config,
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    input: "lib/index.ts",
    plugins: [esbuild()],
    output: [
      {
        file: `dist/index.js`,
        format: "cjs",
        sourcemap: false,
      },
      {
        file: `dist/index.mjs`,
        format: "es",
        sourcemap: false,
      },
    ],
  }),
  bundle({
    input: "lib/index.ts",
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  }),
  bundle({
    input: "lib/cli.ts",
    plugins: [esbuild(), shabang()],
    output: [
      {
        file: `dist/cli.js`,
        format: "cjs",
        sourcemap: false,
      },
      {
        file: `dist/cli.mjs`,
        format: "es",
        sourcemap: false,
      },
    ],
  }),
  bundle({
    input: "lib/cli.ts",
    plugins: [dts(), shabang()],
    output: {
      file: `dist/cli.d.ts`,
      format: "es",
    },
  }),
];
