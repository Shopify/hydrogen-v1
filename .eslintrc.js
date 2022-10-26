// @ts-check

module.exports = {
  ignorePatterns: [
    '**/storefront-api-types.ts',
    '**/storefront-api-types.d.ts',
    'examples/**',
  ],
  root: true,
  plugins: ['eslint-plugin-tsdoc'],
  extends: [
    'plugin:node/recommended',
    'plugin:hydrogen/recommended',
    'plugin:hydrogen/typescript',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    'jest/no-disabled-tests': 'off',
    'jest/no-export': 'off',
    'jsx-a11y/iframe-has-title': 'off',
    'no-console': 'off',
    'no-constant-condition': 'off',
    'jest/no-done-callback': 'off',
    'tsdoc/syntax': 'error',
    'node/no-missing-import': [
      'error',
      {
        allowModules: ['types', 'testUtils', '@shopify/hydrogen'],
        tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts'],
      },
    ],
    'node/no-extraneous-import': [
      'error',
      {
        allowModules: ['@shopify/hydrogen', '@shopify/react-testing'],
      },
    ],
    'node/no-extraneous-require': [
      'error',
      {
        allowModules: ['@shopify/hydrogen'],
      },
    ],
    'node/no-unpublished-import': 'off',
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
    'prefer-const': [
      'warn',
      {
        destructuring: 'all',
      },
    ],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  overrides: [
    {
      files: ['packages/eslint-plugin/**'],
      rules: {
        'hydrogen/server-component-banned-hooks': 'off',
        'hydrogen/prefer-image-component': 'off',
        'jsx-a11y/img-redundant-alt': 'off',
        'no-prototype-builtins': 'off',
      },
    },
    {
      files: ['packages/hydrogen/**'],
      rules: {
        'hydrogen/prefer-gql': 'off',
      },
    },
    {
      files: ['packages/playground/**'],
      rules: {
        'node/no-extraneous-import': 'off',
        'node/no-extraneous-require': 'off',
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
