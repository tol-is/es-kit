const path = require('path');
const pcssimport = require('postcss-import');
const responsivetype = require('postcss-responsive-type');
const pcsspresetenv = require('postcss-preset-env');
const pcssreporter = require('postcss-reporter');

const root = path.resolve(__dirname, '../');
const src = path.resolve(root, 'src');

module.exports = {
  plugins : [
    pcssimport({
      root,
      path : [
        src,
      ],
    }),
    responsivetype(),
    pcsspresetenv({
      stage    : 1,
      features : {
        'nesting-rules' : true,
      },
      browsers : [
        '>1%',
        'last 4 versions',
      ],
    }),
    pcssreporter({
      clearMessages : true,
      throwError    : true,
    }),
  ],
};
