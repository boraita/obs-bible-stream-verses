const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");
const buildPath = path.resolve(__dirname, "dist/src");
module.exports = {
  mode: "none",
  entry: {
    browser: "./src/public/browser/browser.js",
    panel: "./src/public/panel/panel.js",
  },
  output: {
    filename: "[name].js",
    path: buildPath,
  },
  devServer: {
    contentBase: path.join(__dirname, "dist/src"),
  },
  module: {
    rules: [
      {
        test: /\.sqlite$/i,
        use: 'arraybuffer-loader',
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "Browser source",
      template: "./src/public/browser/index.html",
      filename: "./browser.html", //relative to root of the application
      chunks: ["browser"],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: "Control panel",
      template: "./src/public/panel/index.html",
      filename: "./panel.html", //relative to root of the application
      chunks: ["panel"],
      inject: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/db", to: "src/db" },
        { from: "src/lib", to: "src/lib" },
      ],
    }),
  ],
};
