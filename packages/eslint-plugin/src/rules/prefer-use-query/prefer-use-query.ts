import {AST_NODE_TYPES, TSESTree} from '@typescript-eslint/types';
import {pascalCase} from 'change-case';

import {createRule} from '../../utilities';

const FETCH_FUNCTION_NAME = 'fetch';
const USE_QUERY_COMPONENT_NAME = 'useQuery';
const HYDROGEN_MODULE_SOURCE = '@shopify/hydrogen';

export const preferUseQuery = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Prefer using \`${HYDROGEN_MODULE_SOURCE}\` \`${USE_QUERY_COMPONENT_NAME}\` hook in place of \`${FETCH_FUNCTION_NAME}\`.`,
      category: 'Best Practices',
      recommended: 'warn',
    },
    messages: {
      preferUseQuery: `Use the \`${HYDROGEN_MODULE_SOURCE}\` \`${USE_QUERY_COMPONENT_NAME}\` hook in place of \`${FETCH_FUNCTION_NAME}\`.`,
      importUseQuery: `Import the \`${USE_QUERY_COMPONENT_NAME}\` from ${HYDROGEN_MODULE_SOURCE}.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    let hydrogenImportNode: TSESTree.ImportDeclaration | undefined;
    let lastImportNode: TSESTree.ImportDeclaration;
    let inReactComponent = false;
    let inUseQuery = false;

    return {
      ImportDeclaration(node) {
        if (hydrogenImportNode) {
          return;
        }

        hydrogenImportNode =
          node.source.value === HYDROGEN_MODULE_SOURCE ? node : undefined;
        lastImportNode = node;
      },
      FunctionDeclaration(node) {
        inReactComponent = looksLikeReactComponent(node);
      },
      'FunctionDeclaration:exit': function (node) {
        inReactComponent = looksLikeReactComponent(node) && false;
      },
      CallExpression(node) {
        if (!inReactComponent) {
          return;
        }

        if (is('useQuery', node)) {
          inUseQuery = true;
        }

        if (is('fetch', node) && !inUseQuery) {
          context.report({
            node,
            messageId: 'preferUseQuery',
            suggest: [
              {
                messageId: 'importUseQuery',
                fix: function (fixer) {
                  if (hydrogenImportNode) {
                    if (
                      hydrogenImportNode.specifiers.some(
                        (specifier) =>
                          specifier.local.name === USE_QUERY_COMPONENT_NAME
                      )
                    ) {
                      return [];
                    }

                    const lastSpecifier =
                      hydrogenImportNode.specifiers[
                        hydrogenImportNode.specifiers.length - 1
                      ];

                    const importFix = fixer.insertTextAfter(
                      lastSpecifier,
                      `, ${USE_QUERY_COMPONENT_NAME}`
                    );

                    return [importFix];
                  }

                  const importFix = lastImportNode
                    ? fixer.insertTextAfter(
                        lastImportNode,
                        `import {${USE_QUERY_COMPONENT_NAME}} from '${HYDROGEN_MODULE_SOURCE}';\n\n`
                      )
                    : fixer.insertTextBefore(
                        context.getAncestors()[0],
                        `import {${USE_QUERY_COMPONENT_NAME}} from '${HYDROGEN_MODULE_SOURCE}';\n\n`
                      );

                  return [importFix];
                },
              },
            ],
          });
        }
      },
      'CallExpression:exit': function (node) {
        if (is('useQuery', node)) {
          inUseQuery = false;
        }
      },
    };
  },
});

function looksLikeReactComponent(node: TSESTree.FunctionDeclaration) {
  if (!node.id) {
    return false;
  }

  return node.id.name === pascalCase(node.id.name);
}

function is(name: string, node: TSESTree.CallExpression) {
  return (
    node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === name
  );
}
