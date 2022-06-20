import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {FeaturedCollections, Hero} from '~/components';
// Why export Layout and ProductSwimLane from the index file? Two lines, two different import strategies.
import {Layout, ProductSwimlane} from '~/components/index.server';

import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {
  CollectionConnection,
  ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';

export default function Homepage() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery<{
    heroBanners: CollectionConnection;
    featuredCollections: CollectionConnection;
    featuredProducts: ProductConnection;
  }>({
    query: HOMEPAGE_CONTENT_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {heroBanners, featuredCollections, featuredProducts} = data;
  const [primaryHero, secondaryHero, tertiaryHero] = heroBanners.nodes || [
    // I get we need to destructure this way but an array of three nulls looks kinda...hmm wut:
    null,
    null,
    null,
  ];

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
      {primaryHero && (
        <Hero data={primaryHero} height="full" top loading="eager" />
      )}
      <ProductSwimlane
        data={featuredProducts.nodes}
        title="Featured Products"
        divider="bottom"
      />
      {secondaryHero && <Hero data={secondaryHero} />}
      <FeaturedCollections
        data={featuredCollections.nodes}
        title="Collections"
      />
      {tertiaryHero && <Hero data={tertiaryHero} />}
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

/**
 * Wondering if we need some heuristics for grouping queries with the functions they're used by.
 * In this case, HOMEPAGE_SEO_QUERY comes first, and HOMEPAGE_CONTENT_QUERY comes second.
 * However, above, the Homepage content function comes first and the SEO function comes second; the order is reversed.
 * Additionally, would it be helpful to group the query and its associated function together
 * closer in the file?
 * Finally, should these be split out and then imported as components to keep this file from sprawling?
 */


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
      first: 3
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
        spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
          reference {
            ...MediaFields
          }
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
