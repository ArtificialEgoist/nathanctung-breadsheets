module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react']
        }
      }
    ]
  },
  entry: ['./src/App.jsx'],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  }
};