import {useShopQuery, Seo} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';

export default function Product({country = {isoCode: 'US'}, params}) {
  const {handle} = params;

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
    </Layout>
  );
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $handle: String!
    $includeReferenceMetafieldDetails: Boolean = true
    $numProductMetafields: Int = 20
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 10
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    product: product(handle: $handle) {
      id
      vendor
      ...ProductProviderFragment
      ...ProductSeoFragment
    }
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

  fragment ProductSeoFragment on Product {
    title
    description
    seo {
      ...SeoFragment
    }
    vendor
    featuredImage {
      ...ImageSeoFragment
    }
    variants(first: $numProductVariants) {
      edges {
        node {
          image {
            url
          }
          availableForSale
          priceV2 {
            amount
            currencyCode
          }
          sku
        }
      }
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
`;
