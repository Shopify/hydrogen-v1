import {useShopQuery, flattenConnection, Seo} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import LoadMoreProducts from '../../components/LoadMoreProducts.client';
import Layout from '../../components/Layout.server';
import ProductCard from '../../components/ProductCard';
import NotFound from '../../components/NotFound.server';

export default function Collection({
  country = {isoCode: 'US'},
  collectionProductCount = 24,
  params,
}) {
  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      country: country.isoCode,
      numProducts: collectionProductCount,
    },
    preload: true,
  });

  if (data?.collection == null) {
    return <NotFound />;
  }

  const collection = data.collection;
  const products = flattenConnection(collection.products);
  const hasNextPage = data.collection.products.pageInfo.hasNextPage;

  return (
    <Layout>
      {/* the seo object will be expose in API version 2022-04 or later */}
      <Seo type="collection" data={collection} />
      <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 mt-6">
        {collection.title}
      </h1>
      <div
        dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
        className="text-lg"
      />
      <p className="text-sm text-gray-500 mt-5 mb-5">
        {products.length} {products.length > 1 ? 'products' : 'product'}
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <LoadMoreProducts startingCount={collectionProductCount} />
      )}
    </Layout>
  );
}

const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $numProducts: Int!
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 0
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    collection(handle: $handle) {
      id
      title
      descriptionHtml
      ...CollectionSeoFragment
      products(first: $numProducts) {
        edges {
          node {
            vendor
            ...ProductProviderFragment
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  fragment CollectionSeoFragment on Collection {
    title
    description
    seo {
      ...SeoFragment
    }
    image {
      ...ImageSeoFragment
    }
  }
  fragment ImageSeoFragment on Image {
    url
    width
    height
    altText
  }

  fragment SeoFragment on SEO {
    description
    title
  }

  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }

  fragment ProductProviderFragment on Product {
    compareAtPriceRange {
      maxVariantPrice {
        ...MoneyFragment
      }
      minVariantPrice {
        ...MoneyFragment
      }
    }
    descriptionHtml
    handle
    id
    media(first: $numProductMedia) {
      edges {
        node {
          ...MediaFileFragment
        }
      }
    }
    metafields(first: $numProductMetafields) {
      edges {
        node {
          ...MetafieldFragment
        }
      }
    }
    priceRange {
      maxVariantPrice {
        ...MoneyFragment
      }
      minVariantPrice {
        ...MoneyFragment
      }
    }
    title
    variants(first: $numProductVariants) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
    sellingPlanGroups(first: $numProductSellingPlanGroups) {
      edges {
        node {
          ...SellingPlanGroupsFragment
        }
      }
    }
  }

  fragment MediaFileFragment on Media {
    ... on MediaImage {
      mediaContentType
      image {
        ...ImageFragment
      }
    }
    ... on Video {
      mediaContentType
      ...VideoFragment
    }
    ... on ExternalVideo {
      mediaContentType
      ...ExternalVideoFragment
    }
    ... on Model3d {
      mediaContentType
      ...Model3DFragment
    }
  }

  fragment MetafieldFragment on Metafield {
    id
    type
    namespace
    key
    value
    createdAt
    updatedAt
    description
    reference @include(if: $includeReferenceMetafieldDetails) {
      __typename
      ... on MediaImage {
        id
        mediaContentType
        image {
          ...ImageFragment
        }
      }
    }
  }

  fragment VariantFragment on ProductVariant {
    id
    title
    availableForSale
    image {
      ...ImageFragment
    }
    ...UnitPriceFragment
    priceV2 {
      ...MoneyFragment
    }
    compareAtPriceV2 {
      ...MoneyFragment
    }
    selectedOptions {
      name
      value
    }
    metafields(first: $numProductVariantMetafields) {
      edges {
        node {
          ...MetafieldFragment
        }
      }
    }
    sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
      edges {
        node {
          priceAdjustments {
            compareAtPrice {
              ...MoneyFragment
            }
            perDeliveryPrice {
              ...MoneyFragment
            }
            price {
              ...MoneyFragment
            }
            unitPrice {
              ...MoneyFragment
            }
          }
          sellingPlan {
            ...SellingPlanFragment
          }
        }
      }
    }
  }

  fragment SellingPlanGroupsFragment on SellingPlanGroup {
    sellingPlans(first: $numProductSellingPlans) {
      edges {
        node {
          ...SellingPlanFragment
        }
      }
    }
    appName
    name
    options {
      name
      values
    }
  }
  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment VideoFragment on Video {
    id
    previewImage {
      url
    }
    sources {
      mimeType
      url
    }
  }

  fragment ExternalVideoFragment on ExternalVideo {
    id
    embedUrl
    host
  }

  fragment Model3DFragment on Model3d {
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

  fragment SellingPlanFragment on SellingPlan {
    id
    description
    name
    options {
      name
      value
    }
    priceAdjustments {
      orderCount
      adjustmentValue {
        ... on SellingPlanFixedAmountPriceAdjustment {
          adjustmentAmount {
            ...MoneyFragment
          }
        }
        ... on SellingPlanFixedPriceAdjustment {
          price {
            ...MoneyFragment
          }
        }
        ... on SellingPlanPercentagePriceAdjustment {
          adjustmentPercentage
        }
      }
    }
    recurringDeliveries
  }

  fragment UnitPriceFragment on ProductVariant {
    unitPriceMeasurement {
      measuredType
      quantityUnit
      quantityValue
      referenceUnit
      referenceValue
    }
    unitPrice {
      ...MoneyFragment
    }
  }
`;
