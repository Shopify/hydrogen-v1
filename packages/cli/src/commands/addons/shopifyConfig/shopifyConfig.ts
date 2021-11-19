import {Env} from '../../../types';

export async function addShopifyConfig(env: Env) {
  const {logger, workspace, ui, fs} = env;

  logger('Adding Shopify');

  const storeDomain = await ui.ask('What is your myshopify.com store domain?', {
    default: 'hydrogen-preview.myshopify.com',
    name: 'storeDomain',
  });

  const storefrontToken = await ui.ask('What is your storefront token?', {
    default: '3b580e70970c4528da70c98e097c2fa0',
    name: 'storeFrontToken',
  });

  const templateArgs = {
    storeDomain: storeDomain?.replace(/^https?:\/\//i, ''),
    storefrontToken,
  };

  await render('shopify.config.js', './templates/shopify-config-js');

  async function render(path: string, templatePath: string) {
    fs.write(
      fs.join(workspace.root(), path),
      (await import(templatePath)).default(templateArgs)
    );
  }
}
