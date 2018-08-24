const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'js-cookie',
      'vue',
      'vue-router',
      // 'babel-polyfill',
      'axios',
      'vuex',
      'element-ui'
    ]
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
