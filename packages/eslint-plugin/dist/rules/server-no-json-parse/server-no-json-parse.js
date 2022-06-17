"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverNoJsonParse = void 0;
const types_1 = require("@typescript-eslint/types");
const utilities_1 = require("../../utilities");
exports.serverNoJsonParse = (0, utilities_1.createRule)({
    name: `hydrogen/${__dirname}`,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'JSON.parse() should not be used in server-side code due to security concerns.',
            recommended: 'warn',
        },
        messages: {
            serverNoJsonParse: 'Do not use JSON.parse() on the server.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            ExpressionStatement(node) {
                if (node.expression.type === types_1.AST_NODE_TYPES.CallExpression &&
                    node.expression.callee.type === types_1.AST_NODE_TYPES.MemberExpression &&
                    node.expression.callee.object.type === types_1.AST_NODE_TYPES.Identifier &&
                    node.expression.callee.property.type === types_1.AST_NODE_TYPES.Identifier &&
                    node.expression.callee.object.name === 'JSON' &&
                    node.expression.callee.property.name === 'parse' &&
                    (0, utilities_1.isServerComponentFile)(context.getFilename()) &&
                    ((0, utilities_1.insideReactComponent)(node) || (0, utilities_1.insideAPIRoute)(node))) {
                    context.report({
                        node,
                        messageId: 'serverNoJsonParse',
                    });
                }
            },
        };
    },
});
