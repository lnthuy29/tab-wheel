const prettierPlugin = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');
const stylisticPlugin = require('@stylistic/eslint-plugin');

module.exports = [
  {
    files: ['*.ts'],
    plugins: {
      prettier: prettierPlugin,
      '@stylistic': stylisticPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
      ],
    },
  },
  {
    rules: {
      ...eslintConfigPrettier,
    },
  },
];
