/* eslint-disable */

const { resolve } = require('path');
const webpack = require('webpack');

const loaders = require('./webpack/dev.loaders');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './js/main.js',
    './assets/scss/main.scss',
  ],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },

  context: resolve(__dirname, 'src'),

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'build'),
    historyApiFallback: true,
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      loaders.BabelLoader,
      loaders.StyleLoader,
      loaders.ImageLoader,
      loaders.SVGLoader,
      loaders.OTFLoader,
      loaders.WOFFLoader,
      loaders.EOTLoader,
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.jsx?$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false,
          fix: true,
        },
      },
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: './src/assets/scss/*.scss',
      syntax: 'scss',
      failOnError: false,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      allChunks: true,
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(`development`),
        BABEL_ENV: JSON.stringify(`development`),
      },
    }),
  ],
};

module.exports = config;
