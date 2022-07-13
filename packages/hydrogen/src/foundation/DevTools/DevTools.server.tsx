import React from 'react';
import {DevTools as DevToolsClient} from './DevTools.client';
import {useServerRequest} from '../ServerRequestProvider';
import {getLocale} from '../../utilities/locale';

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
    locale:
      languageCode && countryCode
        ? getLocale(languageCode, countryCode)
        : `${languageCode}-${countryCode}`,
    storeDomain,
    storefrontApiVersion,
  };

  return <DevToolsClient dataFromServer={{settings}} />;
}
