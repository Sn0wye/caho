const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@sn0wye/eslint-config/node'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json')
  }
};
