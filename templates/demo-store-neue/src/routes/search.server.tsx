import {
  gql,
  HydrogenRouteProps,
  useLocalization,
  useShopQuery,
  useUrl,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {
  FeaturedCollections,
  Grid,
  Heading,
  Input,
  Layout,
  PageHeader,
  ProductCard,
  ProductSwimlane,
  Section,
  Text,
} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import {Suspense} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

export default function Search({
  pageBy = 12,
  params,
}: {
  pageBy?: number;
  params: HydrogenRouteProps['params'];
}) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {handle} = params;
  const {searchParams} = useUrl();

  const query = searchParams.get('q');

  const {data} = useShopQuery<any>({
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

  const results = data?.products?.nodes as Product[];

  if (!query || results.length === 0) {
    return (
      <SearchPage query={query ? decodeURI(query) : null}>
        {results.length === 0 && (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        )}
        <NoResultRecommendation country={countryCode} language={languageCode} />
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

function SearchPage({
  query,
  children,
}: {
  query?: string | null;
  children: React.ReactNode;
}) {
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

function NoResultRecommendation({
  country,
  language,
}: {
  country: string;
  language: string;
}) {
  const {data} = useShopQuery<any>({
    query: SEARCH_NO_RESULTS_QUERY,
    variables: {
      country,
      language,
    },
    preload: false,
  });

  return (
    <Suspense>
      <FeaturedCollections
        title="Trending Collections"
        data={data.featuredCollections.nodes}
      />
      <ProductSwimlane
        title="Trending Products"
        data={data.featuredProducts.nodes}
      />
    </Suspense>
  );
}

const SEARCH_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
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
  }
`;

const SEARCH_NO_RESULTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query searchNoResult($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
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
