import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {createRule} from '../../utilities';

const SCRIPT_TAG_NAME = 'Script';
// TODO: adapt to other frameworks (e.g. Next.js requires beforeInteractive @ `pages/_document.js`)
const ROOT_FILENAME = 'App.server.tsx';
const LOAD = {
  beforeHydration: 'beforeHydration',
  inWorker: 'inWorker',
};

export const scriptsInLayoutComponents = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'suggestion',
    schema: [],
    docs: {
      description: `Scripts loaded with \`${LOAD.beforeHydration}\` and \`${LOAD.inWorker}\` strategy should be placed inside ${ROOT_FILENAME}`,
      recommended: 'warn',
    },
    messages: {
      moveBeforeHydrationScript: `Scripts loaded with \`${LOAD.beforeHydration}\` strategy should be placed inside ${ROOT_FILENAME}. This ensures that the script is executed in all routes.`,
      moveInWorkerScript: `Scripts loaded with \`${LOAD.inWorker}\` strategy should be located inside ${ROOT_FILENAME}. This ensures that the script is executed in all routes.`,
    },
    hasSuggestions: true,
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const isScriptTag =
          node.type === AST_NODE_TYPES.JSXOpeningElement &&
          node?.name?.type === AST_NODE_TYPES.JSXIdentifier &&
          node?.name?.name === SCRIPT_TAG_NAME;

        if (!isScriptTag) return;

        const loadAttribute = node.attributes.find((attribute) => {
          // @ts-ignore
          return attribute.name.name === 'load';
        });

        if (!loadAttribute) return;

        const isBeforeHydration =
          // @ts-ignore
          loadAttribute.value.value === LOAD.beforeHydration;

        // @ts-ignore
        const isInWorker = loadAttribute.value.value === LOAD.inWorker;

        if (!context?.getPhysicalFilename) return;
        const filePath = context.getPhysicalFilename();
        const isAppFile = filePath.includes('App.server.');

        if (isBeforeHydration && !isAppFile) {
          context.report({
            node,
            messageId: 'moveBeforeHydrationScript',
          });
        }

        if (isInWorker && !isAppFile) {
          context.report({
            node,
            messageId: 'moveInWorkerScript',
          });
        }
      },
    };
  },
});
