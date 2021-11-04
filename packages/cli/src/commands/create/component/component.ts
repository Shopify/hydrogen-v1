import {pascalCase} from 'change-case';
import {Env} from '../../../types';

export enum ComponentType {
  Client = 'React client component',
  Shared = 'React shared component',
  Server = 'React server component',
}

/**
 * Scaffold a new React component.
 */
export async function component(env: Env) {
  const {ui, fs, workspace} = env;
  const name = await ui.ask('What do you want to name this component?', {
    validate: validateComponentName,
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

function validateComponentName(name: string) {
  const suggested = pascalCase(name);
  if (name === suggested) {
    return true;
  }

  return `Invalid component name. Try ${suggested} instead.`;
}

function getReactComponentTypeSuffix(component: ComponentType) {
  switch (component) {
    case ComponentType.Client:
      return 'client';
    case ComponentType.Server:
      return 'server';
    default:
      return null;
  }
}

function componentName(name: string, type: ComponentType, extension: string) {
  return [name, getReactComponentTypeSuffix(type), extension]
    .filter((fp) => fp)
    .join('.');
}
