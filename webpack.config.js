const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { normalize, join, resolve } = require('path');

const ROOT = normalize(join(__dirname));

const PATHS = Object.freeze({
  ROOT,
  SRC          : join(ROOT, 'src'),
  PUBLIC       : join(ROOT, 'public'),
  NODE_MODULES : join(ROOT, 'node_modules'),
});

module.exports = {

  // Target
  target : 'web',

  // Dev Tool
  devtool : 'source-map',

  // Resolve
  resolve : {

    // modules directories
    modules : [
      PATHS.SRC,
      PATHS.NODE_MODULES,
    ],

    // extensions
    extensions : [ '*', '.js', '.mjs', '.json', 'css' ],

    // alias
    alias : {
      // src path for clean imports
      app : PATHS.SRC,
    },
  },

  // entries
  entry : {
    // main entry
    main : [
      resolve(PATHS.SRC, 'index'),
    ],
  },

  // output
  output : {
    path     : PATHS.PUBLIC,
    // pathinfo : true,
    filename : 'main.js',
  },

  // module configs
  module : {

    rules : [
      // pre enforce eslint-loader
      {
        test    : /\.(js|mjs)$/,
        include : PATHS.SRC,
        enforce : 'pre',
        use     : [
          {
            loader : require.resolve('eslint-loader'),
          },
        ],
      },
      {
        oneOf : [
          // images
          {
            test   : [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
            loader : require.resolve('url-loader'),
          },

          // js
          {
            test    : /\.js$/,
            exclude : /node_modules/,
            loader  : 'babel-loader',
            options : {
              cacheDirectory : true,
            },
          },

          // css in src dir
          {
            test    : /\.css$/,
            include : PATHS.SRC,
            exclude : PATHS.NODE_MODULES,
            use     : [
              require.resolve('style-loader'),
              {
                loader  : require.resolve('css-loader'),
                options : {
                  modules   : true,
                  sourceMap : true,
                },
              },
              {
                loader  : require.resolve('postcss-loader'),
                options : {
                  config : {
                    path : resolve(__dirname, './postcss.config.js'),
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
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            exclude : [ /\.(js|jsx|mjs)$/, /\.html$/, /\.json$/ ],
            loader  : require.resolve('file-loader'),
          },
        ],
      },
    ],
  },
  plugins : [

    // webpack build progress
    new webpack.ProgressPlugin(),

    // html webpack
    new HtmlPlugin({
      template : 'src/index.html',
      inject   : true,
    }),

    // hmr
    new webpack.HotModuleReplacementPlugin(),
  ],
};
