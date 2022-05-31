import {
  createRule,
  getHookName,
  isClientComponentFile,
  isHook,
} from '../../utilities';

const BANNED_HOOKS = ['useQuery', 'useShopQuery'];

export const clientComponentBannedHooks = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      description: `Prevent using ${new (Intl as any).ListFormat('en').format(
        BANNED_HOOKS
      )} in client components`,
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
        const hook = getHookName(node);

        if (
          isClientComponentFile(context.getFilename()) &&
          isHook(node) &&
          BANNED_HOOKS.includes(hook)
        ) {
          context.report({
            node,
            data: {hook},
            messageId: 'clientComponentBannedHooks',
          });
        }
      },
    };
  },
});
