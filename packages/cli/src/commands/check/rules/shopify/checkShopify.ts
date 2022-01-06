import {Env, CheckResult} from '../../../../types';
import addShopifyConfig from '../../../add/shopifyConfig';
import addShopifyProvider from '../../../add/shopifyProvider';

export async function checkShopify(env: Env): Promise<CheckResult[]> {
  const {fs, workspace} = env;
  const shopifyConfig = await workspace.getConfig('shopify');
  const hasShopifyConfig = Boolean(shopifyConfig);
  const validStoreDomain =
    hasShopifyConfig &&
    shopifyConfig.storeDomain &&
    shopifyConfig.storeDomain.match(/.myshopify.com$/)?.length === 1;

  const hasShopifyProvider =
    (await fs.exists('src/App.server.jsx')) &&
    (await fs.read('src/App.server.jsx'))?.includes('ShopifyServerProvider');

  console.log(hasShopifyProvider);
  return [
    {
      id: 'shopify-config',
      type: 'Setup',
      description: 'Has Shopify config',
      success: hasShopifyConfig,
      fix: addShopifyConfig,
    },
    {
      id: 'shopify-provider',
      type: 'Setup',
      description: 'Has Shopify provider',
      success: !!hasShopifyProvider,
      fix: addShopifyProvider,
    },
    {
      id: 'shopify-store-domain',
      type: 'Setup',
      description: 'Has valid storeDomain',
      success: validStoreDomain,
    },
  ];
}
