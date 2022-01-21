import {TemplateOptions} from 'types';
import {Feature} from '../../../../utilities/feature';

export default function ({ifFeature}: TemplateOptions) {
  return `
import renderHydrogen from '@shopify/hydrogen/entry-client';
${ifFeature(Feature.Pwa, `import {registerSW} from 'virtual:pwa-register';`)}
import shopifyConfig from '../shopify.config';

function ClientApp({children}) {
  ${ifFeature(Feature.Pwa, 'registerSW()')}
  return children;
}

export default renderHydrogen(ClientApp, {shopifyConfig});
`;
}
