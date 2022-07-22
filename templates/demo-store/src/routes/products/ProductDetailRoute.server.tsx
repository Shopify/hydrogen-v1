import {Suspense} from 'react';
import {
  gql,
  ProductOptionsProvider,
  ShopifyAnalyticsConstants,
  Seo,
  useLocalization,
  useServerAnalytics,
  useShopQuery,
  type HydrogenRouteProps,
  RSCSubRoute,
  Link,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {getExcerpt} from '~/lib/utils';
import {NotFound, ProductSwimlane} from '~/components/index.server';
import {
  Heading,
  ProductDetail,
  ProductForm,
  ProductGallery,
  Section,
  Text,
} from '~/components';
import ProductRecommendationRoute from '../sub-routes/ProductRecommendationRoute.server';

export default function ProductDetailRoute({handle}: HydrogenRouteProps) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {
    data: {product, shop},
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

  const {media, title, vendor, descriptionHtml, id} = product;
  const {shippingPolicy, refundPolicy} = shop;

  return (
    <>
      <Seo type="product" data={product} />
      <ProductOptionsProvider data={product}>
        <Section padding="x" className="px-0">
          <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
            <ProductGallery
              media={media.nodes}
              className="w-screen md:w-full lg:col-span-2"
            />
            <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
              <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                <div className="grid gap-2">
                  <Heading as="h1" format className="whitespace-normal">
                    {title}
                  </Heading>
                  {vendor && (
                    <Text className={'opacity-50 font-medium'}>{vendor}</Text>
                  )}
                </div>
                <div className="">
                  <div className="flex gap-4">
                    <Link
                      className="bg-primary rounded text-contrast py-2 px-4 focus:shadow-outline block w-full"
                      to="products/snowboard"
                      prefetch={false}
                    >
                      Product A - Snowboard
                    </Link>
                    <Link
                      className="bg-primary rounded text-contrast py-2 px-4 focus:shadow-outline block w-full"
                      to="products/the-full-stack"
                      prefetch={false}
                    >
                      Product B - The Full Stack
                    </Link>
                  </div>
                </div>
                <ProductForm />
                <div className="grid gap-4 py-4">
                  {descriptionHtml && (
                    <ProductDetail
                      title="Product Details"
                      content={descriptionHtml}
                    />
                  )}
                  {shippingPolicy?.body && (
                    <ProductDetail
                      title="Shipping"
                      content={getExcerpt(shippingPolicy.body)}
                      learnMore={`/policies/${shippingPolicy.handle}`}
                    />
                  )}
                  {refundPolicy?.body && (
                    <ProductDetail
                      title="Returns"
                      content={getExcerpt(refundPolicy.body)}
                      learnMore={`/policies/${refundPolicy.handle}`}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </Section>
        <RSCSubRoute
          state={{id}}
          path="sub-routes/ProductRecommendationRoute"
          page={<ProductRecommendationRoute id={id} />}
        />
      </ProductOptionsProvider>
    </>
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
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
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
          compareAtPriceV2 {
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
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;
