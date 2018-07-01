import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import tslint from "rollup-plugin-tslint";
import localResolve from "rollup-plugin-local-resolve";

const pkg = require("./package.json");
import path from "path";

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: "index",
      format: "umd"
    },
    { file: pkg.module, format: "es" }
  ],
  sourcemap: true,

  watch: {
    include: "src/**"
  },
  plugins: [
    localResolve(),
    
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        lodash: [
          "get",
          "set",
          "cloneDeep"
        ],
        glob: ["glob"]
      }
    }),

    typescript({ useTsconfigDeclarationDir: true }),

    sourceMaps(),
    tslint({
      exclude: [
        path.resolve("../../node_modules") + "/**",
        "node_modules/**"
      ]
    })
  ]
};
