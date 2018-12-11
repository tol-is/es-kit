module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [
    'react',
    'import',
    'jsx-a11y',
  ],
  rules: {
    'key-spacing': [
      'warn',
      {
        singleLine: {
          beforeColon: true,
          afterColon: true,
        },
        multiLine: {
          beforeColon: true,
          afterColon: true,
          align: 'colon',
        },
      },
    ],
    'no-nested-ternary': 0,
    'react/jsx-filename-extension': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          './node_modules',
        ],
      },
      webpack: {
        config: './config/webpack.config.development.js',
      },
    },
  },
};
