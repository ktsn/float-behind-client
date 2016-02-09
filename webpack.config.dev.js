const path = require('path');
const autoprefixer = require('autoprefixer');

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
