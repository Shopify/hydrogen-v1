import {useLoadScript} from '@shopify/hydrogen';

export function MyComponent() {
  const scriptStatus = useLoadScript(
    'https://cdn.shopify.com/shopifycloud/shop-js/v0.1/client.js'
  );

  if (scriptStatus === 'loading') {
    return <div>loading...</div>;
  }

  if (scriptStatus === 'error') {
    return <div>error...</div>;
  }

  // shop-pay-button custom element is available to use
  return <shop-pay-button />;
}
