import prettier from 'prettier';

const PRETTIER_CONFIG = {
  parser: 'babel',
  ...require('@shopify/prettier-config'),
};

export function formatFile(content: string) {
  // TODO: Search for local project config with fallback to Shopify
  const formattedContent = prettier.format(content, PRETTIER_CONFIG);

  return formattedContent;
}
