import {gql} from '@shopify/hydrogen';

export const MEDIA_FIELDS = gql`
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

export const PRODUCT_CARD_FIELDS = gql`
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

export const LOCATION_CARD_FIELDS = gql`
  fragment LocationCardFields on ContentEntry {
    id
    handle
    featured_image: field(key: "featured_image") {
      reference {
        ... on MediaImage {
          image {
            url
            width
            height
            altText
          }
        }
      }
    }
    title: field(key: "title") {
      value
    }
    address: field(key: "address") {
      value
    }
    hours: field(key: "hours") {
      value
    }
    email: field(key: "email") {
      value
    }
    phone: field(key: "phone") {
      value
    }
  }
`;
