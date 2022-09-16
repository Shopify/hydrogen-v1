import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {preferScriptComponent} from '../prefer-script-component';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

function error(options: {suggestion?: string} = {}) {
  const suggestions = options.suggestion
    ? {
        suggestions: [
          {
            output: dedent`${options.suggestion}`,
            messageId: 'replaceWithScript' as const,
          },
        ],
      }
    : {};
  // console.log({suggestions});
  return {
    type: AST_NODE_TYPES.JSXOpeningElement,
    messageId: 'preferScriptComponent' as const,
    ...suggestions,
  };
}

ruleTester.run('hydrogen/prefer-script-component', preferScriptComponent, {
  valid: [
    {
      code: dedent`
        function Component() {
          return <Script />;
        }
      `,
      filename: 'script.server.tsx',
    },
    {
      code: dedent`
        function Component() {
          return null;
        }
      `,
    },
  ],
  invalid: [
    {
      code: dedent`
        function Component() {
          return <script />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        function Component() {
          return <script async src="my-script.js" />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        function Component() {
          return <script dangerouslySetInnerHTML={{ __html: "console.log('hello')" }} />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        function Component() {
          return <script>{\`console.log('hello')\`}</script>;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        import React from 'react';

        function Component() {
          return <script type="module" src="my-script.js" />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        import {Money} from '@shopify/hydrogen';

        function Component() {
          return <script src="my-script.js" />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        import {Money} from '@shopify/hydrogen';

        function Component() {
          return (
            <>
              <script src="my-script.js" />;
              <script src="my-other-script.js" />;
            </>
          );
        }
      `,
      errors: [error(), error()],
    },
    {
      code: dedent`
        function Component() {
          return <script />
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Script} from '@shopify/hydrogen';

            function Component() {
              return <Script />
            }
          `,
        }),
      ],
    },
    {
      code: dedent`
        import {Money} from '@shopify/hydrogen';

        function Component() {
          return <script />
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Money, Script} from '@shopify/hydrogen';

            function Component() {
              return <Script />
            }
          `,
        }),
      ],
    },
  ],
});
