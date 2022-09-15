import {gql} from '@shopify/hydrogen';
import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import {ProductConnection} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

export async function api(
  _request: HydrogenRequest,
  {queryShop}: HydrogenApiRouteOptions,
) {
  const {data, errors} = await queryShop<{
    products: ProductConnection;
  }>({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count: 4,
    },
  });

  if (!data || errors) {
    throw new Error(
      `There were either errors or no data returned for the query. ${
        errors?.length &&
        `Errors: ${errors.map((err) => err.message).join('. ')}`
      }`,
    );
  }

  const {products} = data;

  return products.nodes;
}

const TOP_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query topProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
