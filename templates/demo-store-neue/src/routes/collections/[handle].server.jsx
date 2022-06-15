import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {
  Layout,
  NotFound,
  PageHeader,
  ProductGrid,
  Section,
  Text,
} from '~/components';

const pageBy = 4;

export default function Collection({params}) {
  const {handle} = params;
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {
    data: {collection},
  } = useShopQuery({
    query: COLLECTION_QUERY,
    variables: {
      handle,
      countryCode,
      languageCode,
      pageBy,
    },
    preload: true,
  });

  if (!collection) {
    return <NotFound type="collection" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
    },
  });

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
        </div>
      </PageHeader>
      <Section>
        <ProductGrid collection={collection} />
      </Section>
    </Layout>
  );
}

// pagination api
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
  ${PRODUCT_CARD_FRAGMENT}
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
  ${PRODUCT_CARD_FRAGMENT}
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
