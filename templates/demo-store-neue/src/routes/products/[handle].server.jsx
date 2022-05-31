import {
  useSession,
  useShop,
  useShopQuery,
  Seo,
  useRouteParams,
  gql,
  ProductProvider,
} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
import {PageHeader, Section} from '~/components/sections';
import {Heading, Text, Button} from '~/components/elements';
import ProductGallery from '~/components/sections/ProductGallery.client';
import ProductForm from '~/components/sections/ProductForm.client';

export default function Product() {
  const {handle} = useRouteParams();
  const {countryCode = 'US'} = useSession();

  const {languageCode} = useShop();

  const {
    data: {product},
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound />;
  }

  return (
    <ProductProvider data={product}>
      <Layout>
        <ProductGallery />
        <section>
          <Heading as="h1">{product.title}</Heading>
          {product.vendor && <Text>{product.vendor}</Text>}
          <ProductForm />
          <div></div>
        </section>
        <section>Related products</section>
      </Layout>
    </ProductProvider>
  );
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product: product(handle: $handle) {
      id
      title
      vendor
      description
      media(first: 14) {
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
            ... on Model3d {
              mediaContentType
              id
              alt
              mediaContentType
              previewImage {
                url
              }
              sources {
                url
              }
            }
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            availableForSale
            compareAtPriceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            id
            image {
              id
              url
              altText
              width
              height
            }
            priceV2 {
              amount
              currencyCode
            }
            sku
            title
            unitPrice {
              amount
              currencyCode
            }
          }
        }
      }

      seo {
        description
        title
      }
    }
  }
`;
