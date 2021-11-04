import {
  useShopQuery,
  flattenConnection,
  ProductProviderFragment,
  Image,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../components/Layout.server';
import FeaturedCollection from '../components/FeaturedCollection.server';
import CollectionHero from '../components/CollectionHero.client';
import ProductCard from '../components/ProductCard.server';
import StyledLink from '../components/StyledLink';

export default function Home({country = {isoCode: 'US'}}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
    },
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const heroCollection = collections && collections[0];
  const featuredCollection =
    collections && collections.length > 1 ? collections[1] : collections[0];
  const featuredProducts = flattenConnection(featuredCollection.products);

  return (
    <Layout hero={<CollectionHero collection={heroCollection} />}>
      <div className="flex justify-between items-center mb-8">
        <span className="text-small text-black uppercase tracking-wider font-bold font-mono">
          {featuredCollection.title}
        </span>
        <span className="hidden md:inline-flex">
          <StyledLink
            url={`/collections/${featuredCollection.handle}`}
            value="Shop All"
          />
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {featuredProducts.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="md:hidden mb-16 text-center">
        <StyledLink
          url={`/collections/${featuredCollection.handle}`}
          value="Shop All"
        />
      </div>

      <FeaturedCollection collection={featuredCollection} />
    </Layout>
  );
}

const QUERY = gql`
  query indexContent(
    $country: CountryCode
    $numCollections: Int = 2
    $numProducts: Int = 3
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 1
    $numProductVariantMetafields: Int = 10
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    collections(first: $numCollections) {
      edges {
        node {
          descriptionHtml
          handle
          id
          title
          image {
            ...ImageFragment
          }
          products(first: $numProducts) {
            edges {
              node {
                ...ProductProviderFragment
              }
            }
          }
        }
      }
    }
  }

  ${ProductProviderFragment}
  ${Image.Fragment}
`;
