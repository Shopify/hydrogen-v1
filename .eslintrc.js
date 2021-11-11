// @ts-check

module.exports = {
  ignorePatterns: ['**/graphql/types/types.ts'],
  root: true,
  plugins: ['eslint-plugin-tsdoc'],
  extends: [
    'plugin:node/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    'tsdoc/syntax': 'warn',
    'no-debugger': ['error'],
    'node/no-missing-import': [
      'error',
      {
        allowModules: ['types', 'testUtils', '@shopify/hydrogen'],
        tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts'],
      },
    ],
    'node/no-missing-require': [
      'error',
      {
        tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts'],
      },
    ],
    'node/no-extraneous-import': [
      'error',
      {
        allowModules: [
          '@shopify/hydrogen',
          '@testing-library/react',
          '@testing-library/user-event',
          '@shopify/react-testing',
        ],
      },
    ],
    'node/no-extraneous-require': [
      'error',
      {
        allowModules: ['@shopify/hydrogen'],
      },
    ],
    'node/no-deprecated-api': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-unpublished-require': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unsupported-features/es-builtins': [
      'error',
      // We need to manually specify a min-version since we can't use `engine`
      {
        version: '>=14.0.0',
        ignores: [],
      },
    ],
    'node/no-unsupported-features/node-builtins': [
      'error',
      // We need to manually specify a min-version since we can't use `engine`
      {
        version: '>=14.0.0',
        ignores: [],
      },
    ],
    'no-process-exit': 'off',
    'prefer-const': [
      'warn',
      {
        destructuring: 'all',
      },
    ],
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['packages/playground/**'],
      rules: {
        'node/no-extraneous-import': 'off',
        'node/no-extraneous-require': 'off',
      },
    },
    {
      files: ['packages/create-hydrogen-app/template-*/**'],
      rules: {
        'node/no-missing-import': 'off',
      },
    },
    {
      files: [
        'packages/dev/**',
        'packages/localdev/**',
        'packages/playground/**',
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },
    {
      files: ['**/*.example.*'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react/jsx-key': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'node/no-extraneous-import': 'off',
        'node/no-missing-import': 'off',
      },
    },
  ],
};
