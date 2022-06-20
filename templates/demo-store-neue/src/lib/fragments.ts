import {gql} from '@shopify/hydrogen';

// Could add a @link or @see comment here to the SFAPI reference: https://shopify.dev/api/storefront/current/interfaces/media
// (You can always replace the API version with "current" so URLs stay up to date)
export const MEDIA_FRAGMENT = gql`
  fragment MediaFields on Media {
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
`;

// same here? https://shopify.dev/api/storefront/current/objects/Product
export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFields on Product {
    id
    title
    publishedAt
    handle
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        priceV2 {
          amount
          currencyCode
        }
        compareAtPriceV2 {
          amount
          currencyCode
        }
      }
    }
  }
`;
