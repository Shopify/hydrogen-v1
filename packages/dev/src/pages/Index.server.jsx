import {
  useShopQuery,
  flattenConnection,
  ProductProviderFragment,
  Image,
  Link,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../components/Layout.server';
import FeaturedCollection from '../components/FeaturedCollection.server';
import ProductCard from '../components/ProductCard.server';
import Welcome from '../components/Welcome.server';

function Hero() {
  return (
    <div className="fixed top-0 w-full h-1/4">
      <svg
        viewBox="0 0 1440 691"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#a)">
          <path d="M1440 0H0v691h1440V0Z" fill="#7CFBEE" />
          <g filter="url(#b)">
            <path
              d="M1246.5 486.259c300.72 0 544.5-207.966 544.5-464.505 0-256.54-243.78-464.506-544.5-464.506-300.719 0-544.5 207.966-544.5 464.506 0 256.539 243.781 464.505 544.5 464.505Z"
              fill="#4F98D0"
            />
            <path
              d="M868.5 971.239c300.72 0 544.5-207.967 544.5-464.506S1169.22 42.228 868.5 42.228c-300.719 0-544.5 207.966-544.5 464.505s243.781 464.506 544.5 464.506Z"
              fill="#7CFBEE"
            />
            <path
              d="M267 884.224c300.719 0 544.5-207.966 544.5-464.506 0-256.539-243.781-464.505-544.5-464.505s-544.5 207.966-544.5 464.505c0 256.54 243.781 464.506 544.5 464.506Z"
              fill="#4F98D0"
            />
            <path
              d="M735 529.766c300.72 0 544.5-207.966 544.5-464.505S1035.72-399.245 735-399.245c-300.719 0-544.5 207.967-544.5 464.506S434.281 529.766 735 529.766Z"
              fill="#4F98D0"
            />
            <path
              d="M531 728.109c300.719 0 544.5-207.966 544.5-464.505 0-256.54-243.781-464.506-544.5-464.506S-13.5 7.064-13.5 263.604c0 256.539 243.781 464.505 544.5 464.505Z"
              fill="#7CFBEE"
            />
            <path
              d="M945 680.763c300.72 0 544.5-207.966 544.5-464.505 0-256.54-243.78-464.506-544.5-464.506-300.719 0-544.5 207.966-544.5 464.506 0 256.539 243.781 464.505 544.5 464.505Z"
              fill="#4F98D0"
            />
          </g>
        </g>
        <path
          transform="rotate(180 1440 691)"
          fill="url(#c)"
          d="M1440 691h1440v691H1440z"
        />
        <defs>
          <linearGradient
            id="c"
            x1="2160"
            y1="691"
            x2="2160"
            y2="1527.73"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F9FAFB" />
            <stop offset="1" stopColor="#F9FAFB" stopOpacity="0" />
          </linearGradient>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h1440v691H0z" />
          </clipPath>
          <filter
            id="b"
            x="-603.5"
            y="-768.752"
            width="2720.5"
            height="2065.99"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="0"
              result="effect1_foregroundBlur_1100:41110"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default function Index({country = {isoCode: 'US'}}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
    },
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const featuredProducts = flattenConnection(collections[0].products);
  const featuredCollection =
    collections && collections.length > 1 ? collections[1] : collections[0];

  return (
    <Layout hero={<Hero />}>
      <div className="relative mb-12">
        <Welcome />
        <div className="bg-white p-8 shadow-xl rounded-xl mb-10">
          <div className="flex justify-between items-center mb-8 text-lg font-medium">
            <span className="text-black uppercase">
              {featuredCollection.title}
            </span>
            <span className="hidden md:inline-flex">
              <Link
                to={`/collections/${featuredCollection.handle}`}
                className="text-blue-600"
              >
                Shop all
              </Link>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="md:hidden text-center">
            <Link
              to={`/collections/${featuredCollection.handle}`}
              className="text-blue-600"
            >
              Shop all
            </Link>
          </div>
        </div>
        <FeaturedCollection collection={featuredCollection} />
      </div>
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
          description
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
