import {ServerAnalytics} from '../index';

ServerAnalytics.subscribe('page-view', (payload: any) => {
  console.log(Object.assign({}, payload));
});
