import {
  useShopQuery,
  Seo,
  useRouteParams,
  useQuery,
  Image,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';
import {Suspense} from 'react';
import ProductCard from '../../components/ProductCard';

export default function Product({country = {isoCode: 'US'}}) {
  const {handle} = useRouteParams();

  const {
    data: {product},
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo type="product" data={product} />
      <ProductDetails product={product} />
      {/* NOTE: Realistically, you might not wrap each one of these in a suspense boundary,
      as it could cause UI thrash. But this is just a demo. */}
      <Suspense fallback={<GenericFallback />}>
        <SocialVideo />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts title="New Arrivals" endpoint="/new_arrivals" />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts
          title="Recommend for you"
          endpoint="/recommendations/user"
        />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts
          title="Products related to this item"
          endpoint="/recommendations/product"
        />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts
          title="Customers who viewed this item also viewed"
          endpoint="/recommendations/others"
        />
      </Suspense>
    </Layout>
  );
}

function GenericFallback() {
  return <div className="h-48 w-full bg-gray-300" />;
}

function useFetch(endpoint) {
  const {data} = useQuery(endpoint, async () =>
    fetch(endpoint).then((r) => r.json()),
  );

  return data;
}

function RelatedProducts({title = 'New Arrivals', endpoint}) {
  const products = useFetch(
    `https://fake-commerce-api.jplhomer.workers.dev${endpoint}`,
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-md font-medium">
        <span className="text-black uppercase">{title}</span>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialVideo() {
  const videos = useFetch(
    `https://fake-commerce-api.jplhomer.workers.dev/videos`,
  );
  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-md font-medium">
        <span className="text-black uppercase">Videos from Social Media</span>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 cursor-pointer">
        {videos.map((video, index) => (
          <li
            key={video.image}
            className={
              'relative ' +
              (index > 1 ? 'hidden md:flex' : index > 0 ? 'hidden lg:flex' : '')
            }
          >
            <Image
              className="w-full"
              alt={'social video ' + index}
              src={video.image}
            />
            <svg
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="absolute opacity-70 hover:opacity-90 transition-opacity"
              style={{
                width: 84,
                height: 84,
                left: 'calc(50% - 42px)',
                top: 'calc(50% - 42px)',
                color: 'white',
                fill: 'currentcolor',
              }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reviews() {
  const reviews = useFetch(
    'https://fake-commerce-api.jplhomer.workers.dev/reviews',
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-md font-medium">
        <span className="text-black uppercase">Reviews</span>
      </div>

      <ul className="mb-16">
        {reviews.map((review) => (
          <li key={review.id} className="mb-8">
            <Rating rating={review.rating} />
            <div className="mt-2 text-gray-500">
              Reviewed in the United States on {review.createdAt} by{' '}
              {review.name}
            </div>
            <div className="mt-2">{review.review}</div>
            <div className="mt-2 mb-2 text-gray-500">
              {review.helpful} people found this helpful
            </div>
            <button className="inline-block px-2.5 py-1.5 bg-gray-200 text-gray-700 font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
              Helpful
            </button>{' '}
            | <button>Report abuse</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyStar() {
  return (
    <li>
      <svg
        focusable="false"
        dataprefix="far"
        dataicon="star"
        className="w-4 text-yellow-500"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path
          fill="currentColor"
          d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"
        ></path>
      </svg>
    </li>
  );
}

function FilledStar() {
  return (
    <li>
      <svg
        focusable="false"
        dataprefix="fas"
        dataicon="star"
        className="w-4 text-yellow-500 mr-1"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path
          fill="currentColor"
          d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
        ></path>
      </svg>
    </li>
  );
}

function Rating({rating}) {
  return (
    <ul className="flex">
      {rating > 0 ? <FilledStar /> : <EmptyStar />}
      {rating > 1 ? <FilledStar /> : <EmptyStar />}
      {rating > 2 ? <FilledStar /> : <EmptyStar />}
      {rating > 3 ? <FilledStar /> : <EmptyStar />}
      {rating > 4 ? <FilledStar /> : <EmptyStar />}
    </ul>
  );
}

const QUERY = gql`
  query product($country: CountryCode, $handle: String!)
  @inContext(country: $country) {
    product: product(handle: $handle) {
      compareAtPriceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      description
      descriptionHtml
      featuredImage {
        url
        width
        height
        altText
      }
      handle
      id
      media(first: 6) {
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
            ... on Model3d {
              mediaContentType
              id
              alt
              mediaContentType
              previewImage {
                url
              }
              sources {
                url
              }
            }
          }
        }
      }
      metafields(first: 20) {
        edges {
          node {
            id
            type
            namespace
            key
            value
            createdAt
            updatedAt
            description
            reference {
              __typename
              ... on MediaImage {
                id
                mediaContentType
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
      priceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      seo {
        description
        title
      }
      title
      variants(first: 250) {
        edges {
          node {
            availableForSale
            compareAtPriceV2 {
              amount
              currencyCode
            }
            id
            image {
              id
              url
              altText
              width
              height
            }
            metafields(first: 10) {
              edges {
                node {
                  id
                  type
                  namespace
                  key
                  value
                  createdAt
                  updatedAt
                  description
                  reference {
                    __typename
                    ... on MediaImage {
                      id
                      mediaContentType
                      image {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
            priceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            sku
            title
            unitPrice {
              amount
              currencyCode
            }
            unitPriceMeasurement {
              measuredType
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }
          }
        }
      }
      vendor
    }
  }
`;
