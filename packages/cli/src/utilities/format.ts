import prettier from 'prettier';
import {extname} from 'path';

const DEFAULT_PRETTIER_CONFIG = {...require('@shopify/prettier-config')};

export async function formatFile(path: string, content: string) {
  const ext = extname(path);
  const prettierConfig = {
    // TODO: Search for local project config with fallback to Shopify
    ...DEFAULT_PRETTIER_CONFIG,
    parser: 'babel',
  };

  switch (ext) {
    case '.html':
    case '.css':
      prettierConfig.parser = ext.slice(1);
      break;
  }

  const formattedContent = await prettier.format(content, prettierConfig);

  return formattedContent;
}
