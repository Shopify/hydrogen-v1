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
  },
  rules: {
    'no-console': 'warn',
    'eslint-comments/no-unused-disable': 'error',
    'object-shorthand': ['error', 'always', {avoidQuotes: true}],
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/no-array-index-key': 'warn',
    'react/react-in-jsx-scope': 'off',
    '@shopify/jsx-no-hardcoded-content': 'off',
    '@shopify/jsx-no-complex-expressions': 'off',
    'no-use-before-define': 'off',
    'no-warning-comments': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
  },
  ignorePatterns: ['node_modules/', 'build/', '*.graphql.d.ts', '*.graphql.ts'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              String: {message: 'Use string instead', fixWith: 'string'},
              Boolean: {message: 'Use boolean instead', fixWith: 'boolean'},
              Number: {message: 'Use number instead', fixWith: 'number'},
              Object: {message: 'Use object instead', fixWith: 'object'},
              Array: {message: 'Provide a more specific type'},
              ReadonlyArray: {message: 'Provide a more specific type'},
            },
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'typeParameter',
            format: ['PascalCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'interface',
            format: ['PascalCase'],
          },
        ],
      },
    },
    {
      files: ['*.test.*'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        node: true,
        jest: true,
      },
    },
  ],
};
