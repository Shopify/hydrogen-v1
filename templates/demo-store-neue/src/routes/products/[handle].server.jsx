import {Suspense} from 'react';
import {
  gql,
  ProductOptionsProvider,
  ShopifyAnalyticsConstants,
  useRouteParams,
  useServerAnalytics,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {
  Heading,
  Layout,
  NotFound,
  ProductForm,
  ProductGallery,
  ProductInfo,
  ProductSwimlane,
  Section,
  Text,
} from '~/components';

export default function Product() {
  const {handle} = useRouteParams();
  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();

  const {
    data: {product},
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound type="product" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: product.id,
    },
  });

  return (
    <Layout>
      <ProductOptionsProvider data={product}>
        <Section padding="x" className="px-0">
          <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
            <ProductGallery
              media={product.media.nodes}
              className="w-screen md:w-full lg:col-span-2"
            />
            <section className="sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
              <div className="grid gap-2">
                <Heading as="h1" className="whitespace-normal">
                  {product.title}
                </Heading>
                {product.vendor && (
                  <Text className={'opacity-50 font-medium'}>
                    {product.vendor}
                  </Text>
                )}
              </div>
              <ProductForm />
              <ProductInfo />
            </section>
          </div>
        </Section>
        <Suspense>
          <ProductSwimlane title="Related Products" data={product.id} />
        </Suspense>
      </ProductOptionsProvider>
    </Layout>
  );
}

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
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
      media(first: 7) {
        nodes {
          ...MediaFields
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          compareAtPriceV2 {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
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
