const chalk = require('chalk');
const http = require('http');
const handler = require('serve-handler');

const PATHS = require('../config/paths');

const port = 3000;

/**  */
const server = http.createServer((request, response) => handler(request, response, {
  public        : PATHS.PUBLIC,
  trailingSlash : false,
}));


server.listen(port, () => {
  console.log(chalk.bold.green(`Server Running at http://localhost:${port}`));
});
