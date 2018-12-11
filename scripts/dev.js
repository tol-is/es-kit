require('minilog').enable();
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const log = require('minilog')('app');

const webpackHookDone = require('./lib/webpack-hook-done');
const webpackConfig = require('../config/webpack.config.development');

const port = 8080;

log.info('Starting Dev Server');

const compiler = webpack(webpackConfig);
compiler.hooks.done.tap('done', webpackHookDone);

const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);
devServer.listen(port, 'localhost', (err) => {
  if (err) {
    return log.error(err);
  }
  log.info(chalk.green(`Webpack Dev Server listening at http://localhost:${port}`));
});

['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    devServer.close();
    process.exit();
  });
});
