import {
  createRule,
  isHook,
  isClientComponent,
  getHookName,
} from '../../utilities';

const BANNED_STATE_HOOKS = ['useState', 'useReducer'];
const BANNED_EFFECT_HOOKS = ['useEffect', 'useLayoutEffect'];
const BANNED_HOOKS = [...BANNED_STATE_HOOKS, ...BANNED_EFFECT_HOOKS];

export const serverComponentBannedHooks = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      //@ts-expect-error
      description: `Prevents ${new Intl.ListFormat('en').format(
        BANNED_HOOKS
      )} in React Server Components`,
      category: 'Possible Errors',
      recommended: 'error',
    },
    messages: {
      serverComponentBannedHooks: `Do not use {{hook}} in React Server Components.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    return {
      CallExpression(node) {
        const hook = getHookName(node);

        if (
          !isClientComponent(context.getFilename()) &&
          isHook(node) &&
          BANNED_HOOKS.includes(hook)
        ) {
          context.report({
            node,
            data: {hook},
            messageId: 'serverComponentBannedHooks',
          });
        }
      },
    };
  },
});
