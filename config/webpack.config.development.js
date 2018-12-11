const { resolve } = require('path');

const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = require('./paths');

const env = {
  NODE_ENV : 'development',
};

module.exports = {
  // Target
  mode : 'development',

  // Target
  target : 'web',

  // Dev Tool
  devtool : 'source-map',

  // Resolve
  resolve : {
    // modules directories
    modules : [PATHS.SRC, PATHS.NODE_MODULES],

    // extensions
    extensions : ['*', '.js', 'jsx', '.mjs', '.json', 'css'],

    // alias
    alias : {
      // src path for clean imports
      app : PATHS.SRC,
    },
  },

  // entries
  entry : {
    app : [
      resolve(PATHS.SRC, 'index'),
      'webpack-dev-server/client?http://localhost:8080',
    ],
  },

  // output
  output : {
    path              : PATHS.PUBLIC,
    publicPath        : '/',
    filename          : '[name].js',
    chunkFilename     : 'static/js/[name].chunk.js',
    sourceMapFilename : '[file].map',
  },

  // module configs
  module : {
    rules : [
      // pre enforce eslint-loader
      {
        test    : /\.(js|mjs|jsx)$/,
        include : PATHS.SRC,
        enforce : 'pre',
        use     : [
          {
            loader  : require.resolve('eslint-loader'),
            options : {
              fix : true,
            },
          },
        ],
      },
      {
        oneOf : [
          // js
          {
            test    : /\.(js|jsx)$/,
            exclude : /node_modules/,
            loader  : 'babel-loader',
            options : {
              cacheDirectory : true,
            },
          },

          // css in src dir
          {
            test    : [/\.?css$/, /\.scss$/],
            include : PATHS.SRC,
            exclude : PATHS.NODE_MODULES,
            use     : [
              require.resolve('style-loader'),
              {
                loader  : require.resolve('css-loader'),
                options : {
                  importLoaders  : 1,
                  localIdentName : '[name]__[local]___[hash:base64:5]',
                  modules        : true,
                  sourceMap      : true,
                },
              },
              {
                loader  : require.resolve('postcss-loader'),
                options : {
                  config : {
                    path : resolve(PATHS.ROOT, 'config/postcss.config.js'),
                  },
                },
              },
            ],
          },

          // npm css imports
          {
            test    : /\.css$/,
            include : PATHS.NODE_MODULES,
            exclude : PATHS.SRC,
            use     : [
              require.resolve('style-loader'),
              {
                loader  : require.resolve('css-loader'),
                options : {
                  modules : false,
                },
              },
            ],
          },

          // static images
          // {
          //   test: /\.(html)$/,
          //   use: {
          //     loader: 'html-loader',
          //     options: {
          //       attrs: [ ':data-src' ]
          //     }
          //   }
          // },

          // images
          {
            test    : [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader  : require.resolve('url-loader'),
            options : {
              limit : 1000,
            },
          },

          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            exclude : [/\.(js|mjs)$/, /\.html$/, /\.json$/],
            loader  : require.resolve('file-loader'),
          },
        ],
      },
    ],
  },

  plugins : [
    new CleanPlugin([PATHS.PUBLIC], {
      root    : process.cwd(),
      verbose : false,
      dry     : false,
    }),

    new webpack.DefinePlugin(env),

    new HtmlPlugin({
      inject   : true,
      template : './src/index.html',
      filename : './index.html',
    }),

    new CopyWebpackPlugin([
      { from : PATHS.STATIC, }
    ]),

    // hmr
    // new webpack.HotModuleReplacementPlugin(),
  ],

  performance : {
    hints : false,
  },

  devServer : {
    quiet : true,
  },
};
