import {AST_NODE_TYPES, TSESTree} from '@typescript-eslint/types';
import {TSESLint} from '@typescript-eslint/experimental-utils';

import {createRule} from '../../utilities';

const SCRIPT_TAG_NAME = 'script';
const SCRIPT_COMPONENT_NAME = 'Script';

export const preferScriptComponent = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Prefer using the \`${SCRIPT_COMPONENT_NAME}\` component instead of HTML \`${SCRIPT_TAG_NAME}\` tags`,
      recommended: 'warn',
    },
    messages: {
      preferScriptComponent: `Use the \`${SCRIPT_COMPONENT_NAME}\` component from '@shopify/hydrogen' instead of \`${SCRIPT_TAG_NAME}\` tags.`,
      replaceWithScript: `Replace \`${SCRIPT_TAG_NAME}\` tags with the \`${SCRIPT_COMPONENT_NAME}\` component from @shopify/hydrogen.`,
    },
    schema: [],
    hasSuggestions: true,
  },
  defaultOptions: [],
  create(context) {
    let hydrogenImportNode: TSESTree.ImportDeclaration | undefined;
    let lastImportNode: TSESTree.ImportDeclaration;

    return {
      ImportDeclaration(node) {
        lastImportNode = node;

        const isHydrogenImport = node.source.value === '@shopify/hydrogen';
        if (isHydrogenImport) {
          hydrogenImportNode = node;
        }
      },
      JSXOpeningElement(node) {
        const isScriptTag =
          node.type === AST_NODE_TYPES.JSXOpeningElement &&
          node?.name?.type === AST_NODE_TYPES.JSXIdentifier &&
          node?.name?.name === SCRIPT_TAG_NAME;

        if (!isScriptTag) return;

        context.report({
          node,
          messageId: 'preferScriptComponent',
          suggest: [
            {
              messageId: 'replaceWithScript',
              fix(fixer) {
                // replace <script with <Script
                const [tagStart] = node.range;
                const tagFix = fixer.replaceTextRange(
                  [tagStart + 1, tagStart + 2],
                  'S'
                );

                const firstImportNode =
                  context.getAncestors()[0] as TSESTree.ImportDeclaration;

                const importFix = hydrogenImportNode
                  ? maybeAppendScriptToHydrogenImport(fixer, hydrogenImportNode)
                  : createHydrogenImport(
                      fixer,
                      firstImportNode,
                      lastImportNode
                    );

                return importFix ? [tagFix, importFix] : [tagFix];
              },
            },
          ],
        });
      },
    };
  },
});

// A'@shopify/hydrogen' import exists, add it to the end if not already imported
function maybeAppendScriptToHydrogenImport(
  fixer: TSESLint.RuleFixer,
  hydrogenImportNode: TSESTree.ImportDeclaration
) {
  const isScriptComp = (specifier: TSESTree.ImportClause) =>
    specifier.local.name === SCRIPT_COMPONENT_NAME;
  const importHasScript = hydrogenImportNode.specifiers.some(isScriptComp);

  // is Script is already imported
  if (importHasScript) {
    return undefined;
  }

  // else, append the named Script component to @shopify/hydrogen import
  const importsCount = hydrogenImportNode.specifiers.length - 1;
  const lastSpecifier = hydrogenImportNode.specifiers[importsCount];

  return fixer.insertTextAfter(lastSpecifier, `, ${SCRIPT_COMPONENT_NAME}`);
}

// Create a new '@shopify/hydrogen' import with the Script component
function createHydrogenImport(
  fixer: TSESLint.RuleFixer,
  firstImportNode: TSESTree.ImportDeclaration,
  lastImportNode: TSESTree.ImportDeclaration
) {
  const hydrogenImport = `import {${SCRIPT_COMPONENT_NAME}} from '@shopify/hydrogen';`;
  function addAsLastImport() {
    return fixer.insertTextAfter(lastImportNode, `\n${hydrogenImport}`);
  }

  function addAsOnlyImport() {
    return fixer.insertTextBefore(firstImportNode, `${hydrogenImport}\n\n`);
  }

  return lastImportNode ? addAsLastImport() : addAsOnlyImport();
}
