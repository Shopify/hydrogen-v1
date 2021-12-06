import {parse, join} from 'path';
import {ESLintUtils} from '@typescript-eslint/experimental-utils';

export * from './react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PACKAGE_JSON = require('../../package.json');
const REPO = getRepoFromPackageJson(PACKAGE_JSON);

export const createRule = ESLintUtils.RuleCreator((name) => {
  const ruleName = parse(name).name;
  return `${REPO}/blob/v${PACKAGE_JSON.version}/packages/eslint-plugin/src/rules/${ruleName}/README.md`;
});

function getRepoFromPackageJson(pkg: any) {
  const repoPathParts = parse(pkg.repository.url);

  return join(repoPathParts.dir, repoPathParts.name, pkg.repository.directory);
}

export const deepCopy = <T>(obj: T): T => {
  if (typeof obj === 'object') {
    const copyArray = (arr: any[]): any => arr.map((val) => deepCopy(val));
    if (obj instanceof Array) return copyArray(obj);
    const newObj = {} as T;
    for (const key in obj) {
      const val = obj[key];
      if (val instanceof Array) {
        newObj[key] = copyArray(val);
      } else if (typeof val === 'object') {
        newObj[key] = deepCopy(val);
      } else {
        newObj[key] = val;
      }
    }
    return newObj;
  }
  return obj;
};

/**
 * Does a shallow merge of object `from` to object `to`.
 * Traverses each of the keys in Object `from`, allowing for:
 *
 * * If the value of a key is an array, it will be concatenated
 * 	 onto `to`.
 * * If the value of a key is an object it will extend `to` the
 *   key/values of that object.
 */
export function merge<
  F extends object,
  T extends object,
  R extends F & T = F & T
>(from: F, to: T): R {
  const mergedInto = deepCopy(to) as R;
  for (const key in from) {
    const curKey = key as unknown as keyof R;
    const hasKey = mergedInto.hasOwnProperty(key);
    const fromVal = from[key];
    if (Array.isArray(fromVal)) {
      if (!hasKey || !(mergedInto[curKey] instanceof Array))
        mergedInto[curKey] = [] as unknown as R[typeof curKey];

      (mergedInto[curKey] as unknown as Array<any>).push(...fromVal);
    } else if (typeof fromVal === 'object') {
      if (!hasKey || !(typeof mergedInto[curKey] === 'object'))
        mergedInto[curKey] = {} as unknown as R[typeof curKey];

      Object.assign(mergedInto[curKey], fromVal);
    } else {
      mergedInto[curKey] = fromVal as unknown as R[typeof curKey];
    }
  }
  return mergedInto;
}
