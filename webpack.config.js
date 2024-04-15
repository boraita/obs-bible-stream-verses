const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const buildPath = path.resolve(__dirname, 'dist/');
module.exports = {
  mode: "none",
    entry: {
        browser: './src/public/browser/browser.js',
        panel: './src/public/panel/panel.js'
  },
  output: {
    filename: '[name].js',
    path: buildPath
},
  devServer: {
    contentBase: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
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
        new HtmlWebpackPlugin(
        {
            hash: true,
            title: 'Browser source',
            template: './src/public/browser/browser.html',
            filename: './browser.html', //relative to root of the application
            chunks: ['browser'],
            inject: true
        }
    ),
    new HtmlWebpackPlugin(
        {
            hash: true,
            title: 'Control panel',
            template: './src/public/panel/panel.html',
            filename: './panel.html', //relative to root of the application
            chunks: ['panel'],
            inject: true
        }
  )],
};
