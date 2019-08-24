/* eslint-disable */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BabelLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
};

const StyleLoader = {
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
    'postcss-loader',
    'sass-loader',
  ],
};

const ImageLoader = {
  test: /\.(png|jpg|gif)$/,
  use: [
    {
     loader: 'url-loader',
      options: {
        limit: 8192,
        mimetype: 'image/png',
        name: 'images/[name].[ext]'
      }
    }
  ],
};

const SVGLoader = {
  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: `url-loader`,
      options: {
        limit: 8192,
        mimetype: `image/svg+xml`,
        name: `images/[name].[ext]`,
      },
    },
  ],
};

const EOTLoader = {
  test: /\.eot(\?v=\d+.\d+.\d+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
      },
    },
  ],
};

const WOFFLoader = {
  test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        mimetype: 'application/font-woff',
        name: 'fonts/[name].[ext]',
      },
    },
  ],
};

const OTFLoader = {
  test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        mimetype: 'application/octet-stream',
        name: 'fonts/[name].[ext]',
      },
    },
  ],
};

module.exports = {
  BabelLoader,
  StyleLoader,
  ImageLoader,
  SVGLoader,
  OTFLoader,
  WOFFLoader,
  EOTLoader,
};