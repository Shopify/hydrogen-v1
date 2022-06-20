// @ts-check

/**
 * This is a temporary script meant to compile the demo-store template files from the
 * templates directory into this package for use in the Shopify Oxygen Admin.
 */

import path from 'path';
import {fileURLToPath} from 'url';
import {compileTemplate} from '../../../scripts/compile-template.mjs';

(async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const source = path.resolve(__dirname, '..', '..', '..', 'templates');
  const destination = path.resolve(__dirname, '..', './template-hydrogen');

  await compileTemplate('demo-store', {source, destination});
})();
