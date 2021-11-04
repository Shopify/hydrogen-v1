import {AST_NODE_TYPES, TSESTree} from '@typescript-eslint/types';

import {createRule} from '../../utilities';

const IMAGE_TAG_NAME = 'img';
const IMAGE_COMPONENT_NAME = 'Image';

export const preferImageComponent = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer using @shopify/hydrogen `Image` component in place of HTML `img` tags',
      category: 'Best Practices',
      recommended: 'warn',
    },
    messages: {
      preferImageComponent: `Use the \`Image\` component from '@shopify/hydrogen' in place of \`${IMAGE_TAG_NAME}\` tags.`,
      replaceWithImage: `Replace the \`${IMAGE_TAG_NAME}\` with @shopify/hydrogen \`Image\`.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create: function (context) {
    let hydrogenImportNode: TSESTree.ImportDeclaration | undefined;
    let lastImportNode: TSESTree.ImportDeclaration;

    return {
      ImportDeclaration(node) {
        if (hydrogenImportNode) {
          return;
        }

        hydrogenImportNode =
          node.source.value === '@shopify/hydrogen' ? node : undefined;
        lastImportNode = node;
      },
      JSXOpeningElement(node) {
        if (
          node.type === AST_NODE_TYPES.JSXOpeningElement &&
          node.name.type === AST_NODE_TYPES.JSXIdentifier &&
          node.name.name === IMAGE_TAG_NAME
        ) {
          context.report({
            node,
            messageId: 'preferImageComponent',
            suggest: [
              {
                messageId: 'replaceWithImage',
                fix: function (fixer) {
                  const tagFix = fixer.replaceTextRange(
                    [node.range[0] + 1, node.range[0] + 4],
                    IMAGE_COMPONENT_NAME
                  );
                  let importFix = lastImportNode
                    ? fixer.insertTextAfter(
                        lastImportNode,
                        `import {${IMAGE_COMPONENT_NAME}} from '@shopify/hydrogen';\n\n`
                      )
                    : fixer.insertTextBefore(
                        context.getAncestors()[0],
                        `import {${IMAGE_COMPONENT_NAME}} from '@shopify/hydrogen';\n\n`
                      );

                  if (hydrogenImportNode) {
                    if (
                      hydrogenImportNode.specifiers.some(
                        (specifier) =>
                          specifier.local.name === IMAGE_COMPONENT_NAME
                      )
                    ) {
                      return [tagFix];
                    }

                    const lastSpecifier =
                      hydrogenImportNode.specifiers[
                        hydrogenImportNode.specifiers.length - 1
                      ];

                    importFix = fixer.insertTextAfter(
                      lastSpecifier,
                      `, ${IMAGE_COMPONENT_NAME}`
                    );
                  }

                  return [tagFix, importFix];
                },
              },
            ],
          });
        }
      },
    };
  },
});
