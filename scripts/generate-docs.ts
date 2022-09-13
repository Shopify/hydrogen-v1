import {resolve} from 'path';

import {components} from '../packages/generate-docs';

async function run() {
  console.log('run');
  const result = await components({
    inputRootPath: resolve('.'),
    packageName: 'hydrogen',
    entry: 'components/AddToCartButton',
  });

  console.log(result);
}

run();
