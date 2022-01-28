import {ShopifyProvider, useShop} from '@shopify/hydrogen';
import ClientConfig from '../../components/Config.client';

export default function Config({params}) {
  const {handle} = params;
  const config = {
    storeDomain: `${handle}-domain`,
    storefrontToken: `${handle}-token`,
    storefrontApiVersion: `${handle}-version`,
  };
  return (
    <ShopifyProvider shopifyConfig={config}>
      <ClientConfig shopifyConfig={config}>
        <ReadConfig />
      </ClientConfig>
    </ShopifyProvider>
  );
}

function ReadConfig() {
  const shop = useShop();
  return <div>{JSON.stringify(shop)}</div>;
}
