import rules from './rules';

export default {
  plugins: ['hydrogen'],
  extends: [
    'plugin:@shopify/esnext',
    'plugin:@shopify/react',
    'plugin:@shopify/node',
    'plugin:@shopify/prettier',
  ],
  rules,
};
