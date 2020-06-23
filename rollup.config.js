import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "lib/index.js",
  output: {
    file: "dist/omnidiff.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve({
      jsnext: true,
      browser: true,
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    terser(),
  ],
};
