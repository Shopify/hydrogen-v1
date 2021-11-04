import rules from './rules';

export default {
  plugins: ['hydrogen'],
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@shopify/react',
    'plugin:@shopify/node',
    'plugin:@shopify/prettier',
  ],
  rules,
};
