import {Suspense} from 'react';
import {
  useSession,
  useShopQuery,
  useShop,
  Seo,
  CacheDays,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import {Layout} from '~/components/layouts';
import {
  Hero,
  FeaturedCollections,
  ProductSwimlane,
  Locations,
} from '~/components/sections';

import {
  LOCATION_CARD_FIELDS,
  MEDIA_FIELDS,
  PRODUCT_CARD_FIELDS,
} from '~/lib/fragments';

export default function Homepage() {
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

  // TODO: Make Hero Banners match to collections if these don't
  // const heroBanners = data?.heroBanners?.nodes;

  const {heroBanners, featuredCollections, featuredProducts, locations} = data;

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
      {heroBanners?.nodes[0] && (
        <Hero data={heroBanners?.nodes[0]} height="full" top />
      )}
      <FeaturedCollections
        data={featuredCollections.nodes}
        title="Collections"
      />
      {heroBanners?.nodes[1] && <Hero data={heroBanners.nodes[1]} />}
      <ProductSwimlane
        data={featuredProducts.nodes}
        title="Featured Products"
        divider="bottom"
      />
      <Locations data={locations.nodes} />
    </Layout>
  );
}

Homepage.displayName = 'Homepage';

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: HOMEPAGE_SEO_QUERY,
    cache: CacheDays(),
    preload: true,
  });

  // TODO: SEO for Homepage doesn't have the titleTemplate prop and so it presents poorly. The SEO Component as a whole should get another look at.
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

SeoForHomepage.displayName = 'SeoForHomepage';

const HOMEPAGE_SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;

const HOMEPAGE_CONTENT_QUERY = gql`
  ${MEDIA_FIELDS}
  ${PRODUCT_CARD_FIELDS}
  ${LOCATION_CARD_FIELDS}
  query homepage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    heroBanners: contentEntries(type: "hero_banners", first: 2) {
      nodes {
        title: field(key: "title") {
          value
        }
        byline: field(key: "byline") {
          value
        }
        cta: field(key: "cta") {
          value
        }
        url: field(key: "url") {
          value
        }
        spread: field(key: "spread") {
          reference {
            ...MediaFields
          }
        }
        spread_secondary: field(key: "spread_secondary") {
          reference {
            ...MediaFields
          }
        }
        text_color: field(key: "text_color") {
          value
        }
      }
    }
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
    locations: contentEntries(first: 3, type: "stores") {
      nodes {
        ...LocationCardFields
      }
    }
  }
`;
