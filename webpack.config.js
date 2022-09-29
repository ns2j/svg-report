const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  const plugins = [
    new MiniCssExtractPlugin({
      filename: `[name]${isProd ? '.min' : ''}.css`
    }),
  ]

  return {
    entry: {
      'svg-report': [
        './scss/svg-report.scss', // before js
        './js/src/svg-report.js',
      ],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: `[name]${isProd ? '.min' : ''}.js`,
      library: 'SvgReport',
      libraryTarget: 'umd',
      libraryExport: 'SvgReport',
    },
    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'autoprefixer',
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: plugins,
    devtool: 'inline-source-map',
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    devServer: {
      static: 'dist',
      host: '0.0.0.0',
      port: 8088,
    }
  }
}
