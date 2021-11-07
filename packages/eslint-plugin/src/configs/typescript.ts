export default {
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
  ],
};
