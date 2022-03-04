import {Env, ComponentType} from '../../../types';
import {componentName, validComponentName} from '../../../utilities';

const PAGES_DIRECTORY = 'src/routes';

/**
 * Scaffold a new Hydrogen page.
 */
export async function page(env: Env) {
  const {ui, fs, workspace} = env;

  const name = await ui.ask('What do you want to name this page?', {
    validate: validComponentName,
    default: 'Products',
    name: 'name',
  });

  const url = await ui.ask('What is the url path to this page?', {
    default: '/products',
    name: 'name',
  });

  const urlSegments = url.split('/');
  const lastUrlSegment = urlSegments.pop() || '';
  const extension = (await workspace.isTypeScript) ? 'tsx' : 'jsx';

  const path = fs.join(
    workspace.root(),
    PAGES_DIRECTORY,
    ...urlSegments,
    componentName(lastUrlSegment, ComponentType.Server, extension)
  );

  fs.write(
    path,
    (await import('./templates/page-jsx')).default({
      name,
      path: fs.join(
        PAGES_DIRECTORY,
        componentName(url, ComponentType.Server, extension)
      ),
    })
  );
}
