export default {
  plugins: ['hydrogen'],
  rules: {
    'hydrogen/client-component-banned-hooks': 'error',
    'hydrogen/no-script-callbacks-in-server-components': 'error',
    'hydrogen/prefer-gql': 'error',
    'hydrogen/prefer-image-component': 'error',
    'hydrogen/prefer-script-component': 'error',
    'hydrogen/server-component-banned-hooks': 'error',
    'hydrogen/server-no-json-parse': 'error',
    'hydrogen/scripts-in-layout-components': 'error',
  },
};
