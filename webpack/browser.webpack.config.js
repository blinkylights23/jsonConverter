import path from 'path'
import webpack from 'webpack'

export default {
  entry: path.join(__dirname, '../src/index.js'),
  target: 'web',
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '../dist'),
    filename: 'jsonconverter.browser.js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: [/node_modules/, /test/],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'local',
      DEBUG: false
    })
  ],
  stats: {
    colors: true
  }
}
