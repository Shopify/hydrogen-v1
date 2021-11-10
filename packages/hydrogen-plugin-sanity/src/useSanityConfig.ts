import {isClient, useShop} from '@shopify/hydrogen';
import { ClientConfig } from './types';

const useSanityConfig = (config: Partial<ClientConfig> = {}): ClientConfig => {
  if (isClient()) {
    throw new Error('Sanity requests should only be made from the server.');
  }

  const shopifyConfig = useShop();
  const globalClientConfig = ((shopifyConfig as any).sanity ||
    {}) as Partial<ClientConfig>;

  if (!(config.projectId || globalClientConfig.projectId)) {
    throw new Error(
      '[hydrogen-plugin-sanity] Missing project ID.\n Pass it directly to the hook or set its value in the `sanity` object inside shopify.config.js.',
    );
  }
  if (!(config.dataset || globalClientConfig.dataset)) {
    throw new Error(
      '[hydrogen-plugin-sanity] Missing dataset.\n Pass it directly to the hook or set its value in the `sanity` object inside shopify.config.js.',
    );
  }
  if (!(config.apiVersion || globalClientConfig.apiVersion)) {
    throw new Error(
      '[hydrogen-plugin-sanity] Missing apiVersion.\n Pass it directly to the hook or set its value in the `sanity` object inside shopify.config.js.',
    );
  }
  return {
    ...globalClientConfig,
    ...config,
  };
};

export default useSanityConfig;
