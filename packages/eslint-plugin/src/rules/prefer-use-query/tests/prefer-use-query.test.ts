import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {preferUseQuery} from '../prefer-use-query';
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
            output: dedent`
          ${options.suggestion}
        `,
            messageId: 'importUseQuery' as const,
          },
        ],
      }
    : {};
  return {
    type: AST_NODE_TYPES.CallExpression,
    messageId: 'preferUseQuery' as const,
    ...suggestions,
  };
}

ruleTester.run('hydrogen/prefer-use-query', preferUseQuery, {
  valid: [
    {
      code: dedent`
        fetch();
      `,
    },
    {
      code: dedent`
        const {data} = useQuery(['unique', 'key'], async () => {
          const response = await fetch('https://my.api.com');
        
          return await response.json();
        });
      `,
    },
    {
      code: dedent`
        import {useQuery} from '@shopify/hydrogen';

        export default function Page() {
          const {data} = useQuery(['unique', 'key'], async () => {
            const response = await fetch('https://my.api.com');
        
            return await response.json();
          });
        
          return <h1>{data.title}</h1>;
        }
      `,
    },
  ],
  invalid: [
    {
      code: dedent`
        function SomeReactComponent() {
          useEffect(() => {
            const fetchData = async () => {
              const result = await fetch('https://my.api.com');
            };
        
            fetchData();
          }, []);
          
          return null;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        export function SomeOtherReactComponent() {
          await fetch('https://my.api.com');
          
          return null;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        import {useQuery} from '@shopify/hydrogen';

        function SomeReactComponent() {
          useEffect(() => {
            const fetchData = async () => {
              const result = await fetch('https://my.api.com');
            };
        
            fetchData();
          }, []);
          
          return null;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        import {Button} from '@shopify/hydrogen';

        function SomeReactComponent() {
          useEffect(() => {
            const fetchData = async () => {
              const result = await fetch('https://my.api.com');
            };
        
            fetchData();
          }, []);
          
          return <Button>Click me</Button>;
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Button, useQuery} from '@shopify/hydrogen';

            function SomeReactComponent() {
              useEffect(() => {
                const fetchData = async () => {
                  const result = await fetch('https://my.api.com');
                };
            
                fetchData();
              }, []);
              
              return <Button>Click me</Button>;
            }
          `,
        }),
      ],
    },
  ],
});
