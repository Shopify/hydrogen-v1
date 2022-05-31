export const product = {
  label: 'Limited Edition' /* Metafield */,
  id: 'gid://shopify/Product/6730850828344',
  title: 'The Hydrogen',
  publishedAt: '2021-06-17T18:33:17Z',
  handle: 'snowboard',
  description:
    "Description Our flagship board, ideal for technical terrain and those who dare to go where the chairlift can't take you. The Hydrogen excels in the backcountry making riding out of bounds as easy as resort groomers. New for 2021, the Hydrogen Snowboard has Oxygen Pack inserts giving you more float on the deepest days. Care Guide Clean well after use Wax regularly Specs Weight: 5 lb Length: 4 ft Width: 1 ft Manufactured on: 8/2/2021, 3:30:00 PM Manufactured by: Shopify",
  priceRange: {
    minVariantPrice: {
      amount: '775.0',
      currencyCode: 'CAD',
    },
    maxVariantPrice: {
      amount: '775.0',
      currencyCode: 'CAD',
    },
  },
  options: [
    {
      name: 'Color',
      values: ['Morning', 'Evening', 'Night'],
    },
    {
      name: 'Size',
      values: ['154', '158', '160'],
    },
  ],
  variants: {
    nodes: [
      {
        id: 'gid://shopify/ProductVariant/41007289630776',
        image: {
          url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/hydrogen-morning.jpg?v=1636146509',
          altText: 'The Hydrogen snowboard, color Morning',
          width: 1200,
          height: 1504,
        },
        priceV2: {
          amount: '775.0',
          currencyCode: 'CAD',
        },
        compareAtPriceV2: {
          amount: '840.0',
          currencyCode: 'CAD',
        },
      },
    ],
  },
};

export const location = {
  metaobject: {
    id: 'gid://shopify/Metaobject/7176248',
    featured_image: {
      reference: {
        image: {
          url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/kotn-toronto.jpg?v=1653965858',
          width: 4400,
          height: 2927,
        },
      },
    },
    title: {
      value: 'Toronto',
    },
    address: {
      value: '754 Queen St W\nToronto, ON\nM4M 3N8',
    },
    hours: {
      value: '["Monday-Saturday: 11am-6pm","Sunday: 12pm-6pm"]',
    },
    email: {
      value: 'toronto@snowdevil.com',
    },
    phone: {
      value: '416-363-5656',
    },
  },
};
