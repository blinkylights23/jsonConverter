import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'

export default {
  entry: path.join(__dirname, '../src/index.js'),
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '../dist'),
    filename: 'index.js'
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
