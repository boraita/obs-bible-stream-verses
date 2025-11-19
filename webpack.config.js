const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    browser: './src/public/browser/browser.ts',
    panel: './src/public/panel/panel.ts',
  },
  output: {
    filename: '[name].js',
    path: buildPath,
    chunkFilename: '[name].[contenthash:8].js',
    clean: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        sqljs: {
          test: /[\\/]src[\\/]lib[\\/]sql-asm\.js$/,
          name: 'sql-library',
          priority: 20,
        },

        bibles: {
          test: /[\\/]src[\\/]db[\\/].*\.sqlite$/,
          name: (module) => {
            const match = module.resource.match(/[\\/]([^[\\/]+)\.sqlite$/);
            return match ? `bible-${match[1].toLowerCase()}` : 'bible-chunk';
          },
          priority: 10,
        },

        default: false,
        defaultVendors: false,
      },
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
    extensions: ['.js', '.ts', '.json', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.sqlite$/i,
        use: 'arraybuffer-loader',
      },
      {
        test: /strings\.json$/,
        use: ['webpack-json-access-optimizer'],
        type: 'json',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: '88',
                  },
                  modules: false,
                },
              ],
            ],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Browser source',
      template: './src/public/browser/index.html',
      filename: './browser.html',
      chunks: ['browser', 'runtime'],
      inject: true,
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
            }
          : false,
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Control panel',
      template: './src/public/panel/index.html',
      filename: './panel.html',
      chunks: ['panel', 'runtime'],
      inject: true,
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
            }
          : false,
    }),
  ],
  devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
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
