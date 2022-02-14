/**
 * This API endpoint generates a robots.txt file. Use this to control
 * access to your resources from SEO crawlers.
 * Learn more: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
 */

export default function RobotsTxt({request, response}) {
  response.doNotStream();
  response.headers.set('content-type', 'text/plain');

  const url = new URL(request.url);

  return response.send(robotsTxtData({url: url.origin}));
}

function robotsTxtData({url}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /account
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders

User-agent: Pinterest
Crawl-delay: 1
`;
}
