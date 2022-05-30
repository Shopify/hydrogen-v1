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

function error(options: {fix?: string} = {}) {
  return {
    type: AST_NODE_TYPES.ImportDeclaration,
    messageId: 'preferGQL' as const,
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
      output: dedent`
        import {gql} from '@shopify/hydrogen';
      `,
    },
    {
      code: dedent`
          import {gql} from 'graphql-tag';
          `,
      errors: [error()],
      output: dedent`
        import {gql} from '@shopify/hydrogen';
      `,
    },
    {
      code: dedent`
            import {Image} from '@shopify/hydrogen';
            import {gql} from 'graphql-tag';
          `,
      errors: [error()],
      output: `import {Image, gql} from '@shopify/hydrogen';
`,
    },
  ],
});
