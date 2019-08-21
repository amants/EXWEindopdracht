/* eslint-disable */

const { resolve } = require(`path`);
const webpack = require(`webpack`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const loaders = require('./webpack/prod.loaders');

const config = {
  stats: {
    maxModules: 0,
  },

  mode: `production`,
  devtool: `source-map`,

  entry: [`core-js`, `./js/main.js`, `./assets/scss/main.scss`],

  context: resolve(__dirname, `src`),

  output: {
    filename: `[name].[chunkhash].js`,
    chunkFilename: `[name].[chunkhash].js`,
    path: resolve(__dirname, `dist`),
    publicPath: ``,
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: `index.html`,
      inject: `body`,
      minify: true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(`production`),
        BABEL_ENV: JSON.stringify(`production`),
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
  ],

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },

  resolve: {
    extensions: [`.js`, `.jsx`],
  },

  module: {
    rules: [
      loaders.BabelLoader,
      loaders.ImageLoader,
      loaders.SVGLoader,
      loaders.OTFLoader,
      loaders.WOFFLoader,
      loaders.EOTLoader,
      loaders.StyleLoader,
    ],
  },
};

module.exports = config;
