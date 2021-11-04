import {basename, extname} from 'path';

enum ReactComponentType {
  Server = 'server',
  Client = 'client',
}

export function isServerComponent(filename: string) {
  const type = getReactComponentTypeFromFilename(filename);

  return type === ReactComponentType.Server;
}

export function isClientComponent(filename: string) {
  const type = getReactComponentTypeFromFilename(filename);

  return type === ReactComponentType.Client;
}

function getReactComponentTypeFromFilename(filename: string) {
  const ext = extname(basename(filename, extname(filename)));

  return ext.slice(1);
}
