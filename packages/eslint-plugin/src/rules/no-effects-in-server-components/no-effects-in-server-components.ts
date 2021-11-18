import {AST_NODE_TYPES} from '@typescript-eslint/types';

import {createRule, isClientComponent} from '../../utilities';

const BANNED_HOOKS = ['useEffect', 'useLayoutEffect'];

export const noEffectsInServerComponents = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevents `useEffect` and `useLayoutEffect` in React Server Components',
      category: 'Possible Errors',
      recommended: 'error',
    },
    messages: {
      noEffectsInServerComponents: `Do not use {{hook}} in React Server Components.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    return {
      CallExpression(node) {
        if (
          !isClientComponent(context.getFilename()) &&
          node.callee.type === AST_NODE_TYPES.Identifier &&
          BANNED_HOOKS.includes(node.callee.name)
        ) {
          context.report({
            node,
            data: {hook: node.callee.name},
            messageId: 'noEffectsInServerComponents',
          });
        }
      },
    };
  },
});
