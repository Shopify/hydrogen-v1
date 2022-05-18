import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {validFetchSync} from '../valid-fetch-sync';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

function error(messageId: 'serverInvalidFetchSync' | 'clientInvalidFetchSync') {
  return {
    type: AST_NODE_TYPES.ImportDeclaration,
    messageId,
  };
}

ruleTester.run('hydrogen/valid-fetch-sync', validFetchSync, {
  valid: [
    {
      code: dedent`
        import {fetchSync} from '@shopify/hydrogen';
      `,
      filename: 'ServerComponent.server.tsx',
    },
    {
      code: dedent`
        import {fetchSync} from '@shopify/hydrogen/client';
      `,
      filename: 'ClientComponent.client.tsx',
    },
  ],
  invalid: [
    {
      code: dedent`
        import {fetchSync} from '@shopify/hydrogen/client';
      `,
      filename: 'ServerComponent.server.tsx',
      errors: [error('serverInvalidFetchSync')],
    },
    {
      code: dedent`
        import {fetchSync} from '@shopify/hydrogen';
      `,
      filename: 'ClientComponent.client.tsx',
      errors: [error('clientInvalidFetchSync')],
    },
  ],
});
