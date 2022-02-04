/**
 * This API endpoint generates a robots.txt file. Use this to control
 * access to your resources from SEO crawlers.
 * Learn more: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
 */
const ROBOTS_TXT = `
User-agent: *
Allow: /`;

export const api = () => ROBOTS_TXT.trim();
