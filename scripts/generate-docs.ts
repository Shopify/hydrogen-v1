import {resolve} from 'path';
// eslint-disable-next-line node/no-missing-import
import {DocsGen, Options, Column} from '../packages/generate-docs';

const ROOT = resolve('.');
const logger = console;

const COMPONENTS_TABLE = {
  title: 'Reference',
  columns: [Column.ComponentName, Column.ComponentType, Column.Description],
};

async function runHydrogenGenerator(args: Partial<Options> = {}) {
  const generator = new DocsGen({
    inputRootPath: ROOT,
    packageName: 'hydrogen',
    ...args,
  });

  // Tables
  const frameworkComponentsTable = await generator.table({
    ...COMPONENTS_TABLE,
    description: 'Hydrogen includes the following framework components:',
  });
  const primitiveComponentsTable = await generator.table({
    ...COMPONENTS_TABLE,
    description: 'Hydrogen includes the following primitive components:',
  });

  const cartComponentsTable = await generator.table({
    ...COMPONENTS_TABLE,
    description: 'Hydrogen includes the following cart components:',
  });

  const productAndVariantTable = await generator.table({
    ...COMPONENTS_TABLE,
    description:
      'Hydrogen includes the following product and variant components:',
  });

  const localizationTable = await generator.table({
    ...COMPONENTS_TABLE,
    description: 'Hydrogen includes the following localization components:',
  });
  const globalComponentsTable = await generator.table({
    ...COMPONENTS_TABLE,
    description: 'Hydrogen includes the following global components:',
  });

  await Promise.all([
    // Components
    generator.section({
      title: 'Hydrogen components overview',
      description:
        'Get familiar with the Shopify-specific commerce components included in Hydrogen.',
      url: '/api/hydrogen/components/index.md',
      entry: 'docs/components',
    }),
    // Framework
    generator.section({
      title: 'Framework components',
      intro:
        'Framework components are components that are available in the [Hydrogen framework](/custom-storefronts/hydrogen/framework).',
      description:
        'Get familiar with the framework components included in Hydrogen.',
      url: '/api/hydrogen/components/framework/index.md',
      entry: [
        'foundation/FileRoutes',
        'foundation/Route',
        'foundation/Router',
        'components/Link',
      ],
      tables: [frameworkComponentsTable],
    }),
    // Primitive
    generator.section({
      title: 'Primitive components',
      intro:
        'Primitive components are the building blocks for different component types, including products, variants, and cart.',
      description:
        'Get familiar with the primitive components included in Hydrogen.',
      url: '/api/hydrogen/components/primitive/index.md',
      entry: [
        'components/ExternalVideo',
        'components/Image',
        'components/MediaFile',
        'components/Metafield',
        'components/ModelViewer',
        'components/Money',
        'components/ShopPayButton',
        'components/UnitPrice',
        'components/Video',
        'components/Seo',
      ],
      tables: [primitiveComponentsTable],
    }),
    // Global
    generator.section({
      title: 'Global components',
      intro:
        'Global components are React components that relate to your entire app.',
      description:
        'Get familiar with the global components included in Hydrogen.',
      url: '/api/hydrogen/components/global/index.md',
      entry: ['foundation/ShopifyProvider'],
      tables: [globalComponentsTable],
    }),
    // Product and variant
    generator.section({
      title: 'Product and variant components',
      intro:
        'Products are the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options. Each combination of option values for a product can be a variant for that product. For example, a t-shirt might be available for purchase in blue and green. The blue t-shirt and the green t-shirt are variants.',
      description:
        'Get familiar with the product and variant components included in Hydrogen.',
      url: '/api/hydrogen/components/product-variant/index.md',
      entry: [
        'components/ProductDescription',
        'components/ProductMetafield',
        'components/ProductPrice',
        'components/ProductProvider',
        'components/ProductTitle',
      ],
      tables: [productAndVariantTable],
    }),
    // Cart
    generator.section({
      title: 'Cart components',
      intro:
        'A cart contains the merchandise that a customer intends to purchase and the estimated cost associated with the cart. When a customer is ready to purchase their items, they can proceed to checkout.',
      description:
        'Get familiar with the cart components included in Hydrogen.',
      url: '/api/hydrogen/components/cart/index.md',
      entry: [
        'components/AddToCartButton',
        'components/BuyNowButton',
        'components/CartCheckoutButton',
        'components/CartEstimatedCost',
        'components/CartLineImage',
        'components/CartLinePrice',
        'components/CartLineProductTitle',
        'components/CartLineProvider',
        'components/CartLineQuantity',
        'components/CartLineQuantityAdjustButton',
        'components/CartLines',
        'components/CartProvider',
        'components/CartShopPayButton',
      ],
      tables: [cartComponentsTable],
    }),
    // Localization
    generator.section({
      title: 'Localization components',
      intro:
        'Localization can help merchants expand their business to a global audience by creating shopping experiences in local languages and currencies.',
      description:
        'Get familiar with the localization components included in Hydrogen.',
      url: '/api/hydrogen/components/localization/index.md',
      entry: ['components/LocalizationProvider'],
      tables: [localizationTable],
    }),

    // Hooks
    generator.section({
      title: 'Hydrogen hooks overview',
      description:
        'Get familiar with the Shopify-specific commerce hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/index.md',
      entry: 'docs/hooks',
    }),
    // Framework
    generator.section({
      title: 'Framework',
      description:
        'Get familiar with the framework hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/framework/index.md',
      entry: ['foundation/useNavigate', 'foundation/useRouteParams'],
      intro:
        'Framework hooks are hooks that are available in the [Hydrogen framework](/custom-storefronts/hydrogen/framework).',
      tables: [
        await generator.table({
          title: 'Reference',
          description: 'Hydrogen includes the following framework hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),

    // Global
    generator.section({
      title: 'Global',
      description:
        'Get familiar with the Shopify-specific commerce hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/global/index.md',
      entry: [
        'foundation/useServerProps',
        'foundation/useShop',
        'foundation/useQuery',
        'foundation/fetchSync',
        'foundation/useUrl',
        'hooks/useShopQuery',
      ],
      intro:
        'Global hooks are React hooks that relate to your entire app. You use global hooks to fetch data from server components.',
      tables: [
        await generator.table({
          title: 'Reference',
          description: 'Hydrogen includes the following global hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),

    // Primitive
    generator.section({
      title: 'Primitive hooks',
      description: 'Learn about the primitive hooks offered in Hydrogen.',
      url: '/api/hydrogen/hooks/primitive/index.md',
      entry: ['hooks/useMoney', 'hooks/useLoadScript'],
      intro:
        'Primitive hooks are the building blocks for different component types, including products, variants, and cart.',
      tables: [
        await generator.table({
          title: 'Reference',
          description: 'Hydrogen includes the following primitive hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),
    // Product and variant
    generator.section({
      title: 'Product and variant',
      description:
        'Get familiar with the Hydrogen product and variant hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/product-variant/index.md',
      entry: ['hooks/useProduct', 'hooks/useProductOptions'],
      intro:
        'Products are the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options. Each combination of option values for a product can be a variant for that product. For example, a t-shirt might be available for purchase in blue and green. The blue t-shirt and the green t-shirt are variants.',
      tables: [
        await generator.table({
          title: 'Reference',
          description:
            'Hydrogen includes the following product and variant hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),
    // Metafield
    generator.section({
      title: 'Metafield',
      description:
        'Get familiar with the Hydrogen metafield hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/metafield/index.md',
      entry: ['hooks/useParsedMetafields'],
      intro:
        'Metafields allow you to attach specialized information to Shopify resources, such as part numbers or release dates. Merchants and other apps can retrieve and edit the data that is stored in metafields from the Shopify admin.',
      tables: [
        await generator.table({
          title: 'Reference',
          description: 'Hydrogen includes the following metafield hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),
    // Cart
    generator.section({
      title: 'Cart',
      description:
        'Get familiar with the Hydrogen cart hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/cart/index.md',
      entry: ['hooks/useCart', 'hooks/useCartLine'],
      intro:
        'A cart contains the merchandise that a customer intends to purchase and the estimated cost associated with the cart. When a customer is ready to purchase their items, they can proceed to checkout.',
      tables: [
        await generator.table({
          title: 'Reference',
          description: 'Hydrogen includes the following cart hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),
    // Localization
    generator.section({
      title: 'Localization',
      description:
        'Get familiar with the Hydrogen localization hooks included in Hydrogen.',
      url: '/api/hydrogen/hooks/localization/index.md',
      entry: ['hooks/useCountry'],
      intro:
        'Localization can help merchants expand their business to a global audience by creating shopping experiences in local languages and currencies.',
      tables: [
        await generator.table({
          title: 'Reference',
          description: 'Hydrogen includes the following localization hooks:',
          columns: ['Hook name', Column.Description],
        }),
      ],
    }),
    // Utilities
    generator.section({
      title: 'Hydrogen utilities overview',
      description:
        'Get familiar with the Shopify-specific commerce utilities included in Hydrogen.',
      url: '/api/hydrogen/utilities/index.md',
      entry: 'docs/utilities',
    }),
    // SDK reference
    generator.section({
      title: 'Hydrogen components, hooks, and utilities overview',
      description:
        'Get familiar with the set of Shopify-specific commerce components, hooks, and utilities included in Hydrogen.',
      url: '/api/hydrogen/index.md',
      entry: 'docs/hydrogen-reference.md',
    }),
    // Framework
    generator.section({
      title: 'Hydrogen framework overview',
      description: 'Learn about the architecture and framework of Hydrogen.',
      url: '/custom-storefronts/hydrogen/framework/index.md',
      entry: 'framework/docs/index.md',
    }),
    generator.section({
      title: 'React Server Components overview',
      description:
        'Learn about React Server Components, an opinionated data-fetching and rendering workflow for React apps.',
      url: '/custom-storefronts/hydrogen/framework/react-server-components/index.md',
      entry: 'framework/docs/react-server-components.md',
    }),
    generator.section({
      title: 'Working with React Server Components',
      description:
        'Learn how to work with React Server Components in your Hydrogen app and the known limitations.',
      url: '/custom-storefronts/hydrogen/framework/react-server-components/work-with-rsc.md',
      entry: 'framework/docs/work-with-rsc.md',
    }),
    generator.section({
      title: 'Built-in CSS support',
      description: 'Learn about the CSS support built into Hydrogen apps.',
      url: '/custom-storefronts/hydrogen/framework/css-support.md',
      entry: 'framework/docs/css-support.md',
    }),
    generator.section({
      title: 'Caching',
      description: 'Learn how to manage cache options for Hydrogen apps.',
      url: '/custom-storefronts/hydrogen/framework/cache.md',
      entry: 'framework/docs/cache.md',
    }),
    generator.section({
      title: 'Streaming server-side rendering (SSR)',
      description: 'Learn how to improve the loading performance of your app.',
      url: '/custom-storefronts/hydrogen/framework/streaming-ssr.md',
      entry: 'framework/docs/streaming-ssr.md',
    }),
    generator.section({
      title: 'Analytics',
      description:
        'Learn about the analytics support build into Hydrogen apps.',
      url: '/custom-storefronts/hydrogen/framework/analytics.md',
      entry: 'framework/docs/analytics.md',
    }),
    generator.section({
      title: 'Preloaded queries',
      description:
        'Learn how to configure queries to preload in your Hydrogen app.',
      url: '/custom-storefronts/hydrogen/framework/preloaded-queries.md',
      entry: 'framework/docs/preloaded-queries.md',
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
      title: 'Environment variables',
      description:
        'Learn how to store sensitive information in your Hydrogen project.',
      url: '/custom-storefronts/hydrogen/framework/environment-variables.md',
      entry: 'framework/docs/environment-variables.md',
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
      title: 'ESLint',
      description: 'Learn about the ESLint plugin in Hydrogen.',
      url: '/custom-storefronts/hydrogen/framework/eslint.md',
      entry: 'framework/docs/eslint.md',
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
  return Promise.all([runHydrogenGenerator(args)]).catch((error) => {
    logger.error(error);
  });
}

runAll({
  generateDocsForShopifyDev: process.argv
    .slice(2)
    .includes('--for-shopify-dev'),
});
