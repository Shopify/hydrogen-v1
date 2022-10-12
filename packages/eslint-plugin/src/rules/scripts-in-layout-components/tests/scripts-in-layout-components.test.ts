import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {scriptsInLayoutComponents} from '../scripts-in-layout-components';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

function error(options: {suggestion?: string; messageId?: string} = {}) {
  console.log(options);
  const suggestions = options.suggestion
    ? {
        suggestions: [
          {
            output: dedent`${options.suggestion}`,
            messageId: 'moveBeforeHydrationScript' as const,
          },
        ],
      }
    : {};

  const messageId = options?.messageId ?? '';

  return {
    type: AST_NODE_TYPES.JSXOpeningElement,
    messageId,
    ...suggestions,
  };
}

ruleTester.run(
  'hydrogen/scripts-in-layout-components',
  scriptsInLayoutComponents,
  {
    valid: [
      {
        code: dedent`
        function Component() {
          return <Script load="beforeHydration" />;
        }
      `,
        filename: 'App.server.tsx',
      },
    ],
    invalid: [
      {
        code: dedent`
        function Component() {
          return <Script load="beforeHydration" />;
        }
      `,
        filename: 'Test.server.tsx',
        // @ts-ignore
        errors: [error({messageId: 'moveBeforeHydrationScript'})],
      },
      {
        code: dedent`
        function Component() {
          return <Script load="inWorker" />;
        }
      `,
        filename: 'Test.server.tsx',
        // @ts-ignore
        errors: [error({messageId: 'moveInWorkerScript'})],
      },
    ],
  }
);
