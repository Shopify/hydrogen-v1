import {TSESTree} from '@typescript-eslint/types';

export function findParent(
  node: TSESTree.Node,
  test: (node: TSESTree.Node) => boolean
): TSESTree.Node | null {
  if (test(node)) {
    return node;
  } else if (node.parent) {
    return findParent(node.parent, test);
  }
  return null;
}
