import dotenv from "dotenv";

import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

import nodeResolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import serve from "rollup-plugin-serve";
import json from "rollup-plugin-json";
import livereload from "rollup-plugin-livereload";

dotenv.config();

const production = process.env.NODE_ENV === "production";

const missingEnvironmentVariables = [
  "NODE_ENV",
  "API_BASE_URL",
  "API_TOKEN",
  process.env.NODE_ENV === "development" && "FRONTEND_DEV_PORT"
]
  .filter(id => id)
  .filter(environmentVariable => !(environmentVariable in process.env));

if (missingEnvironmentVariables.length) {
  missingEnvironmentVariables.forEach(missingEnv =>
    console.error(`Missing environment variable: ${missingEnv}`)
  );

  process.exit(1);
}

export default {
  input: "src/index.js",
  output: {
    name: "bonsai_assessment",
    file: "public/bundle.js",
    indent: false,
    format: "iife",
    sourcemap: !production,
    globals: {
      window: "window"
    }
  },
  plugins: [
    json(),
    postcss({
      extract: "public/style.css",
      modules: true,
      plugins: [autoprefixer()]
    }),
    nodeResolve({ browser: true }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_BASE_URL": JSON.stringify(process.env.API_BASE_URL),
      "process.env.API_TOKEN": JSON.stringify(process.env.API_TOKEN)
    }),
    commonjs({
      include: "node_modules/**"
    }),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false
          }
        ]
      ]
    }),
    production && uglify(),
    !production &&
      serve({
        verbose: false,
        contentBase: ["public"],
        historyApiFallback: true,
        host: "localhost",
        port: process.env.FRONTEND_DEV_PORT
      }),
    !production && livereload({ watch: "public" })
  ]
};
