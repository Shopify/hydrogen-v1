import {
  useShop,
  useUrl,
  useSession,
  useShopQuery,
  gql,
} from '@shopify/hydrogen';
import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import {Heading, Text, Button, Input, Grid} from '~/components/elements';
import {ProductCard} from '~/components/blocks';

import {PRODUCT_CARD_FIELDS} from '~/components/blocks/ProductCard';

export default function Search({pageBy = 12, params}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {handle} = params;
  const {searchParams} = useUrl();

  const query = searchParams.get('q');

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      country: countryCode,
      language: languageCode,
      pageBy,
      query,
    },
    preload: true,
  });

  return (
    <Layout>
      <PageHeader>
        <Heading>Search</Heading>
        <form>
          <Input DefaultLayout={'Search result'} />
        </form>
      </PageHeader>
      <Section>
        <Grid>
          {data.products.nodes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

const QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query search(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $after: String
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, sortKey: RELEVANCE, query: $query, after: $after) {
      nodes {
        ...ProductCardFields
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
