const chalk = require('chalk');
const formatWebpackMessages = require('./format-webpack-messages');

const log = require('minilog')('webpack');

module.exports = (stats) => {
  const messages = formatWebpackMessages(
    stats.toJson({ all : false, warnings : true, errors : true }),
  );

  const isSuccessful = !messages.errors.length && !messages.warnings.length;
  if (isSuccessful) {
    log(chalk.green('Compiled successfully!'));
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    log.error(chalk.red('Failed to compile.\n'));
    log.error(messages.errors.join('\n\n'));
    return;
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    log.warn(chalk.yellow('Compiled with warnings.\n'));
    log.warn(messages.warnings.join('\n\n'));

    // Teach some ESLint tricks.
    log.debug(
      `\nSearch for the ${chalk.underline(
        chalk.yellow('keywords'),
      )} to learn more about each warning.`,
    );
    log.info(
      `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`,
    );
  }
};
