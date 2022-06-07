import {
  createRule,
  isHook,
  isServerComponentFile,
  getHookName,
  insideReactComponent,
  insideAPIRoute,
} from '../../utilities';

const BANNED_STATE_HOOKS = ['useState', 'useReducer'];
const BANNED_EFFECT_HOOKS = ['useEffect', 'useLayoutEffect'];
const BANNED_HOOKS = [...BANNED_STATE_HOOKS, ...BANNED_EFFECT_HOOKS];

export const serverComponentBannedHooks = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      description: `Prevent using ${new (Intl as any).ListFormat('en').format(
        BANNED_HOOKS
      )} in server and shared components`,
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
        const hook = getHookName(node);

        if (
          isServerComponentFile(context.getFilename()) &&
          (insideReactComponent(node) || insideAPIRoute(node)) &&
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
