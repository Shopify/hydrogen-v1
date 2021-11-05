import {pascalCase} from 'change-case';
import {ComponentType} from '../types';

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

export function componentName(
  name: string,
  type: ComponentType,
  extension: string
) {
  return [name, getReactComponentTypeSuffix(type), extension]
    .filter((fp) => fp)
    .join('.');
}

export function validComponentName(name: string) {
  const suggested = pascalCase(name);
  if (name === suggested) {
    return true;
  }

  return `Invalid component name. Try ${suggested} instead.`;
}
