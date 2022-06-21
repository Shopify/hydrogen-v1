import {log} from '../../../../utilities/log';

export const ShopifyServerAnalyticsConnector = {
  request(): Promise<any> {
    log.warn(
      'ShopifyServerAnalyticsConnector has been removed - please remove its reference from hydrogen.config.js'
    );
    return Promise.resolve();
  },
};
