export default {
  plugins: ['hydrogen'],
  rules: {
    'hydrogen/client-component-banned-hooks': 'error',
    'hydrogen/prefer-image-component': 'error',
    'hydrogen/server-component-banned-hooks': 'error',
    'hydrogen/server-no-json-parse': 'error',
    'hydrogen/prefer-gql': 'error',
  },
};
