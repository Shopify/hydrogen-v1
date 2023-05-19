/**
 * An alphabetized list of User Agents of known bots, combined from lists found at:
 * https://github.com/vercel/next.js/blob/d87dc2b5a0b3fdbc0f6806a47be72bad59564bd0/packages/next/server/utils.ts#L18-L22
 * https://github.com/GoogleChrome/rendertron/blob/6f681688737846b28754fbfdf5db173846a826df/middleware/src/middleware.ts#L24-L41
 */
const botUserAgents = [
  '360spider',
  'adsbot-google',
  'adsbot-google-mobile',
  'applebot',
  'baiduspider',
  'baiduspider',
  'bingbot',
  'bingbot',
  'bingpreview',
  'bitlybot',
  'bytespider',
  'discordbot',
  'duckduckbot',
  'embedly',
  'facebookcatalog',
  'facebookexternalhit',
  'google-inspectiontool',
  'google-pagerenderer',
  'googlebot',
  'googlebot-image',
  'googlebot-news',
  'googlebot-video',
  'googleother',
  'googleweblight',
  'ia_archive',
  'ia_archiver',
  'linkedinbot',
  'mediapartners-google',
  'outbrain',
  'petalbot',
  'pinterest',
  'quora link preview',
  'redditbot',
  'rogerbot',
  'seoradar',
  'showyoubot',
  'skypeuripreview',
  'slackbot',
  'slurp',
  'sogou',
  'storebot-google',
  'telegrambot',
  'tumblr',
  'twitterbot',
  'vkshare',
  'w3c html2txt',
  'w3c_validator',
  'whatsapp',
  'yandex',
  'yisouspider',
];

/**
 * Creates a regex based on the botUserAgents array
 */
const botUARegex = new RegExp(botUserAgents.join('|'), 'i');

/**
 * Determines if the request is from a bot, using the URL and User Agent
 */
export function isBotUA(url: URL, userAgent: string | null): boolean {
  return (
    url.searchParams.has('_bot') || (!!userAgent && botUARegex.test(userAgent))
  );
}
