export default {
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['eslint-comments', 'prettier', 'react', 'react-hooks', 'jsx-a11y'],
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  rules: {
    '@shopify/jsx-no-complex-expressions': 'off',
    '@shopify/jsx-no-hardcoded-content': 'off',
    'eslint-comments/no-unused-disable': 'error',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/label-has-for': 'off',
    'no-console': 'warn',
    'no-use-before-define': 'off',
    'no-warning-comments': 'off',
    'object-shorthand': ['error', 'always', {avoidQuotes: true}],
    'react/display-name': 'off',
    'react/no-array-index-key': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['node_modules/', 'build/', '*.graphql.d.ts', '*.graphql.ts'],
  overrides: [
    {
      files: ['*.test.*'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        node: true,
        jest: true,
      },
    },
    {
      files: ['*.server.*'],
      rules: {'react-hooks/rules-of-hooks': 'off'},
    },
  ],
};
