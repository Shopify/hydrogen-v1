export default {
  // TODO: We may want to change the configuration for the following 3 rules
  'jsx-a11y/click-events-have-key-events': 'off',
  'jsx-a11y/no-noninteractive-element-interactions': 'off',
  'react/jsx-filename-extension': ['error', {extensions: ['.tsx', '.jsx']}],

  /**
   * Rules below this line are intentionally disabled for different reasons
   */

  // The following 2 rules are very strict and disabled here to lessen developer frustration
  '@shopify/jsx-no-hardcoded-content': 'off',
  '@shopify/jsx-no-complex-expressions': 'off',

  /**
   * eslint overrides
   */

  // We often define GraphQL queries at the bottom of the file which would be a violation for this rule
  'no-use-before-define': 'off',
  // We agree that warning comments acceptable
  'no-warning-comments': 'off',

  /**
   * react overrides
   */

  // Following Next.js and likely this will be the default in most frameworks
  'react/react-in-jsx-scope': 'off',
  // We default to typescript for typing, non typescript projects can override this rule if they want
  'react/prop-types': 'off',

  /**
   * import overrides
   */

  // TODO: We should turn these on, at least partially
  // 'import/no-unresolved': ['off'],
  // 'import/extensions': ['off'],

  // These two rules result in a significant number of false positives so we
  // need to keep them disabled.
  'jsx-a11y/label-has-for': 'off',
  'jsx-a11y/control-has-associated-label': 'off',
};
