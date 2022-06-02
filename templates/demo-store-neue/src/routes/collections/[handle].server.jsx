import {
  useSession,
  useShop,
  useShopQuery,
  flattenConnection,
  Seo,
  gql,
} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
import {NotFound} from '~/components/pages';
import {PageHeader, Section} from '~/components/sections';
import {Text} from '~/components/elements';
import ProductGrid from '~/components/sections/ProductGrid.client';

import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';

// TODO: Change this to 12 when complete
const pageBy = 2;

export default function Collection({params}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {handle} = params;

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      country: countryCode,
      language: languageCode,
      pageBy,
    },
    preload: true,
  });

  if (data?.collection == null) {
    return <NotFound type="collection" />;
  }

  const collection = data.collection;
  const products = flattenConnection(data.collection.products);

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
    query: QUERY,
    variables: {
      handle,
      cursor,
      pageBy,
    },
  });
}

const QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      descriptionHtml
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
        edges {
          cursor
          node {
            ...ProductCardFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
