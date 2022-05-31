import {
  useSession,
  useShopQuery,
  useShop,
  Seo,
  CacheDays,
  gql,
} from '@shopify/hydrogen';

import {Suspense} from 'react';

import {DefaultLayout as Layout} from '~/components/layouts';

import {
  Hero,
  FeaturedCollections,
  ProductSwimlane,
  Locations,
} from '~/components/sections';

import {MEDIA_FIELDS} from '~/lib/fragments';

export default function Homepage() {
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

  // TODO: Make Hero Banners match to collections if these don't
  const heroBanners = data?.metaobjects?.nodes;

  return (
    <Layout>
      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>
      <Hero data={heroBanners[0]} height="full" top />
      <FeaturedCollections title="Collections" />
      {heroBanners[1] && <Hero data={heroBanners[1]} />}
      <ProductSwimlane title="Featured Products" />
      <Locations />
    </Layout>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: SEO_QUERY,
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

const SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;

const QUERY = gql`
  ${MEDIA_FIELDS}
  query homepage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(type: "hero_banners", first: 2) {
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
  }
`;
