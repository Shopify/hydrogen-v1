import {ShopifyProvider, useShop} from '@shopify/hydrogen';

export default function Config({params}) {
  const {handle} = params;
  const config = {
    storeDomain: `${handle}-domain`,
    storefrontToken: `${handle}-token`,
    storefrontApiVersion: `${handle}-version`,
  };
  return (
    <ShopifyProvider shopifyConfig={config}>
      <ReadConfig />
    </ShopifyProvider>
  );
}

function ReadConfig() {
  const shop = useShop();
  return <div>{JSON.stringify(shop)}</div>;
}
