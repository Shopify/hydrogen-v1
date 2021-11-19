import {Env} from '../../../types';
import {
  transform,
  addImportSpecifier,
  addImportStatement,
  replaceJsxBody,
} from '@shopify/ast-utilities/javascript';

// TODO Make this work
export async function addShopifyProvider(env: Env) {
  const {workspace, fs} = env;

  if (await fs.exists(fs.join(workspace.root(), 'src/App.server.jsx'))) {
    await fs.write(
      fs.join(workspace.root(), 'src/App.server.jsx'),
      await transform(
        await fs.read(fs.join(workspace.root(), 'src/App.server.jsx')),
        addImportStatement(`import shopifyConfig from '../shopify.config';`),
        addImportSpecifier('@shopify/hydrogen', 'ShopifyServerProvider'),
        replaceJsxBody(
          `<ShopifyServerProvider></ShopifyServerProvider>`,
          'Suspense'
        )
      )
    );
  }
}
