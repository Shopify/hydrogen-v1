import {
  useSession,
  useShop,
  useShopQuery,
  Seo,
  useRouteParams,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  ProductOptionsProvider,
} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
import {Section, ProductSwimlane} from '~/components/sections';
import {Heading, Text} from '~/components/elements';
import {
  ProductGallery,
  ProductForm,
  ProductInfo,
} from '~/components/sections/products';
import {NotFound} from '~/components/pages';
import {MEDIA_FIELDS} from '~/lib/fragments';

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

  useServerAnalytics(
    product
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.product,
            resourceId: product.id,
          },
        }
      : null,
  );

  if (!product) {
    return <NotFound type="product" />;
  }

  return (
    <Layout>
      <ProductOptionsProvider data={product}>
        <Section className="pb-6 md:p-8 lg:p-12">
          <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
            <ProductGallery
              media={product.media.nodes}
              className="w-full lg:col-span-2"
            />
            <section className="sticky py-4 px-4 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
              <Heading as="h1">{product.title}</Heading>
              {product.vendor && (
                <Text className={'opacity-50 font-medium'}>
                  {product.vendor}
                </Text>
              )}
              <ProductForm />
              <ProductInfo />
            </section>
          </div>
        </Section>
        <ProductSwimlane title="Related Products" data={product.id} />
      </ProductOptionsProvider>
    </Layout>
  );
}

const QUERY = gql`
  ${MEDIA_FIELDS}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      description
      media(first: 14) {
        nodes {
          ...MediaFields
        }
      }
      variants(first: 100) {
        nodes {
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
      seo {
        description
        title
      }
    }
  }
`;
