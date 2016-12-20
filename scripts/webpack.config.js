/* eslint-env node */
const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')

const resolve = _path => path.resolve(__dirname, '../', _path)

const env = require('dotenv').config({ path: resolve('.env') })
const envDefinitions = {}

Object.keys(env).forEach(key => {
  envDefinitions[`process.env.${key}`] = JSON.stringify(env[key])
})

module.exports = {
  context: resolve('app'),
  entry: './main.js',
  output: {
    path: resolve('.tmp'),
    filename: './main.js'
  },
  resolve: {
    moduleDirectories: ['bower_components', 'node_modules'],
    extensions: ['', '.js']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.html$/, loader: 'html-loader?attrs=false' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  postcss() {
    return [autoprefixer]
  },
  externals: {
    'google-analytics': 'var window.ga'
  },
  plugins: [
    new webpack.DefinePlugin(envDefinitions)
  ]
}
