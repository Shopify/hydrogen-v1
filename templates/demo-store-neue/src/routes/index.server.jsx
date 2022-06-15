import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';

import {Layout, FeaturedCollections, Hero, ProductSwimlane} from '~/components';

import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

export default function Homepage({request}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data} = useShopQuery({
    query: HOMEPAGE_CONTENT_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {heroBanners, featuredCollections, featuredProducts} = data;

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.home,
    },
  });

  return (
    <Layout>
      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>
      <div className="bg-white p-4">
        <p>Your IP is: {request.headers.get('oxygen-buyer-ip')}</p>
        <p>
          Lat/Long: {request.headers.get('oxygen-buyer-latitude')} /{' '}
          {request.headers.get('oxygen-buyer-longitude')}
        </p>
        <p>
          You live in {request.headers.get('oxygen-buyer-city')},{' '}
          {request.headers.get('oxygen-buyer-region-code')}
        </p>
        <p>
          Which is a part of {request.headers.get('oxygen-buyer-country')} on
          the continent {request.headers.get('oxygen-buyer-continent')}
        </p>
         <p>
          Is this also the pattern for HTTP headers, such as {request.headers.get('accept-language')}?
        </p>
      </div>
      {heroBanners?.nodes[0] && (
        <Hero data={heroBanners?.nodes[0]} height="full" top />
      )}
      <ProductSwimlane
        data={featuredProducts.nodes}
        title="Featured Products"
        divider="bottom"
      />
      {heroBanners?.nodes[1] && <Hero data={heroBanners.nodes[1]} />}
      <FeaturedCollections
        data={featuredCollections.nodes}
        title="Collections"
      />
    </Layout>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: HOMEPAGE_SEO_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  // TODO: SEO for Homepage doesn't have the titleTemplate prop and so it presents poorly.
  // The SEO Component as a whole should get another look at.
  return (
    <Seo
      type="homepage"
      data={{
        title,
        description,
      }}
    />
  );
}

const HOMEPAGE_SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;

const HOMEPAGE_CONTENT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    heroBanners: collections(
      first: 10
      query: "collection_type:custom"
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        handle
        title: metafield(namespace: "hero", key: "title") {
          value
        }
        byline: metafield(namespace: "hero", key: "byline") {
          value
        }
        cta: metafield(namespace: "hero", key: "cta") {
          value
        }
        spread: metafield(namespace: "hero", key: "spread") {
          reference {
            ...MediaFields
          }
        }
        spread_secondary: metafield(
          namespace: "hero"
          key: "spread_secondary"
        ) {
          reference {
            ...MediaFields
          }
        }
        text_color: metafield(namespace: "hero", key: "text_color") {
          value
        }
      }
    }
    featuredCollections: collections(
      first: 3
      query: "collection_type:smart"
      sortKey: UPDATED_AT
    ) {
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
