import {log} from '../../../../utilities/log/index.js';

export const PerformanceMetricsServerAnalyticsConnector = {
  request(): Promise<any> {
    log.warn(
      'PerformanceMetricsServerAnalyticsConnector has been removed - please remove its reference from hydrogen.config.js'
    );
    return Promise.resolve();
  },
};
