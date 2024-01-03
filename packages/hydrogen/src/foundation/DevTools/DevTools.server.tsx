import React from 'react';
import {useSession} from '../useSession/useSession.js';
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
  const session = useSession();

  const data = {
    settings,
    storage: {
      session,
    },
  };
  return <DevToolsClient dataFromServer={data} />;
}
