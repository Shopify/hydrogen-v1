"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.deepCopy = exports.createRule = void 0;
const path_1 = require("path");
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
__exportStar(require("./react"), exports);
__exportStar(require("./ast"), exports);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PACKAGE_JSON = require('../../package.json');
const REPO = getRepoFromPackageJson(PACKAGE_JSON);
exports.createRule = experimental_utils_1.ESLintUtils.RuleCreator((name) => {
    const ruleName = (0, path_1.parse)(name).name;
    return `${REPO}/blob/v${PACKAGE_JSON.version}/packages/eslint-plugin/src/rules/${ruleName}/README.md`;
});
function getRepoFromPackageJson(pkg) {
    const repoPathParts = (0, path_1.parse)(pkg.repository.url);
    return (0, path_1.join)(repoPathParts.dir, repoPathParts.name, pkg.repository.directory);
}
const deepCopy = (obj) => {
    if (typeof obj === 'object') {
        const copyArray = (arr) => arr.map((val) => (0, exports.deepCopy)(val));
        if (obj instanceof Array)
            return copyArray(obj);
        const newObj = {};
        for (const key in obj) {
            const val = obj[key];
            if (val instanceof Array) {
                newObj[key] = copyArray(val);
            }
            else if (typeof val === 'object') {
                newObj[key] = (0, exports.deepCopy)(val);
            }
            else {
                newObj[key] = val;
            }
        }
        return newObj;
    }
    return obj;
};
exports.deepCopy = deepCopy;
/**
 * Does a shallow merge of object `from` to object `to`.
 * Traverses each of the keys in Object `from`, allowing for:
 *
 * * If the value of a key is an array, it will be concatenated
 * 	 onto `to`.
 * * If the value of a key is an object it will extend `to` the
 *   key/values of that object.
 */
function merge(from, to) {
    const mergedInto = (0, exports.deepCopy)(to);
    for (const key in from) {
        const curKey = key;
        const hasKey = mergedInto.hasOwnProperty(key);
        const fromVal = from[key];
        if (Array.isArray(fromVal)) {
            if (!hasKey || !(mergedInto[curKey] instanceof Array))
                mergedInto[curKey] = [];
            mergedInto[curKey].push(...fromVal);
        }
        else if (typeof fromVal === 'object') {
            if (!hasKey || !(typeof mergedInto[curKey] === 'object'))
                mergedInto[curKey] = {};
            Object.assign(mergedInto[curKey], fromVal);
        }
        else {
            mergedInto[curKey] = fromVal;
        }
    }
    return mergedInto;
}
exports.merge = merge;
