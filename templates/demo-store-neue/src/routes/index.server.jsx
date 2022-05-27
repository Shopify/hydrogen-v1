import {useShopQuery, Seo, CacheDays, gql} from '@shopify/hydrogen';

import {Suspense} from 'react';

import {DefaultLayout as Layout} from '~/components/layouts';

import {
  Hero,
  FeaturedCollections,
  ProductSwimlane,
  Locations,
} from '~/components/sections';

export default function Homepage() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>
      <Hero height="full" top />
      <FeaturedCollections title="Collections" />
      <ProductSwimlane title="Featured Products" />
      <Hero />
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
