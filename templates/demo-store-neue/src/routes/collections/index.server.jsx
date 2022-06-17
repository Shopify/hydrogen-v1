import {useShopQuery, useLocalization, gql} from '@shopify/hydrogen';

import {Layout, CollectionCard, PageHeader, Section, Grid} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';

export default function Collections() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: COLLECTIONS_QUERY,
    variables: {
      pageBy: 12,
      country: countryCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data.collections.nodes;

  return (
    <Layout>
      <PageHeader heading="Collections" />
      <Section>
        <Grid items={collections.length === 3 ? 3 : 2}>
          {collections.map((collection, i) => (
            <CollectionCard
              collection={collection}
              key={collection.id}
              loading={getImageLoadingPriority(i, 2)}
            />
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

const COLLECTIONS_QUERY = gql`
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    collections(first: $pageBy) {
      nodes {
        id
        title
        description
        handle
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
      }
    }
  }
`;
