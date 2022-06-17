"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientComponentBannedHooks = void 0;
const utilities_1 = require("../../utilities");
const BANNED_HOOKS = ['useQuery', 'useShopQuery'];
exports.clientComponentBannedHooks = (0, utilities_1.createRule)({
    name: `hydrogen/${__dirname}`,
    meta: {
        type: 'problem',
        docs: {
            description: `Prevent using ${new Intl.ListFormat('en').format(BANNED_HOOKS)} in client components`,
            recommended: 'error',
        },
        messages: {
            clientComponentBannedHooks: `Do not use {{hook}} in client components.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                const hook = (0, utilities_1.getHookName)(node);
                if ((0, utilities_1.isClientComponentFile)(context.getFilename()) &&
                    (0, utilities_1.isHook)(node) &&
                    BANNED_HOOKS.includes(hook)) {
                    context.report({
                        node,
                        data: { hook },
                        messageId: 'clientComponentBannedHooks',
                    });
                }
            },
        };
    },
});
