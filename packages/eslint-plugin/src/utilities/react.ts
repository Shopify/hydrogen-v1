import {basename, extname} from 'path';
import {AST_NODE_TYPES, TSESTree} from '@typescript-eslint/types';

import {findParent} from './ast';

enum ReactComponentType {
  Server = 'server',
  Client = 'client',
}

export function insideReactComponent(node: TSESTree.Node) {
  return Boolean(findParent(node, isReactComponent));
}

export function insideAPIRoute(node: TSESTree.Node) {
  return Boolean(findParent(node, isAPIRoute));
}

export function isServerComponentFile(filename: string) {
  const type = getReactComponentTypeFromFilename(filename);

  return type === ReactComponentType.Server;
}

export function isClientComponentFile(filename: string) {
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

function isReactComponent(node: TSESTree.Node) {
  if (
    node.type === AST_NODE_TYPES.FunctionDeclaration &&
    isFirstLetterCapitalized(node.id?.name)
  ) {
    return true;
  }

  return false;
}

function isAPIRoute(node: TSESTree.Node) {
  if (
    node.type === AST_NODE_TYPES.ExportNamedDeclaration &&
    node.declaration?.type === AST_NODE_TYPES.FunctionDeclaration &&
    node.declaration?.id?.name === 'api'
  ) {
    return true;
  }

  return false;
}

function getReactComponentTypeFromFilename(filename: string) {
  const ext = extname(basename(filename, extname(filename)));

  return ext.slice(1);
}

function isHookName(str: string) {
  return /^use[A-Z0-9].*$/.test(str);
}

function isFirstLetterCapitalized(word?: string) {
  if (!word) {
    return false;
  }
  const firstLetter = word.charAt(0);
  return firstLetter.toUpperCase() === firstLetter;
}
