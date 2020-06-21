const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    library: "omnidiff",
    libraryTarget: "umd",
    filename: "omnidiff.min.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  devtool: "source-map",
};
