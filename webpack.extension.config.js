const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './chrome-extension/popup.ts',
    content: './chrome-extension/content.ts',
    background: './chrome-extension/background.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'extension-dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'chrome-extension/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'chrome-extension/manifest.json', to: 'manifest.json' },
        { from: 'chrome-extension/assets', to: 'assets', noErrorOnMissing: true },
        { from: 'chrome-extension/content.css', to: 'content.css' }
      ]
    })
  ],
  optimization: {
    // Don't minimize for easier debugging
    minimize: false
  }
};