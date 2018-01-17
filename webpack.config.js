const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const extractSass = new extractTextWebpackPlugin({
  filename: 'style.css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.sass$/,
        use: extractSass.extract({
          use: [
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
          ],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'src/index.pug'
    }),
    new cleanWebpackPlugin(['docs']),
    extractSass,
    new uglifyjsWebpackPlugin({
      test: /\.js$/
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs')
  }
}