import {AST_NODE_TYPES} from '@typescript-eslint/types';

import {createRule, isClientComponent} from '../../utilities';

const BANNED_HOOKS = ['useState', 'useReducer'];

export const noStateInServerComponents = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevents `useState` and `useReducer` in React Server Components',
      category: 'Possible Errors',
      recommended: 'error',
    },
    messages: {
      noStateInServerComponents: `Do not use {{hook}} in React Server Components. These components only run once and therefore cannot handle state like traditional client components.`,
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
            messageId: 'noStateInServerComponents',
          });
        }
      },
    };
  },
});
