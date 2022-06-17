"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHookName = exports.isHook = exports.isClientComponentFile = exports.isServerComponentFile = exports.insideAPIRoute = exports.insideReactComponent = void 0;
const path_1 = require("path");
const types_1 = require("@typescript-eslint/types");
const ast_1 = require("./ast");
var ReactComponentType;
(function (ReactComponentType) {
    ReactComponentType["Server"] = "server";
    ReactComponentType["Client"] = "client";
})(ReactComponentType || (ReactComponentType = {}));
function insideReactComponent(node) {
    return Boolean((0, ast_1.findParent)(node, isReactComponent));
}
exports.insideReactComponent = insideReactComponent;
function insideAPIRoute(node) {
    return Boolean((0, ast_1.findParent)(node, isAPIRoute));
}
exports.insideAPIRoute = insideAPIRoute;
function isServerComponentFile(filename) {
    const type = getReactComponentTypeFromFilename(filename);
    return type === ReactComponentType.Server;
}
exports.isServerComponentFile = isServerComponentFile;
function isClientComponentFile(filename) {
    const type = getReactComponentTypeFromFilename(filename);
    return type === ReactComponentType.Client;
}
exports.isClientComponentFile = isClientComponentFile;
function isHook(node) {
    if (node.callee.type === types_1.AST_NODE_TYPES.Identifier) {
        return isHookName(node.callee.name);
    }
    else if (node.callee.type === types_1.AST_NODE_TYPES.MemberExpression &&
        !node.callee.computed &&
        node.callee.property.type === types_1.AST_NODE_TYPES.Identifier &&
        isHookName(node.callee.property.name)) {
        const objectNode = node.callee.object;
        return (objectNode.type === types_1.AST_NODE_TYPES.Identifier &&
            objectNode.name === 'React');
    }
    else {
        return false;
    }
}
exports.isHook = isHook;
function getHookName(node) {
    if (node.callee.type === types_1.AST_NODE_TYPES.Identifier) {
        return node.callee.name;
    }
    if (node.callee.type === types_1.AST_NODE_TYPES.MemberExpression &&
        node.callee.property.type === types_1.AST_NODE_TYPES.Identifier) {
        return node.callee.property.name;
    }
    return '';
}
exports.getHookName = getHookName;
function isReactComponent(node) {
    if (node.type === types_1.AST_NODE_TYPES.FunctionDeclaration &&
        isFirstLetterCapitalized(node.id?.name)) {
        return true;
    }
    return false;
}
function isAPIRoute(node) {
    if (node.type === types_1.AST_NODE_TYPES.ExportNamedDeclaration &&
        node.declaration?.type === types_1.AST_NODE_TYPES.FunctionDeclaration &&
        node.declaration?.id?.name === 'api') {
        return true;
    }
    return false;
}
function getReactComponentTypeFromFilename(filename) {
    const ext = (0, path_1.extname)((0, path_1.basename)(filename, (0, path_1.extname)(filename)));
    return ext.slice(1);
}
function isHookName(str) {
    return /^use[A-Z0-9].*$/.test(str);
}
function isFirstLetterCapitalized(word) {
    if (!word) {
        return false;
    }
    const firstLetter = word.charAt(0);
    return firstLetter.toUpperCase() === firstLetter;
}
