import { TSESTree } from '@typescript-eslint/types';
export declare function insideReactComponent(node: TSESTree.Node): boolean;
export declare function insideAPIRoute(node: TSESTree.Node): boolean;
export declare function isServerComponentFile(filename: string): boolean;
export declare function isClientComponentFile(filename: string): boolean;
export declare function isHook(node: TSESTree.CallExpression): boolean;
export declare function getHookName(node: TSESTree.CallExpression): string;
