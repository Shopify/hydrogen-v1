import {
  useSession,
  useShop,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {NotFound} from '~/components/pages';
import {PageHeader, Text, Section} from '~/components/elements';
import {ProductGrid} from '~/components/sections';
import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';
import {GRID_IMG_LOAD_EAGER_COUNT} from '~/lib/const';

const pageBy = 12;

export default function Collection({params}) {
  const {handle} = params;
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data} = useShopQuery({
    query: COLLECTION_QUERY,
    variables: {
      handle,
      countryCode,
      languageCode,
      pageBy,
    },
    preload: true,
  });

  useServerAnalytics(
    data?.collection
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.collection,
            resourceId: data.collection.id,
          },
        }
      : null,
  );

  if (data?.collection == null) {
    return <NotFound type="collection" />;
  }

  const collection = data.collection;
  const products = data.collection.products.nodes;

  return (
    <Layout>
      <Seo type="collection" data={collection} />
      <PageHeader heading={collection.title}>
        <div className="flex items-baseline justify-between w-full">
          <div>
            <Text format width="narrow" as="p" className="inline-block">
              {collection.description}
            </Text>
          </div>
          <div className="flex items-baseline justify-end gap-4 md:gap-6 lg:gap-8">
            {/* TODO: This will only get the amount on the page, not the total amount. I don't think you actually can grab the total number of products in a collection today. */}
            <Text>{products.length}</Text>
            {/* TODO: Convert to Filter dropdown */}
            <button className="inline-block pb-px leading-none border-b border-primary">
              Filters
            </button>
          </div>
        </div>
      </PageHeader>
      <Section>
        <ProductGrid data={data} />
      </Section>
    </Layout>
  );
}

export async function api(request, {params, queryShop}) {
  if (request.method !== 'POST') {
    return new Response(405, {Allow: 'POST'});
  }

  const cursor = new URL(request.url).searchParams.get('cursor');
  const {handle} = params;

  return await queryShop({
    query: PAGINATE_QUERY,
    variables: {
      handle,
      cursor,
      pageBy,
    },
  });
}

const PAGINATE_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query CollectionPage($handle: String!, $pageBy: Int!, $cursor: String) {
    collection(handle: $handle) {
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
  }
`;

const COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
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
  }
`;
