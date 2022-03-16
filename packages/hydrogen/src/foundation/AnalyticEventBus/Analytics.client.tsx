import {useEffect} from 'react';
import {ClientAnalytics} from './index';

export function Analytics({
  analyticDataFromServer,
}: {
  analyticDataFromServer: any;
}) {
  useEffect(() => {
    ClientAnalytics.pushToDatalayer(analyticDataFromServer);
    ClientAnalytics.publish('page-view', true);
  }, [analyticDataFromServer]);

  return null;
}
