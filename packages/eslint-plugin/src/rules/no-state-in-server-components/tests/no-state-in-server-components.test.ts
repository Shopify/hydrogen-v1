import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {noStateInServerComponents} from '../no-state-in-server-components';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function error(hookName: string) {
  return {
    type: AST_NODE_TYPES.CallExpression,
    data: {hook: hookName},
    messageId: 'noStateInServerComponents' as 'noStateInServerComponents',
  };
}

ruleTester.run(
  'hydrogen/no-state-in-server-components',
  noStateInServerComponents,
  {
    valid: [
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
          const [state, dispatch] = useReducer(() => {}, {});
          return null;
        }
      `,
        filename: 'ClientComponent.client.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          return null;
        }
      `,
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const {foo} = useBar();
          return null;
        }
      `,
        filename: 'ServerComponent.server.tsx',
      },
    ],
    invalid: [
      {
        code: dedent`
        function ServerComponent() {
          const [state, setState] = useState();
          return null;
        }
      `,
        errors: [error('useState')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const [state, dispatch] = useReducer(() => {}, {});
          return null;
        }
      `,
        errors: [error('useReducer')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const [state, dispatch] = useReducer(() => {}, {});
          const [state, setState] = useState();
          return null;
        }
      `,
        errors: [error('useReducer'), error('useState')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const [state, setState] = useState();
          return null;
        }
      `,
        errors: [error('useState')],
        filename: 'ServerComponent.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const [state, dispatch] = useReducer(() => {}, {});
          return null;
        }
      `,
        errors: [error('useReducer')],
        filename: 'ServerComponent.tsx',
      },
      {
        code: dedent`
        function ServerComponent() {
          const [state, dispatch] = useReducer(() => {}, {});
          const [state, setState] = useState();
          return null;
        }
      `,
        errors: [error('useReducer'), error('useState')],
        filename: 'ServerComponent.tsx',
      },
    ],
  }
);
