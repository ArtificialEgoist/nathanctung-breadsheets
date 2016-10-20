module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [
          __dirname + '/src'
        ],
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  entry: [
    'babel-polyfill',
    './src/react/App.jsx'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  }
};