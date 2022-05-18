import {AST_NODE_TYPES, TSESTree} from '@typescript-eslint/types';

import {
  createRule,
  isServerComponentFile,
  isClientComponentFile,
} from '../../utilities';

export const validFetchSync = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      description: 'TODO',
      category: 'Possible Errors',
      recommended: 'warn',
    },
    messages: {
      serverInvalidFetchSync:
        'Import fetchSync from `@shopify/hydrogen` in server components',
      clientInvalidFetchSync:
        'Import fetchSync from `@shopify/hydrogen/client` in client components',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const imported = node.specifiers.map(
          (specifier) => specifier.local.name
        );

        if (!imported.includes('fetchSync')) {
          return;
        }

        const filename = context.getFilename();

        if (isServerComponentFile(filename) && isHydrogenClientImport(node)) {
          context.report({
            node,
            messageId: 'serverInvalidFetchSync',
          });
        }

        if (isClientComponentFile(filename) && isHydrogenServerImport(node)) {
          context.report({
            node,
            messageId: 'clientInvalidFetchSync',
          });
        }
      },
    };
  },
});

function isHydrogenServerImport(node: TSESTree.ImportDeclaration) {
  return (
    node.source.type === AST_NODE_TYPES.Literal &&
    node.source.value === '@shopify/hydrogen'
  );
}

function isHydrogenClientImport(node: TSESTree.ImportDeclaration) {
  return (
    node.source.type === AST_NODE_TYPES.Literal &&
    node.source.value === '@shopify/hydrogen/client'
  );
}
