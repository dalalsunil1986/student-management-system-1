const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: "development",
    entry: './assets/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.bundle.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          Popper: ['popper.js', 'default'],
        })
    ],
    module: {
      rules:
        [
          {
            test: /\.(s*)css$/,
            use: [{
              loader: MiniCssExtractPlugin.loader
            },'css-loader', 'sass-loader']
          }
        ]
    },
};