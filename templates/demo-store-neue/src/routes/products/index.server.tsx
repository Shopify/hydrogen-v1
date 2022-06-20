import {
  useShopQuery,
  gql,
  useLocalization,
  type HydrogenRequest,
  type HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {ProductGrid, PageHeader, Section} from '~/components';
import {Layout} from '~/components/index.server';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

const pageBy = 12;

export default function AllProducts() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery<any>({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      pageBy,
    },
    preload: true,
  });

  const products = data.products;

  return (
    <Layout>
      <PageHeader heading="All Products" variant="allCollections" />
      <Section>
        <ProductGrid
          url={`/products?country=${countryCode}`}
          collection={{products} as Collection}
        />
      </Section>
    </Layout>
  );
}

// pagination api
export async function api(
  request: HydrogenRequest,
  {params, queryShop}: HydrogenApiRouteOptions,
) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {Allow: 'POST'},
    });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const {handle} = params;

  return await queryShop({
    query: PAGINATE_QUERY,
    variables: {
      handle,
      cursor,
      pageBy,
      country,
    },
  });
}

const ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCardFields
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

const PAGINATE_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsPage(
    $pageBy: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCardFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
