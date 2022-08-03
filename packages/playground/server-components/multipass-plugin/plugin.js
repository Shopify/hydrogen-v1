/*
  The plugin.js file exports an "installer" function that is
  imported and installed via `hydrogen.config.js` for example:

  import hydrogenMultipass from 'hydrogen-plugin-multipass/plugin'

  export default defineConfig({
    shopify: {...},
    plugins: [
      hydrogenMultipass(pluginOptions),
    ]
  });

  It is used to indicate that Hydrogen should import this plugin and
  to pass options to each of the other areas.

  CONTEXT: This file runs both at runtime and build time.
*/

import {definePlugin} from '@shopify/hydrogen/config';

export default definePlugin((options) => ({
  name: 'hydrogen-plugin-multipass',
  url: import.meta.url,
}));
