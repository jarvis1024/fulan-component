const tslintRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended');

module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'airbnb',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'jest-enzyme',
  ],
  plugins: ['@typescript-eslint', 'babel', 'jest', 'react', 'react-hooks', 'prettier'],
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: Object.keys(tslintRecommended.rules).reduce(
        (rules, key) => {
          if (tslintRecommended.rules[key] !== 'off') {
            rules[key] = 'off';
          }
          return rules;
        },
        {
          indent: ['error', 2],
          camelcase: ['error', { ignoreDestructuring: true }],
          'no-unused-vars': 'error',
        },
      ),
    },
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'import/no-unresolved': false,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/order': [
      'error',
      {
        groups: [['index', 'sibling', 'parent', 'internal', 'external', 'builtin']],
        'newlines-between': 'never',
      },
    ],
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/no-danger': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'off',
    'react/no-multi-comp': 'off',
    'react/require-default-props': 'off',
    'react/sort-prop-types': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
