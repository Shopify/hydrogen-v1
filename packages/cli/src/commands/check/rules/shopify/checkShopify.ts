import {Env, CheckResult} from '../../../../types';
import addShopifyConfig from '../../../addons/shopifyConfig';
import addShopifyProvider from '../../../addons/shopifyProvider';

export async function checkShopify({workspace}: Env): Promise<CheckResult[]> {
  const shopifyConfig = await workspace.getConfig('shopify');
  console.log(shopifyConfig);
  const hasShopifyConfig = Boolean(shopifyConfig);
  const validStoreDomain =
    hasShopifyConfig &&
    shopifyConfig.storeDomain &&
    shopifyConfig.storeDomain.match(/.myshopify.com$/)?.length === 1;

  return [
    {
      id: 'shopify-config',
      type: 'Setup',
      description: 'Has Shopify config',
      success: hasShopifyConfig,
      link: 'https://shopify.dev/custom-storefronts/hydrogen/shopify-config',
      fix: addShopifyConfig,
    },
    {
      id: 'shopify-provider',
      type: 'Setup',
      description: 'Has Shopify provider',
      // TODO Make this work
      success: false,
      link: 'https://shopify.dev/custom-storefronts/hydrogen/shopify-config',
      fix: addShopifyProvider,
    },
    {
      id: 'shopify-store-domain',
      type: 'Setup',
      description: 'Has valid storeDomain',
      success: validStoreDomain,
      link: 'https://shopify.dev/custom-storefronts/hydrogen/shopify-config#store-domain',
    },
  ];
}
