import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {serverComponentBannedHooks} from '../server-component-banned-hooks';
import dedent from 'dedent';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

function error(hookName: string) {
  return {
    type: AST_NODE_TYPES.CallExpression,
    data: {hook: hookName},
    messageId: 'serverComponentBannedHooks' as const,
  };
}

ruleTester.run(
  'hydrogen/server-component-banned-hooks',
  serverComponentBannedHooks,
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
      {
        code: dedent`
        function ClientComponent() {
          useEffect(() => {});
          return null;
        }
      `,
        filename: 'ClientComponent.client.tsx',
      },
      {
        code: dedent`
          function ClientComponent() {
            useLayoutEffect(() => {});
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
      {
        code: dedent`
          function ServerComponent() {
            useEffect(() => {});
            return null;
          }
        `,
        errors: [error('useEffect')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
          function ServerComponent() {
            useLayoutEffect(() => {});
            return null;
          }
        `,
        errors: [error('useLayoutEffect')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
          function ServerComponent() {
            useEffect(() => {});
            useLayoutEffect(() => {});
            return null;
          }
        `,
        errors: [error('useEffect'), error('useLayoutEffect')],
        filename: 'ServerComponent.server.tsx',
      },
      {
        code: dedent`
          function ServerComponent() {
            useEffect(() => {});
            return null;
          }
        `,
        errors: [error('useEffect')],
        filename: 'ServerComponent.tsx',
      },
      {
        code: dedent`
          function ServerComponent() {
            useEffect(() => {});
            return null;
          }
        `,
        errors: [error('useEffect')],
        filename: 'ServerComponent.tsx',
      },
      {
        code: dedent`
          function ServerComponent() {
            useLayoutEffect(() => {});
            useEffect(() => {});
            return null;
          }
        `,
        errors: [error('useLayoutEffect'), error('useEffect')],
        filename: 'ServerComponent.tsx',
      },

      {
        code: dedent`
          function ServerComponent() {
            React.useLayoutEffect(() => {});
            React.useEffect(() => {});
            return null;
          }
        `,
        errors: [error('useLayoutEffect'), error('useEffect')],
        filename: 'ServerComponent.tsx',
      },
    ],
  }
);
