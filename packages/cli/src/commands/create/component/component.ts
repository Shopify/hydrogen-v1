import {Env, ComponentType} from '../../../types';
import {componentName, validComponentName} from '../../../utilities';
/**
 * Scaffold a new React component.
 */
export async function component(env: Env) {
  const {ui, fs, workspace} = env;
  const name = await ui.ask('What do you want to name this component?', {
    validate: validComponentName,
    default: 'ProductCard',
    name: 'name',
  });

  const extension = (await workspace.isTypeScript) ? 'tsx' : 'jsx';

  const type = await ui.ask<ComponentType>('What type of component is this?', {
    choices: [ComponentType.Client, ComponentType.Server, ComponentType.Shared],
    name: 'type',
  });

  const path = fs.join(
    workspace.root(),
    workspace.componentsDirectory,
    componentName(name, type, extension)
  );
  fs.write(
    path,
    (await import('./templates/component-jsx')).default({
      name,
      path: fs.join(
        workspace.componentsDirectory,
        componentName(name, type, extension)
      ),
    })
  );
}
