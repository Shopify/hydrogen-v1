import {flattenConnection, useMultipleProductsQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

export default function Sitemap({response}) {
  response.doNotStream();

  const customFragment = gql`
    fragment ProductFragment on Product {
      updatedAt
      handle
      featuredImage {
        url
        altText
      }
    }
  `;

  const {data} = useMultipleProductsQuery({numProducts: 100, customFragment});

  response.headers.set('content-type', 'application/xml');

  return response.send(shopSitemap(data));
}

function shopSitemap(data) {
  return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${flattenConnection(data.products)
        .map((product) => {
          return `
          <url>
            <loc>
              https://hydrogen-preview.myshopify.com/products/${product.handle}
            </loc>
            <lastmod>${product.updatedAt}</lastmod>
            <changefreq>daily</changefreq>
            <image:image>
              <image:loc>
                ${product?.featuredImage?.url}
              </image:loc>
              <image:title>
                ${product?.featuredImage?.altText ?? ''}
              </image:title>
              <image:caption />
            </image:image>
          </url>
        `;
        })
        .join('')}
    </urlset>`;
}
