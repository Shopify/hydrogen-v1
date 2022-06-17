"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverComponentBannedHooks = void 0;
const utilities_1 = require("../../utilities");
const BANNED_STATE_HOOKS = ['useState', 'useReducer'];
const BANNED_EFFECT_HOOKS = ['useEffect', 'useLayoutEffect'];
const BANNED_HOOKS = [...BANNED_STATE_HOOKS, ...BANNED_EFFECT_HOOKS];
exports.serverComponentBannedHooks = (0, utilities_1.createRule)({
    name: `hydrogen/${__dirname}`,
    meta: {
        type: 'problem',
        docs: {
            description: `Prevent using ${new Intl.ListFormat('en').format(BANNED_HOOKS)} in server and shared components`,
            recommended: 'error',
        },
        messages: {
            serverComponentBannedHooks: `Do not use {{hook}} in files that don't end with .client.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                const hook = (0, utilities_1.getHookName)(node);
                if ((0, utilities_1.isServerComponentFile)(context.getFilename()) &&
                    ((0, utilities_1.insideReactComponent)(node) || (0, utilities_1.insideAPIRoute)(node)) &&
                    (0, utilities_1.isHook)(node) &&
                    BANNED_HOOKS.includes(hook)) {
                    context.report({
                        node,
                        data: { hook },
                        messageId: 'serverComponentBannedHooks',
                    });
                }
            },
        };
    },
});
