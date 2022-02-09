import {flattenConnection, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const MAX_URLS = 250; // the google limit is 50K, however, SF API only allow querying for 250 resources each time

export default function Sitemap({response}) {
  response.doNotStream();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      urlLimits: MAX_URLS,
    },
  });

  response.headers.set('content-type', 'application/xml');

  return response.send(shopSitemap(data));
}

function shopSitemap(data) {
  const urlOrigin = 'https://hydrogen-preview.myshopify.com';

  return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${flattenConnection(data.products)
        .map((product) => {
          const url = product.onlineStoreUrl
            ? product.onlineStoreUrl
            : `${urlOrigin}/products/${product.handle}`;

          return `
          <url>
            <loc>${url}</loc>
            <lastmod>${product.updatedAt}</lastmod>
            <changefreq>daily</changefreq>
            <image:image>
              <image:loc>
                ${product?.featuredImage?.url}
              </image:loc>
              <image:title>
                ${product?.title ?? ''}
              </image:title>
              <image:caption>
                ${product?.featuredImage?.altText ?? ''}
              </image:caption>
            </image:image>
          </url>
        `;
        })
        .join('')}
      ${flattenConnection(data.collections)
        .map((collection) => {
          const url = collection.onlineStoreUrl
            ? collection.onlineStoreUrl
            : `${urlOrigin}/collections/${collection.handle}`;

          return `
          <url>
            <loc>${url}</loc>
            <lastmod>${collection.updatedAt}</lastmod>
            <changefreq>daily</changefreq>
          </url>
        `;
        })
        .join('')}
      ${flattenConnection(data.pages)
        .map((page) => {
          const url = page.onlineStoreUrl
            ? page.onlineStoreUrl
            : `${urlOrigin}/pages/${page.handle}`;

          return `
          <url>
            <loc>${url}</loc>
            <lastmod>${page.updatedAt}</lastmod>
            <changefreq>weekly</changefreq>
          </url>
        `;
        })
        .join('')}
    </urlset>`;
}

const QUERY = gql`
  query sitemaps($urlLimits: Int) {
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
