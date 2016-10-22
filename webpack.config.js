var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?presets[]=es2015,presets[]=react'],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  entry: [
    __dirname + '/src/react/App.jsx',
    __dirname + '/src/popup.html'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  }
};