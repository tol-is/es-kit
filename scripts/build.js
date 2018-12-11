const chalk = require('chalk');
const webpack = require('webpack');

const PATHS = require('../config/paths');
const webpackConfig = require('../config/webpack.config.production');

console.log('\n\r-------------------');
console.log(chalk.cyan('\n\Bundling production assets'));

const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  if (err) {
    console.log(chalk.bold.red(err));
  }

  console.log(chalk.bold.green('Production bundle ready'));
});
