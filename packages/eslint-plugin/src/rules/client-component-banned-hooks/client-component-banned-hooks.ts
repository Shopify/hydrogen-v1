import {
  createRule,
  getHookName,
  isClientComponent,
  isHook,
} from '../../utilities';

const BANNED_HOOKS = ['useQuery', 'useShopQuery'];

export const clientComponentBannedHooks = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      //@ts-expect-error
      description: `Prevent using ${new Intl.ListFormat('en').format(
        BANNED_HOOKS
      )} in client components`,
      category: 'Possible Errors',
      recommended: 'error',
    },
    messages: {
      clientComponentBannedHooks: `Do not use {{hook}} in client components.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    return {
      CallExpression(node) {
        const hook = getHookName(node);

        if (
          isClientComponent(context.getFilename()) &&
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
