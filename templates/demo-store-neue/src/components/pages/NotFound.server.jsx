import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';

import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';
import {Layout} from '~/components/layouts';
import {PageHeader, Text, Button} from '~/components/elements';
import {FeaturedCollections, ProductSwimlane} from '~/components/sections';

export function NotFound({type = 'page'}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data} = useShopQuery({
    query: NOT_FOUND_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const heading = `We’ve lost this ${type}`;
  const description = `We couldn’t find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;
  const {featuredCollections, featuredProducts} = data;
  return (
    <Layout>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </Button>
      </PageHeader>
      <FeaturedCollections
        title="Popular Collections"
        data={featuredCollections.nodes}
      />
      <ProductSwimlane data={featuredProducts.nodes} />
    </Layout>
  );
}

const NOT_FOUND_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query homepage($country: CountryCode, $language: LanguageCode)
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
