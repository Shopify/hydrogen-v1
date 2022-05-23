import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {preferGQL} from '../prefer-gql';
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
            output: options.suggestion,
            messageId: 'replaceWithGQL' as const,
          },
        ],
      }
    : {};
  return {
    type: AST_NODE_TYPES.ImportDeclaration,
    messageId: 'preferGQL' as const,
    ...suggestions,
  };
}

ruleTester.run('hydrogen/prefer-gql', preferGQL, {
  valid: [
    {
      code: dedent`
        import {gql} from '@shopify/hydrogen';
      `,
    },
  ],
  invalid: [
    {
      code: dedent`
          import {gql} from 'graphql-tag';
        `,
      errors: [error()],
    },
    {
      code: dedent`
      import {gql} from 'graphql-tag';
      `,
      errors: [
        error({
          suggestion: dedent`
            import {gql} from '@shopify/hydrogen';
          `,
        }),
      ],
    },
    {
      code: dedent`
        import {Image} from '@shopify/hydrogen';
        import {gql} from 'graphql-tag';
      `,
      errors: [
        error({
          suggestion: `import {Image, gql} from '@shopify/hydrogen';
`,
        }),
      ],
    },
  ],
});
