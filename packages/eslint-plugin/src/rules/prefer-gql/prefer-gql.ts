import {TSESTree} from '@typescript-eslint/types';

import {createRule} from '../../utilities';

export const preferGQL = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using the `gql` utility from hydrogen',
      recommended: 'warn',
    },
    messages: {
      preferGQL: `Use the \`gql\` utility from '@shopify/hydrogen'.`,
      replaceWithGQL: `Replace with the \`gql\` utility from @shopify/hydrogen.`,
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    let hydrogenImportNode: TSESTree.ImportDeclaration | undefined;
    let lastImportNode: TSESTree.ImportDeclaration;

    return {
      ImportDeclaration(node) {
        const imported = node.specifiers.map(
          (specifier) => specifier.local.name
        );

        hydrogenImportNode =
          node.source.value === '@shopify/hydrogen' ? node : hydrogenImportNode;
        lastImportNode = node;

        if (imported.includes('gql') && node !== hydrogenImportNode) {
          return context.report({
            node,
            messageId: 'preferGQL',
            fix(fixer) {
              const tagFix = fixer.replaceTextRange(
                [node.range[0] + 1, node.range[0] + 4],
                'gql'
              );
              let importFix = lastImportNode
                ? fixer.insertTextAfter(
                    lastImportNode,
                    `import {gql} from '@shopify/hydrogen';`
                  )
                : fixer.insertTextBefore(
                    context.getAncestors()[0],
                    `import {gql} from '@shopify/hydrogen';`
                  );

              if (hydrogenImportNode) {
                if (
                  hydrogenImportNode.specifiers.some(
                    (specifier) => specifier.local.name === `gql`
                  )
                ) {
                  return [tagFix];
                }

                const lastSpecifier =
                  hydrogenImportNode.specifiers[
                    hydrogenImportNode.specifiers.length - 1
                  ];

                importFix = fixer.insertTextAfter(lastSpecifier, `, gql`);
              }

              return [fixer.remove(node), importFix];
            },
          });
        }
      },
    };
  },
});
