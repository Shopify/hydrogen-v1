import {ServerAnalytics} from '../index';

ServerAnalytics.subscribe('page-view', (payload: any) => {
  // TO-DO: Implement Shopify monorail
  console.log('page-view', Object.assign({}, payload));
});
