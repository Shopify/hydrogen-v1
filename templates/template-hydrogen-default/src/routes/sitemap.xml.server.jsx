import {flattenConnection, useShopQuery, useShop} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const MAX_URLS = 250; // the google limit is 50K, however, SF API only allow querying for 250 resources each time

export default function Sitemap({request, response}) {
  response.doNotStream();

  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      language: languageCode,
      urlLimits: MAX_URLS,
    },
    // Cache the page for 24 hours
    cache: {maxAge: 60 * 60 * 24},
  });

  response.headers.set('content-type', 'application/xml');

  return response.send(shopSitemap(data, request.url));
}

function shopSitemap(data, baseUrl) {
  const productsData = flattenConnection(data.products).map((product) => {
    const url = product.onlineStoreUrl
      ? product.onlineStoreUrl
      : `${baseUrl}/products/${product.handle}`;

    const finalObject = {
      url,
      lastMod: product.updatedAt,
      changeFreq: 'daily',
    };

    if (product.featuredImage.url) {
      finalObject.image = {
        url: product.featuredImage.url,
      };

      if (product.title) {
        finalObject.image.title = product.title;
      }

      if (product.featuredImage.altText) {
        finalObject.image.caption = product.featuredImage.altText;
      }

      return finalObject;
    }
  });

  const collectionsData = flattenConnection(data.collections).map(
    (collection) => {
      const url = collection.onlineStoreUrl
        ? collection.onlineStoreUrl
        : `${baseUrl}/collections/${collection.handle}`;

      return {
        url,
        lastMod: collection.updatedAt,
        changeFreq: 'daily',
      };
    },
  );

  const pagesData = flattenConnection(data.pages).map((page) => {
    const url = page.onlineStoreUrl
      ? page.onlineStoreUrl
      : `${baseUrl}/pages/${page.handle}`;

    return {
      url,
      lastMod: page.updatedAt,
      changeFreq: 'weekly',
    };
  });

  const urlsDatas = [...productsData, ...collectionsData, ...pagesData];

  return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${urlsDatas.map((url) => renderUrlTag(url)).join('')}
    </urlset>`;
}

function renderUrlTag({url, lastMod, changeFreq, image}) {
  return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>${changeFreq}</changefreq>
      ${
        image
          ? `
        <image:image>
          <image:loc>${image.url}</image:loc>
          <image:title>${image.title ?? ''}</image:title>
          <image:caption>${image.caption ?? ''}</image:caption>
        </image:image>`
          : ''
      }
      
    </url>
  `;
}

const QUERY = gql`
  query sitemaps($urlLimits: Int, $language: LanguageCode)
  @inContext(language: $language) {
    products(
      first: $urlLimits
      query: "published_status:'online_store:visible'"
    ) {
      edges {
        node {
          updatedAt
          handle
          onlineStoreUrl
          title
          featuredImage {
            url
            altText
          }
        }
      }
    }
    collections(
      first: $urlLimits
      query: "published_status:'online_store:visible'"
    ) {
      edges {
        node {
          updatedAt
          handle
          onlineStoreUrl
        }
      }
    }
    pages(first: $urlLimits, query: "published_status:'published'") {
      edges {
        node {
          updatedAt
          handle
          onlineStoreUrl
        }
      }
    }
  }
`;
