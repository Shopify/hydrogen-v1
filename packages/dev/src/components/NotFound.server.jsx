import {
  useShopQuery,
  ProductProviderFragment,
  flattenConnection,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from './Layout.server';
import Button from './Button.client';
import ProductCard from './ProductCard.server';

function NotFoundHero() {
  return (
    <div
      className="background-repeat py-16 border-b-2 border-black"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='216' height='202' viewBox='0 0 216 202' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23a)' stroke='%23000' stroke-opacity='.5'%3E%3Cpath d='M43.5 1v200M86.5 1v200M129.5 1v200M172.5 1v201M215.5 2e-8V207M2e-8 165H215M2e-8 122H215M2e-8 79H215M2e-8 36H215M2e-8 .5 215 .500009'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h216v202H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
      }}
    >
      <div className="max-w-3xl mx-4 md:mx-auto">
        <div className="p-8 md:p-16 my-8 bg-white border-2 border-black">
          <p className="text-black text-sm font-bold font-mono mb-3 uppercase">
            404
          </p>
          <h1 className="text-black text-2xl md:text-5xl font-black mb-4">
            Page not found
          </h1>
          <p className="text-2xl text-black">
            We couldn’t find the page you’re looking for. Try checking the URL
            or heading back to the home page.
          </p>
        </div>
        <Button
          url="/"
          label="Take me to the home page"
          className="w-full md:w-auto"
        />
      </div>
    </div>
  );
}

export default function NotFound({country = {isoCode: 'US'}}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      numProductMetafields: 0,
      numProductVariants: 250,
      numProductMedia: 0,
      numProductVariantMetafields: 0,
      numProductVariantSellingPlanAllocations: 0,
      numProductSellingPlanGroups: 0,
      numProductSellingPlans: 0,
    },
  });
  const products = data ? flattenConnection(data.products) : [];

  return (
    <Layout hero={<NotFoundHero />}>
      <div className="my-8">
        <p className="mb-8 text-sm text-black font-bold font-mono tracking-wider uppercase">
          Products you might like
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query NotFoundProductDetails(
    $country: CountryCode
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
  ) @inContext(country: $country) {
    products(first: 3) {
      edges {
        node {
          ...ProductProviderFragment
        }
      }
    }
  }

  ${ProductProviderFragment}
`;
