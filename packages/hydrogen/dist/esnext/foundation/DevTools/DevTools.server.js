import React from 'react';
import { DevTools as DevToolsClient } from './DevTools.client';
import { useServerRequest } from '../ServerRequestProvider';
export function DevTools() {
    const serverRequest = useServerRequest();
    const { shopifyConfig } = serverRequest.ctx;
    const { locale, storeDomain, storefrontApiVersion } = shopifyConfig || {};
    const settings = {
        locale,
        storeDomain,
        storefrontApiVersion,
    };
    return React.createElement(DevToolsClient, { dataFromServer: { settings } });
}
