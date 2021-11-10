import extractProductsToFetch, {ProductToFetch} from './extractProductsToFetch';
import getShopifyVariables from './getShopifyVariables';
import productFragment from './productFragment';
import {SanityQueryClientOptions} from './types';
import {useSkippableShopQuery} from './useSkippableShopQuery';

interface ProductWithFragment extends ProductToFetch {
  fragment?: string;
}

function getQuery(products: ProductWithFragment[]): string {
  // @TODO: replace with final ProductProviderFragment
  return `
  query getProducts(
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
  ) {
    ${products
      .map(
        (product, index) => `
      product${index}: product(id: "gid://shopify/Product/${product.shopifyId}") {
        ${product.fragment}
      }
    `
      )
      .join('\n')}
  }

  ${productFragment}
  `;
}

const useSanityShopifyProducts = (
  data: unknown,
  options: SanityQueryClientOptions
) => {
  const {getProductGraphQLFragment} = options;
  const shopifyVariables = getShopifyVariables(options.shopifyVariables);
  const productsToFetch = extractProductsToFetch(data);

  const enhanceProductWithFragment = (product: ProductToFetch) => {
    if (typeof getProductGraphQLFragment === 'function') {
      const fragment = getProductGraphQLFragment(product);
      if (typeof fragment === 'string') {
        return {
          ...product,
          fragment,
        };
      } else if (fragment === false) {
        return {
          ...product,
          fragment: undefined,
        };
      }
    }
    return {
      ...product,
      fragment: '...ProductProviderFragment',
    };
  };

  const productsWithFragments = Object.keys(productsToFetch)
    .map((id) => enhanceProductWithFragment(productsToFetch[id]))
    .filter((product) => Boolean(product.fragment));

  const shouldFetch = productsWithFragments.length > 0;

  const finalQuery = shouldFetch ? getQuery(productsWithFragments) : undefined;

  const {data: shopifyData} = useSkippableShopQuery<{[key: string]: any}>({
    query: finalQuery,
    variables: shopifyVariables,
  });

  const shopifyProducts = shopifyData
    ? Object.keys(shopifyData)
        .map((key) => ({index: Number(key.replace('product', '')), key}))
        .map(({index, key}) => {
          const {sanityId} = productsWithFragments[index] || {};
          if (!sanityId) {
            return;
          }
          return {
            sanityId,
            content: shopifyData[key],
          };
        })
        .filter(Boolean)
        .reduce((finalObject, curProduct) => {
          if (!curProduct?.sanityId) {
            return finalObject;
          }

          return {
            ...finalObject,
            [curProduct.sanityId]: curProduct.content,
          };
        }, {})
    : undefined;

  return shopifyProducts;
};

export default useSanityShopifyProducts;
