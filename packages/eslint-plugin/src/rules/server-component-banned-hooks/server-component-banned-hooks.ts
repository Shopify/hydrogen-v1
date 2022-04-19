import {
  createRule,
  isHook,
  isServerComponent,
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
      description: `Prevent using ${new Intl.ListFormat('en').format(
        BANNED_HOOKS
      )} in server and shared components`,
      category: 'Possible Errors',
      recommended: 'error',
    },
    messages: {
      serverComponentBannedHooks: `Do not use {{hook}} in files that don't end with .client.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    return {
      CallExpression(node) {
        const hook = getHookName(node);

        if (
          isServerComponent(context.getFilename()) &&
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
