/* jshint node: true */
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
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['main'])
    )
  ],
  cache: true,
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.html$/, loader: 'html-loader?attrs=false'},
      {test: /\.scss$/, loader: 'style!css!postcss!sass?sourceMap'},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
    ]
  },
  postcss: function() {
    return [autoprefixer];
  }
};
