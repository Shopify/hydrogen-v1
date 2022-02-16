module.exports = {
  extends: ['plugin:hydrogen/recommended'],
  // TODO: Disable these upstream in hydrogen/recommended
  rules: {
    'jest/valid-describe': 'off',
    'jest/no-try-expect': 'off',
    'jest/no-conditional-expect': 'off',
  },
  overrides: [
    {
      files: ['tests/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
