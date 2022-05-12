import {AST_NODE_TYPES} from '@typescript-eslint/types';

import {
  createRule,
  isServerComponentFile,
  insideReactComponent,
  insideAPIRoute,
} from '../../utilities';

export const serverNoJsonParse = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer using the `Image` component instead of HTML `img` tags',
      category: 'Best Practices',
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
        if (
          node.expression.type === AST_NODE_TYPES.CallExpression &&
          node.expression.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.expression.callee.object.type === AST_NODE_TYPES.Identifier &&
          node.expression.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.expression.callee.object.name === 'JSON' &&
          node.expression.callee.property.name === 'parse' &&
          isServerComponentFile(context.getFilename()) &&
          (insideReactComponent(node) || insideAPIRoute(node))
        ) {
          context.report({
            node,
            messageId: 'serverNoJsonParse',
          });
        }
      },
    };
  },
});
