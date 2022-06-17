import { ESLintUtils } from '@typescript-eslint/experimental-utils';
export * from './react';
export * from './ast';
export declare const createRule: <TOptions extends readonly unknown[], TMessageIds extends string, TRuleListener extends import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener = import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>({ name, meta, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<TOptions, TMessageIds, TRuleListener>>) => import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<TMessageIds, TOptions, TRuleListener>;
export declare const deepCopy: <T>(obj: T) => T;
/**
 * Does a shallow merge of object `from` to object `to`.
 * Traverses each of the keys in Object `from`, allowing for:
 *
 * * If the value of a key is an array, it will be concatenated
 * 	 onto `to`.
 * * If the value of a key is an object it will extend `to` the
 *   key/values of that object.
 */
export declare function merge<F extends object, T extends object, R extends F & T = F & T>(from: F, to: T): R;
