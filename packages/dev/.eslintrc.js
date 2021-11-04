module.exports = {
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@shopify/react',
    'plugin:@shopify/node',
    'plugin:@shopify/prettier',
  ],
  rules: {
    '@shopify/jsx-no-hardcoded-content': 'off',
    '@shopify/jsx-no-complex-expressions': 'off',

    /**
     * React overrides
     */
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', {extensions: ['.tsx', '.jsx']}],
    'react/prop-types': 'off',

    /**
     * Import overrides
     */
    'import/no-unresolved': ['error', {ignore: ['@shopify/hydrogen']}],

    /**
     * ESlint overrides
     */
    'no-use-before-define': 'off',
    'no-warning-comments': 'off',

    /**
     * jsx-a11y overrides
     */
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',

    // These two rules result in a significant number of false positives so we
    // need to keep them disabled.
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
  },
};
