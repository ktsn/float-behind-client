/* node: true */
'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: ['./app/main.js'],
  output: {
    filename: '.tmp/main.js'
  },
  resolve: {
    root: ['bower_components'],
    extensions: ['', '.js']
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['main'])
    )
  ],
  module: {
    loaders: [
      {test: /\.html$/, loader: 'html-loader'},
      {test: /\.scss$/, loader: 'style!css!postcss!sass'},
      {test: /\.js$/, loader: 'babel-loader'}
    ]
  },
  postcss: function() {
    return [autoprefixer];
  }
};
