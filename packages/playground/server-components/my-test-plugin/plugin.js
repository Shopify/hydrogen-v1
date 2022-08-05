import {definePlugin} from '@shopify/hydrogen/config';

export default definePlugin(() => ({
  name: 'my-test-plugin',
  url: import.meta.url,
  context: {test1: true},
  events: {
    pageView() {
      if (globalThis.__viteDevServer?.testMeta) {
        globalThis.__viteDevServer.testMeta.pluginEvents.push('pageView');
      }
    },
  },
}));
