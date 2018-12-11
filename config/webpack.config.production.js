const { resolve } = require('path');

const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = require('./paths');
const envVars = require('../env.json').production;

const env = {
  ...envVars,
  NODE_ENV: 'production',
};

module.exports = {
  // Target
  mode: 'production',

  // Target
  target: 'web',

  // Dev Tool
  devtool: 'source-map',

  // Resolve
  resolve: {
    // modules directories
    modules: [PATHS.SRC, PATHS.NODE_MODULES],

    // extensions
    extensions: ['*', '.js', 'jsx', '.mjs', '.json', 'css'],

    // alias
    alias: {
      // src path for clean imports
      app: PATHS.SRC,
    },
  },

  // entries
  entry: {
    index: [resolve(PATHS.SRC, 'index')],
  },

  // output
  output: {
    path: PATHS.PUBLIC,
    publicPath: envVars.publicPath,
    filename: '[name].[hash:8].js',
    chunkFilename: 'static/js/[name].[hash:8].js',
    sourceMapFilename: '[file].map',
  },

  // module configs
  module: {
    rules: [
      // pre enforce eslint-loader
      {
        test: /\.(js)$/,
        include: PATHS.SRC,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('eslint-loader'),
          },
        ],
      },
      {
        oneOf: [
          // js
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },

          // css in src dir
          {
            test: /\.css$/,
            include: PATHS.SRC,
            exclude: PATHS.NODE_MODULES,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: true,
                  sourceMap: false,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  config: {
                    path: resolve(PATHS.ROOT, 'config/postcss.config.js'),
                  },
                },
              },
            ],
          },

          // npm css imports
          {
            test: /\.css$/,
            include: PATHS.NODE_MODULES,
            exclude: PATHS.SRC,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: false,
                },
              },
            ],
          },

          // images
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 1000,
            },
          },

          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            exclude: [/\.(js)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanPlugin([PATHS.PUBLIC], {
      root: process.cwd(),
      verbose: false,
      dry: false,
    }),
    new webpack.DefinePlugin(env),

    new webpack.ProgressPlugin(),

    new CopyWebpackPlugin([{ from: PATHS.STATIC, to: 'static' }]),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'static/css/[id].css',
    }),

    new HtmlPlugin({
      inject: true,
      template: './src/index.html',
      filename: './index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    new ScriptExtHtmlPlugin({
      defaultAttribute: 'async',
    }),

    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/yearinreview/2018/',
    }),

    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({}),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
    ],

    // runtimeChunk : true,
  },
};
