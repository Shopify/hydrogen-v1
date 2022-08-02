import {definePlugin} from '@shopify/hydrogen/config';

export default definePlugin(() => ({
  name: 'my-test-plugin',
  url: import.meta.url,
}));
