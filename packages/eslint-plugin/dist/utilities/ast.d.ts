import { TSESTree } from '@typescript-eslint/types';
export declare function findParent(node: TSESTree.Node, test: (node: TSESTree.Node) => boolean): TSESTree.Node | null;
