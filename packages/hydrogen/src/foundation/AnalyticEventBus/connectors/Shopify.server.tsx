import {ServerAnalytics} from '../index';

ServerAnalytics.subscribe('page-view', (payload: any) => {
  console.log('page-view', Object.assign({}, payload));
});
