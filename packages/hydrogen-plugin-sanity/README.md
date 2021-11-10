# Sanity plugin for Hydrogen

[Sanity](https://www.sanity.io/) is the platform for structured content that lets you build better digital experiences. Shopify customers can use Sanity Studio, our open-source content editing environment, to combine product and marketing information to build unique shopping experiences.

This plugin for Shopify's Hydrogen lets you query Sanity data, combine it with live inventory, and present that information with Hydrogen components. A `useSanityQuery` React hook with an API similar to `useShopQuery` is exposed to efficiently and ergonomically fetch data from a Sanity instance.

## Getting Started

To add the plugin as a dependency to your project:

```bash
yarn add @shopify/hydrogen-plugin-sanity # or `npm install`
```

Then add a `sanity` object to `shopify.config.js` with your client configuration (options come from [@sanity/client](https://www.sanity.io/docs/js-client)):

```js
// shopify.config.js

export default {
  storeDomain: '...',
  // ...
  sanity: {
    // Pull your Sanity configuration from environment variables
    projectId: import.meta.VITE_SANITY_ID,
    // Or add them directly inline
    dataset: 'production',
    apiVersion: 'v2021-06-07',
  },
};
```

Now you're ready to fetch data from a Sanity instance.

### Fetching Sanity data through GraphQL

```js
// Using GraphQL
import {useSanityGraphQLQuery} from '@shopify/hydrogen-plugin-sanity';

const {sanityData} = useSanityGraphQLQuery({
  query: gql`
    query homepage($homeId: String!) {
      home: Home(id: $homeId) {
        featuredProducts {
          _id
          images {
            asset {
              _id
            }
          }
        }
      }
    }
  `,
  variables: {homeId: 'homepage'},
});
```

### Fetching data through [GROQ](https://www.sanity.io/docs/overview-groq)

```js
// Using GROQ
import {useSanityQuery} from '@shopify/hydrogen-plugin-sanity';

const {sanityData} = useSanityQuery({
  query: `*[_id == $homeId][0]{
      ...,
      featuredProducts[] {
        _id,
        images[] {
          asset {
            _id
          }
        }
      }
    }
    `,
  params: {homeId: 'homepage'},
});
```

### Getting product data from Shopify

By default, the hook will automatically look for Shopify products referenced in your Sanity data and fetch them from Shopify for fresh inventory data. The resulting data will be returned through the `shopifyProducts` object:

```jsx
import {BuyNowButton, ProductProvider} from '@shopify/hydrogen';

const Homepage = () => {
  const {sanityData, shopifyProducts} = useSanityQuery({
    query: `*[_id == "homepage"][0]{
      ...,
      featuredProducts[] {
        _id,
        images[] {
          asset {
            _id
          }
        }
      }
    }
    `,
  });
  
  return (
    <div>
      <h1>{sanityData.title}</h1>
      <div>
        {sanityData.featuredProducts.map((product) => {
          // From the product's ID in Sanity, let's get its Shopify data
          const shopifyProduct = shopifyProducts?.[product?._id];
          const firstVariant = shopifyProduct?.variants?.edges[0]?.node;
  
          return (
            <ProductProvider
              value={shopifyProduct}
              initialVariantId={firstVariant?.id}
            >
              <h2>{shopifyProduct.title}</h2>
              <BuyNowButton>Buy now</BuyNowButton>
            </ProductProvider>
          );
        })}
      </div>
    </div>
  );
}
```

### Advanced product querying

You can customize what data you fetch from Shopify on a product basis with the `getProductGraphQLFragment` function. For example, if we're on a legal page where there's no product to buy, we can skip fetching any Shopify data:

```js
const {handle} = useParams();

const {sanityData} = useSanityQuery({
  query: `*[
    _type == "page.legal" &&
    slug.current == $handle
  ][0]`,
  params: {
    handle
  },
  // No need to query Shopify product data
  getProductGraphQLFragment: () => false,
});
```

`getProductGraphQLFragment` receives an object with `shopifyId`, `sanityId`, and `occurrences` - where in the data structure this product has been found - and must return either:

- `true` for fetching default product data (which uses [ProductProviderFragment](https://shopify.dev/beta/hydrogen/reference/components/product-variant/productprovider#graphql-fragment))
- `false` for avoiding fetching data for this product
- A string with the GraphQL fragment for that product

With this, you can fetch specific product data for each use-case. For example, if a product shows up in the first section of a homepage, let's only fetch its full data if it's featured. Otherwise, grabbing its title & handle is enough as we won't offer an "Add to Cart" button for it.

In this example, let's assume the data from Sanity is as follows:

```json
{
  "_type": "homepage",
  "firstSection": {
    "title": "Fresh out the oven",
    "products": [
      {
        "_type": "section-item",
        "_key": "7349334187288",
        "featured": false,
        "product": {
          "_id": "shopifyProduct-7349334187288",
          "store": {
            "handle": "regular-product"
          }
        }
      },
      {
        "_type": "hero-item",
        "_key": "7342335787245",
        "featured": true,
        "product": {
          "_id": "shopifyProduct-7342335787245",
          "store": {
            "handle": "special-product"
          }
        }
      },
    ]
  }
}
```

From this data structure, here's how we'd achieve that:

```js
const { sanityData, shopifyProducts } = useSanityQuery({
  query: QUERY,
  getProductGraphQLFragment: ({ occurrences }) => {
    // If the product ID shows up in 2+ places, fetch the default product data 
    if (occurrences.length > 1) {
      return true;
    }

    /* Immediate parent of where this product appears (occurrences[0][0]) -> {
      "_id": "shopifyProduct-7342335787245",
      "shopify": {
        "handle": "special-product"
      }
    }

    Parent of parent (occurrences[0][1]) -> {
      "_type": "section-item",
      featured: true,
      "product": {
        "_id": "shopifyProduct-7342335787245",
        "store": {
          "handle": "special-product"
        }
      }
    }*/
    if (occurrences[0][1]?._type === "section-item") {
      if (!occurrences[0][1].featured) {
        //  We only want the title & handle for non-featured products
        return `
      title
      handle
      `;
      }
    }

    // Get the default ProductProviderFragment otherwise
    return true;
  },
});
```