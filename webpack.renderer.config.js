const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const assets = [ 'static' ];
const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    'file-loader',
  ],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: assets.map(asset => {
    return new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src', asset),
        to: path.resolve(__dirname, '.webpack/main', asset)
      }
    ]);
  })
};
