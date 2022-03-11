import React from 'react';
import {ServerAnalytics} from './index';
import {Analytics as AnalyticsClient} from './Analytics.client';

export function Analytics() {
  const analyticData = ServerAnalytics.getDatalayer();
  return <AnalyticsClient analyticDataFromServer={analyticData} />;
}
