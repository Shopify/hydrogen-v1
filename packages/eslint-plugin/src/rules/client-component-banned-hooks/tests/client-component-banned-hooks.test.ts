import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {clientComponentBannedHooks} from '../client-component-banned-hooks';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function error(hookName: string) {
  return {
    type: AST_NODE_TYPES.CallExpression,
    data: {hook: hookName},
    messageId: 'clientComponentBannedHooks' as const,
  };
}

ruleTester.run(
  'hydrogen/client-component-banned-hooks',
  clientComponentBannedHooks,
  {
    valid: [
      {
        code: dedent`
        function ClientComponent() {
          return null;
        }
      `,
        filename: 'ClientComponent.client.tsx',
      },
      {
        code: dedent`
        function ClientComponent() {
          const [state, setState] = useState();
          return null;
        }
      `,
        filename: 'ClientComponent.client.tsx',
      },
      {
        code: dedent`
        function ClientComponent() {
          const [state, setState] = React.useState();
          return null;
        }
      `,
        filename: 'ClientComponent.client.tsx',
      },
      {
        code: dedent`
        function ClientComponent() {
          const {foo} = useBar();
          return null;
        }
      `,
        filename: 'ClientComponent.client.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const {data} = useQuery();
          return null;
        }
      `,
        filename: 'ServerComponent.server.tsx',
      },
    ],
    invalid: [
      {
        code: dedent`
        function ClientComponent() {
          const {data} = useQuery();
          return null;
        }
      `,
        errors: [error('useQuery')],
        filename: 'ClientComponent.client.tsx',
      },
    ],
  }
);
