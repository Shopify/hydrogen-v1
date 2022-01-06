import {Env} from '../../../types';
import {
  transform,
  addImportSpecifier,
  addImportStatement,
  wrapJsxChildren,
} from '@shopify/ast-utilities/javascript';

export async function addShopifyProvider(env: Env) {
  const {workspace, fs} = env;

  if (await fs.exists(fs.join(workspace.root(), 'src/App.server.jsx'))) {
    await fs.write(
      fs.join(workspace.root(), 'src/App.server.jsx'),
      await transform(
        await fs.read(fs.join(workspace.root(), 'src/App.server.jsx')),
        addImportSpecifier('@shopify/hydrogen', 'ShopifyServerProvider'),
        addImportStatement(`import shopifyConfig from '../shopify.config';`),

        wrapJsxChildren(
          `<ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}></ShopifyServerProvider>`,
          'Suspense'
        )
      )
    );
  }
}
