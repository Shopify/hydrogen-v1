import {createRule, isServerComponentFile} from '../../utilities';
import {TSESTree} from '@typescript-eslint/types';
const SCRIPT_CALLBACKS = ['onLoad', 'onReady', 'onError'];

export const noScriptCallbacksInServerComponents = createRule({
  name: `hydrogen/${__dirname}`,
  meta: {
    type: 'problem',
    docs: {
      description: `Prevent using ${new (Intl as any).ListFormat('en').format(
        SCRIPT_CALLBACKS
      )} <Script /> callback(s) in server components`,
      recommended: 'error',
    },
    messages: {
      noScriptCallbacksInServerComponents: `Can't use <Script /> {{callback}} callback(s) inside server components.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        const isServerComponent = isServerComponentFile(context.getFilename());
        if (!isServerComponent) return;

        const element = node.name as TSESTree.JSXIdentifier;
        const elementType = element.name;
        const isScript = elementType === 'Script';

        if (!isScript) return;

        const scriptAttributes = node.attributes as TSESTree.JSXAttribute[];

        if (!scriptAttributes.length) return;

        const callbackAttributes = scriptAttributes
          .map((attribute: TSESTree.JSXAttribute) => {
            const attributeNode = attribute.name as TSESTree.JSXIdentifier;
            return attributeNode.name;
          })
          .filter((attribute) => SCRIPT_CALLBACKS.includes(attribute));

        if (!callbackAttributes.length) return;

        context.report({
          node,
          data: {callback: callbackAttributes.join(', ')},
          messageId: 'noScriptCallbacksInServerComponents',
        });
      },
    };
  },
});
