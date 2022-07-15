import React from 'react';
import {DevTools as DevToolsClient} from './DevTools.client.js';
import {useServerRequest} from '../ServerRequestProvider/index.js';
import {getLocale} from '../../utilities/locale/index.js';

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
    locale: getLocale(languageCode, countryCode),
    storeDomain,
    storefrontApiVersion,
  };

  return <DevToolsClient dataFromServer={{settings}} />;
}
