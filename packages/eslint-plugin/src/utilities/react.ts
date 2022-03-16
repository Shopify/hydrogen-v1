import {basename, extname} from 'path';
import {AST_NODE_TYPES, TSESTree} from '@typescript-eslint/types';

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

export function isHook(node: TSESTree.CallExpression) {
  if (node.callee.type === AST_NODE_TYPES.Identifier) {
    return isHookName(node.callee.name);
  } else if (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    !node.callee.computed &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    isHookName(node.callee.property.name)
  ) {
    const objectNode = node.callee.object;

    return (
      objectNode.type === AST_NODE_TYPES.Identifier &&
      objectNode.name === 'React'
    );
  } else {
    return false;
  }
}

export function getHookName(node: TSESTree.CallExpression) {
  if (node.callee.type === AST_NODE_TYPES.Identifier) {
    return node.callee.name;
  }

  if (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return node.callee.property.name;
  }

  return '';
}

function getReactComponentTypeFromFilename(filename: string) {
  const ext = extname(basename(filename, extname(filename)));

  return ext.slice(1);
}

function isHookName(str: string) {
  return /^use[A-Z0-9].*$/.test(str);
}
