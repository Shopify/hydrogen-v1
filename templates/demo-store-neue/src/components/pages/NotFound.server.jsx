import {useShopQuery, useShop, useSession, gql} from '@shopify/hydrogen';
import {DefaultLayout as Layout} from '~/components/layouts';
import {
  PageHeader,
  FeaturedCollections,
  ProductSwimlane,
  Locations,
} from '~/components/sections';
import {Text, Button} from '~/components/elements';

import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';

export default function NotFound({type = 'page'}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const heading = `We’ve lost this ${type}`;
  const description = `We couldn’t find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;
  const {featuredCollections, featuredProducts, locations} = data;
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
      <Locations data={locations.nodes} />
    </Layout>
  );
}

const QUERY = gql`
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
    locations: metaobjects(first: 3, type: "stores") {
      nodes {
        id
        featured_image: field(key: "featured_image") {
          reference {
            ... on MediaImage {
              image {
                url
                width
                height
              }
            }
          }
        }
        title: field(key: "title") {
          value
        }
        address: field(key: "address") {
          value
        }
        hours: field(key: "hours") {
          value
        }
        email: field(key: "email") {
          value
        }
        phone: field(key: "phone") {
          value
        }
      }
    }
  }
`;
