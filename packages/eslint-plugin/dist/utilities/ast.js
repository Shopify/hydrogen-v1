"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findParent = void 0;
function findParent(node, test) {
    if (test(node)) {
        return node;
    }
    else if (node.parent) {
        return findParent(node.parent, test);
    }
    return null;
}
exports.findParent = findParent;
