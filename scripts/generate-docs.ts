import {resolve} from 'path';
// eslint-disable-next-line node/no-missing-import
import {DocsGen, Options} from '../packages/generate-docs';

const ROOT = resolve('.');
const logger = console;

async function runCliGenerator(args: Partial<Options> = {}) {
  const cliGenerator = new DocsGen({
    inputRootPath: ROOT,
    packageName: 'cli',
    ...args,
  });

  await Promise.all([
    cliGenerator.section({
      title: 'CLI',
      description:
        'Use the  `@shopify/hydrogen-cli` to quickly get up and running building hydrogen apps.',
      url: '/api/hydrogen/cli/index.md',
      entry: '../',
    }),
    cliGenerator.section({
      title: 'Commands',
      description: 'Command reference for the `@shopify/hydrogen-cli`',
      url: '/api/hydrogen/cli/commands/index.md',
      entry: 'commands',
      tableColumns: ['Command', 'Description'],
    }),
    cliGenerator.section({
      title: 'Create',
      description: 'Create command reference from the `@shopify/hydrogen-cli`',
      url: '/api/hydrogen/cli/commands/create/index.md',
      entry: 'commands/create',
      tableColumns: ['Command', 'Description'],
    }),
  ]);
}

async function runHydrogenGenerator(args: Partial<Options> = {}) {
  const generator = new DocsGen({
    inputRootPath: ROOT,
    packageName: 'hydrogen',
    ...args,
  });
  await Promise.all([
    // Components

    // Primitive
    generator.section({
      title: 'Primitive',
      description:
        'Get familiar with the Hydrogen primitive components included in Hydrogen.',
      url: '/api/hydrogen/components/primitive/index.md',
      entry: [
        'components/ExternalVideo',
        'components/Image',
        'components/MediaFile',
        'components/Metafield',
        'components/Model3D',
        'components/Money',
        'components/RawHtml',
        'components/ShopPayButton',
        'components/UnitPrice',
        'components/Video',
      ],
    }),
    // Global
    generator.section({
      title: 'Global',
      description:
        'Get familiar with the Hydrogen global components included in Hydrogen.',
      url: '/api/hydrogen/components/global/index.md',
      entry: 'foundation/ShopifyProvider',
    }),
    // Product and variant
    generator.section({
      title: 'Product and variant',
      description:
        'Get familiar with the Hydrogen product and variant components included in Hydrogen.',
      url: '/api/hydrogen/components/product-variant/index.md',
      entry: [
        'components/ProductDescription',
        'components/ProductMetafield',
        'components/ProductPrice',
        'components/ProductProvider',
        'components/ProductTitle',
        'components/SelectedVariantAddToCartButton',
        'components/SelectedVariantBuyNowButton',
        'components/SelectedVariantImage',
        'components/SelectedVariantMetafield',
        'components/SelectedVariantPrice',
        'components/SelectedVariantShopPayButton',
        'components/SelectedVariantUnitPrice',
      ],
    }),
    // Cart
    generator.section({
      title: 'Cart',
      description:
        'Get familiar with the Hydrogen cart components included in Hydrogen.',
      url: '/api/hydrogen/components/cart/index.md',
      entry: [
        'components/AddToCartButton',
        'components/BuyNowButton',
        'components/CartCheckoutButton',
        'components/CartEstimatedCost',
        'components/CartLineAttributes',
        'components/CartLineImage',
        'components/CartLinePrice',
        'components/CartLineProductTitle',
        'components/CartLineProvider',
        'components/CartLineQuantity',
        'components/CartLineQuantityAdjustButton',
        'components/CartLines',
        'components/CartLineSelectedOptions',
        'components/CartProvider',
        'components/CartShopPayButton',
      ],
    }),
    // Localization
    generator.section({
      title: 'Localization',
      description:
        'Get familiar with the Hydrogen localization components included in Hydrogen.',
      url: '/api/hydrogen/components/localization/index.md',
      entry: 'components/LocalizationProvider',
    }),

    // Hooks
    // Global
    generator.section({
      title: 'Global',
      description:
        'Get familiar with the Shopify-specific commerce hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/global/index.md',
      entry: [
        'foundation/useServerState',
        'foundation/useShop',
        'foundation/useQuery',
      ],
    }),

    // Primitive
    generator.section({
      title: 'Primitive',
      description:
        'Get familiar with the Hydrogen primitive hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/primitive/index.md',
      entry: ['hooks/useMoney'],
    }),
    // Product and variant
    generator.section({
      title: 'Product and variant',
      description:
        'Get familiar with the Hydrogen product and variant hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/product-variant/index.md',
      entry: ['hooks/useProduct', 'hooks/useProductOptions'],
    }),
    // Metafield
    generator.section({
      title: 'Metafield',
      description:
        'Get familiar with the Hydrogen metafield hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/metafield/index.md',
      entry: ['hooks/useParsedMetafields'],
    }),
    // Cart
    generator.section({
      title: 'Cart',
      description:
        'Get familiar with the Hydrogen cart hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/cart/index.md',
      entry: [
        'hooks/useCart',
        'hooks/useCartAttributesUpdateCallback',
        'hooks/useCartBuyerIdentityUpdateCallback',
        'hooks/useCartCheckoutUrl',
        'hooks/useCartCreateCallback',
        'hooks/useCartDiscountCodesUpdateCallback',
        'hooks/useCartLine',
        'hooks/useCartLinesAddCallback',
        'hooks/useCartLinesRemoveCallback',
        'hooks/useCartLinesTotalQuantity',
        'hooks/useCartLinesUpdateCallback',
        'hooks/useCartNoteUpdateCallback',
      ],
    }),
    // Localization
    generator.section({
      title: 'Localization',
      description:
        'Get familiar with the Hydrogen localization hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/localization/index.md',
      entry: ['hooks/useAvailableCountries', 'hooks/useCountry'],
    }),
    // Utilities
    generator.section({
      title: 'Utilities overview',
      description:
        'Get familiar with the Shopify-specific commerce utilities included in Hydrogen.',
      url: '/api/hydrogen/utilities/index.md',
      entry: 'utilities',
    }),
    // SDK reference
    generator.section({
      title: 'Hydrogen components, hooks, and utilities overview',
      description:
        'Get familiar with the set of Shopify-specific commerce components, hooks, and utilities included in Hydrogen.',
      url: '/api/hydrogen/index.md',
      entry: 'docs/hydrogen-sdk.md',
    }),
    // Framework
    generator.section({
      title: 'Hydrogen framework overview',
      description: 'Learn about the architecture and framework of Hydrogen.',
      url: '/custom-storefronts/hydrogen/framework/index.md',
      entry: 'framework/docs/index.md',
    }),
    generator.section({
      title: 'React Server Components',
      description:
        'Learn about React Server Components, an opinionated data-fetching and rendering workflow for React apps.',
      url: '/custom-storefronts/hydrogen/framework/react-server-components.md',
      entry: 'framework/docs/react-server-components.md',
    }),
    generator.section({
      title: 'Built-in CSS support',
      description:
        'Learn about the CSS support built into Hydrogen apps and how you can customize the styles in your app.',
      url: '/custom-storefronts/hydrogen/framework/css-support.md',
      entry: 'framework/docs/css-support.md',
    }),
    generator.section({
      title: 'Cache',
      description: 'Learn how to manage cache options for Hydrogen apps.',
      url: '/custom-storefronts/hydrogen/framework/cache.md',
      entry: 'framework/docs/cache.md',
    }),
    generator.section({
      title: 'Server state',
      description:
        'Learn how to update the state on the server when you are building your Hydrogen app.',
      url: '/custom-storefronts/hydrogen/framework/server-state.md',
      entry: 'framework/docs/server-state.md',
    }),
    generator.section({
      title: 'Routes',
      description:
        'Get familiar with the file-based routing system that Hydrogen uses.',
      url: '/custom-storefronts/hydrogen/framework/routes.md',
      entry: 'framework/docs/routes.md',
    }),
    generator.section({
      title: 'Pages',
      description: 'Learn about how page server components receive props.',
      url: '/custom-storefronts/hydrogen/framework/pages.md',
      entry: 'framework/docs/pages.md',
    }),
    generator.section({
      title: 'Secrets',
      description:
        'Learn how to store sensitive information in your Hydrogen project.',
      url: '/custom-storefronts/hydrogen/framework/secrets.md',
      entry: 'framework/docs/secrets.md',
    }),
    generator.section({
      title: 'SEO',
      description:
        'Learn how to customize the output of SEO-related tags in your Hydrogen client and server components.',
      url: '/custom-storefronts/hydrogen/framework/seo.md',
      entry: 'framework/docs/seo.md',
    }),
    generator.section({
      title: 'Static assets',
      description:
        'Learn how to reference and serve static assets in Hydrogen.',
      url: '/custom-storefronts/hydrogen/framework/static-assets.md',
      entry: 'framework/docs/static-assets.md',
    }),
    generator.section({
      title: 'Third-party dependencies',
      description:
        'Tips and tricks for using third-party dependencies in Hydrogen apps.',
      url: '/custom-storefronts/hydrogen/framework/third-party-dependencies.md',
      entry: 'framework/docs/third-party-dependencies.md',
    }),
  ]);
}

export default async function runAll(args: Partial<Options> = {}) {
  return Promise.all([runHydrogenGenerator(args), runCliGenerator(args)]).catch(
    (error) => {
      logger.error(error);
    }
  );
}

runAll({
  generateDocsForShopifyDev: process.argv
    .slice(2)
    .includes('--for-shopify-dev'),
});
