import AnalyticEventBus from '../AnalyticEventBus';

let datalayer: any;

export function Shopify(data: any) {
  datalayer = Object.assign({}, data);
}

AnalyticEventBus.subscribe('page-view', (payload: any) => {
  console.log(Object.assign({}, datalayer, payload));
});
