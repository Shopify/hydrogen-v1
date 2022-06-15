import {useSession, useShop, useShopQuery, gql} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {PageHeader, Button, Grid, Text, Section} from '~/components/elements';
import {ProductCard} from '~/components/blocks';
import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';
import {getImageLoadingPriority} from '~/lib/const';

export default function AllProducts({pageBy = 12}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data} = useShopQuery({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      pageBy,
    },
    preload: true,
  });

  const products = data.products.nodes;
  const hasNextPage = data.products.pageInfo.hasNextPage;

  return (
    <Layout>
      <PageHeader heading="All Products" variant="allCollections">
        <div className="inline-block">
          <div className="flex items-baseline justify-between w-full">
            <div className="flex items-baseline justify-end gap-4 md:gap-6 lg:gap-8">
              {/* TODO: This will only get the amount on the page, not the total amount. I don't think you actually can grab the total number of products in a collection today. */}
              <Text>{products.length}</Text>
              {/* TODO: Convert to Filter dropdown */}
              <button className="inline-block pb-px leading-none border-b border-primary">
                Filters
              </button>
            </div>
          </div>
        </div>
      </PageHeader>
      <Section>
        <Grid>
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
            />
          ))}
        </Grid>
      </Section>
      <Section>{hasNextPage && <Button>Load More</Button>}</Section>
    </Layout>
  );
}

const ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query CollectionDetails(
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
