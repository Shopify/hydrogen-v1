import { TSESTree } from '@typescript-eslint/types';
export declare const preferImageComponent: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"preferImageComponent" | "replaceWithImage", never[], {
    ImportDeclaration(node: TSESTree.ImportDeclaration): void;
    JSXOpeningElement(node: TSESTree.JSXOpeningElement): void;
}>;
