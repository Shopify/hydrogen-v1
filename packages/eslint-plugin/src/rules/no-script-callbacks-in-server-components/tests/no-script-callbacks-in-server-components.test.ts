import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {noScriptCallbacksInServerComponents} from '../no-script-callbacks-in-server-components';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function error(callbackName: string) {
  return {
    type: AST_NODE_TYPES.JSXOpeningElement,
    data: {callback: callbackName},
    messageId: 'noScriptCallbacksInServerComponents' as const,
  };
}

ruleTester.run(
  'hydrogen/no-script-callbacks-in-server-components',
  noScriptCallbacksInServerComponents,
  {
    // Script callbacks ok in client components
    valid: [
      {
        code: dedent`
        function ServerComponent() {
          return null;
        }
      `,
        filename: 'ServerComponent.client.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          return <Script />;
        }
      `,
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        function ClientComponent() {
          return <Script onLoad={() => {}} />;
        }
      `,
        filename: 'ServerComponent.client.tsx',
      },
      {
        code: dedent`
        function ClientComponent() {
          return <Script onReady={() => {}} />;
        }
      `,
        filename: 'ServerComponent.client.tsx',
      },
      {
        code: dedent`
        function ClientComponent() {
          return <Script onError={() => {}} />;
        }
      `,
        filename: 'ServerComponent.client.tsx',
      },
    ],
    // Script callbacks not allowed in .server components
    invalid: [
      {
        code: dedent`
        import {Script} from '@shopify/hydrogen';

        function ServerComponent() {
          return (
            <Script onLoad={() => {}} />
          );
        }
      `,
        errors: [error('onLoad')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        import {Script} from '@shopify/hydrogen';

        function ServerComponent() {
          return (
            <Script onError={() => {}} />
          );
        }
      `,
        errors: [error('onError')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        import {Script} from '@shopify/hydrogen';

        function ServerComponent() {
          return (
            <Script onReady={() => {}} />
          );
        }
      `,
        errors: [error('onReady')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        import {Script} from '@shopify/hydrogen';

        function ServerComponent() {
          return (
            <Script onReady={() => {}} onLoad={() => {}} onError />
          );
        }
      `,
        errors: [error('onReady, onLoad, onError')],
        filename: 'ServerComponent.server.tsx',
      },
    ],
  }
);
