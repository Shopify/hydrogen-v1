import {DevTools as DevToolsClient} from './DevTools.client.js';
import {useServerRequest} from '../ServerRequestProvider/index.js';

export function DevTools() {
  const serverRequest = useServerRequest();
  const {shopifyConfig} = serverRequest.ctx;
  const {
    defaultLanguageCode: languageCode,
    defaultCountryCode: countryCode,
    storeDomain,
    storefrontApiVersion,
  } = shopifyConfig || {};
  const settings = {
    locale: `${languageCode}-${countryCode}`,
    storeDomain,
    storefrontApiVersion,
  };

  return <DevToolsClient dataFromServer={{settings}} />;
}
