import {Feature} from '../../../../utilities/feature';
import {TemplateOptions} from '../../../../types';

export default function ({features, ifFeature}: TemplateOptions) {
  const pwaImport = ifFeature(
    Feature.Pwa,
    `const VitePWA = require('vite-plugin-pwa').VitePWA;`
  );

  const pwaPluginMarkup = ifFeature(
    Feature.Pwa,
    `
    , VitePWA({
      base: '/',
      registerType: 'auto',
      strategies: 'injectManifest',
      manifest: {
        name: 'Hydrogen PWA',
        short_name: 'hydrogen-pwa',
        theme_color: '#2ec6b9',
        icons: [
          {
            src: '/snowdevil-512w.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  `
  );

  return `
const hydrogen = require('@shopify/hydrogen/plugin').default;
${pwaImport}

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [hydrogen({})${pwaPluginMarkup}],
};
`;
}
