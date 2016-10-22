module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  entry: {
    javascript: __dirname + '/src/react/App.jsx',
    html: __dirname + '/src/popup.html'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  }
};