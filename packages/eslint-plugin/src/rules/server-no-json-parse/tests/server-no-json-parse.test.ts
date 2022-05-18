import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {serverNoJsonParse} from '../server-no-json-parse';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

function error() {
  return {
    type: AST_NODE_TYPES.ExpressionStatement,
    messageId: 'serverNoJsonParse' as const,
  };
}

ruleTester.run('hydrogen/server-no-json-parse', serverNoJsonParse, {
  valid: [
    {
      code: dedent`
        function SomeComponent() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
    },
    {
      code: dedent`
        function SomeComponent() {
          return null
        }
      `,
      filename: 'some-component.server.tsx',
    },
    {
      code: dedent`
        function SomeComponent() {
          return null
        }
      `,
      filename: 'some-component.server.tsx',
    },
    {
      code: dedent`
        JSON.parse(someUnsafeJSONObject);

        export async function api() {
          return {}
        }
      `,
      filename: 'some-component.server.tsx',
    },
    {
      code: dedent`
        JSON.parse(someUnsafeJSONObject);

        export function SomeComponent() {
          return {}
        }
      `,
      filename: 'some-component.server.tsx',
    },
  ],
  invalid: [
    {
      code: dedent`
        function SomeComponent() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
      errors: [error()],
      filename: 'some-component.server.tsx',
    },
    {
      code: dedent`
        export async function api() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
      errors: [error()],
      filename: 'some-component.server.tsx',
    },
    {
      code: dedent`
        export async function api() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
      errors: [error()],
      filename: 'some-component.server.tsx',
    },
  ],
});
