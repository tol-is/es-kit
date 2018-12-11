const { normalize, join } = require('path');

const ROOT = normalize(join(__dirname, '../'));

const PATHS = Object.freeze({
  ROOT,
  SRC          : join(ROOT, 'src'),
  PUBLIC       : join(ROOT, 'public'),
  STATIC       : join(ROOT, 'src', 'static'),
  NODE_MODULES : join(ROOT, 'node_modules'),
});

module.exports = PATHS;
