const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");
const buildPath = path.resolve(__dirname, "dist");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: {
    browser: "./src/public/browser/browser.js",
    panel: "./src/public/panel/panel.js",
  },
  output: {
    filename: "[name].js",
    path: buildPath,
    chunkFilename: "[name].[contenthash:8].js",
    clean: true, // Clean dist folder before each build
  },
  performance: {
    hints: false, // Disable performance hints for large chunks
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate SQL.js library
        sqljs: {
          test: /[\\/]src[\\/]lib[\\/]sql-asm\.js$/,
          name: 'sql-library',
          priority: 20,
        },
        // Bible database chunks (already handled by dynamic imports)
        bibles: {
          test: /[\\/]src[\\/]db[\\/].*\.sqlite$/,
          name: (module) => {
            const match = module.resource.match(/[\\/]([^[\\/]+)\.sqlite$/);
            return match ? `bible-${match[1].toLowerCase()}` : 'bible-chunk';
          },
          priority: 10,
        },
        // Exclude vendors chunk - inline everything
        default: false,
        defaultVendors: false,
      },
    },
    runtimeChunk: 'single', // Separate runtime code
    moduleIds: 'deterministic', // Better for long-term caching
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.sqlite$/i,
        use: "arraybuffer-loader",
      },
      {
        test: /strings\.json$/,
        use: ["webpack-json-access-optimizer"],
        type: "json",
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
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: "88", // OBS Browser uses Chromium
                  },
                  modules: false, // Let webpack handle modules
                },
              ],
            ],
            cacheDirectory: true, // Cache babel compilations
          },
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      title: "Browser source",
      template: "./src/public/browser/index.html",
      filename: "./browser.html",
      chunks: ["browser", "runtime"],
      inject: true,
      minify: process.env.NODE_ENV === "production" ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      } : false,
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: "Control panel",
      template: "./src/public/panel/index.html",
      filename: "./panel.html",
      chunks: ["panel", "runtime"],
      inject: true,
      minify: process.env.NODE_ENV === "production" ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      } : false,
    }),
  ],
  devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",
  devServer: {
    static: {
      directory: buildPath,
    },
    compress: true,
    hot: true,
    port: 8080,
  },
  stats: {
    colors: true,
    chunks: true,
    chunkModules: false,
    modules: false,
    children: false,
  },
};
