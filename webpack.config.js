/* eslint-env node */
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const env = require('dotenv').config();
const envDefinitions = {};

Object.keys(env).forEach(key => {
  envDefinitions[`process.env.${key}`] = JSON.stringify(env[key]);
});

module.exports = {
  context: path.resolve(__dirname, 'app'),
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, '.tmp'),
    filename: './main.js'
  },
  resolve: {
    moduleDirectories: ['bower_components', 'node_modules'],
    extensions: ['', '.js']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.html$/, loader: 'html-loader?attrs=false'},
      {test: /\.scss$/, loader: 'style!css!postcss!sass'},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
    ]
  },
  postcss: function() {
    return [autoprefixer];
  },
  externals: {
    'google-analytics': 'var window.ga'
  },
  plugins: [
    new webpack.DefinePlugin(envDefinitions)
  ]
};
