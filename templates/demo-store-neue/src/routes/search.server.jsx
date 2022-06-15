import {
  useShop,
  useUrl,
  useSession,
  useShopQuery,
  gql,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {
  PageHeader,
  Section,
  Heading,
  Text,
  Input,
  Grid,
} from '~/components/elements';
import {ProductCard} from '~/components/blocks';
import {FeaturedCollections, ProductSwimlane} from '~/components/sections';
import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';
import {getImageLoadingPriority} from '~/lib/const';

export default function Search({pageBy = 12, params}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {handle} = params;
  const {searchParams} = useUrl();

  const query = searchParams.get('q');

  const {data} = useShopQuery({
    query: SEARCH_QUERY,
    variables: {
      handle,
      country: countryCode,
      language: languageCode,
      pageBy,
      query,
    },
    preload: true,
  });

  const results = data?.products?.nodes;

  if (!query || results.length === 0) {
    return (
      <SearchPage query={query ? decodeURI(query) : null}>
        {results.length === 0 && (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        )}
        <FeaturedCollections
          title="Trending Collections"
          data={data.featuredCollections.nodes}
        />
        <ProductSwimlane
          title="Trending Products"
          data={data.featuredProducts.nodes}
        />
      </SearchPage>
    );
  }

  return (
    <SearchPage query={decodeURI(query)}>
      <Section>
        <Grid layout="products">
          {results.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
            />
          ))}
        </Grid>
      </Section>
    </SearchPage>
  );
}

function SearchPage({query, children}) {
  return (
    <Layout>
      <PageHeader>
        <Heading as="h1" size="copy">
          Search
        </Heading>
        <form className="relative flex w-full text-heading">
          <Input
            defaultValue={query}
            placeholder="Search…"
            type="search"
            variant="search"
            name="q"
          />
          <button className="absolute right-0 py-2" type="submit">
            Go
          </button>
        </form>
      </PageHeader>
      {children}
    </Layout>
  );
}

const SEARCH_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query search(
    $query: String
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
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;
