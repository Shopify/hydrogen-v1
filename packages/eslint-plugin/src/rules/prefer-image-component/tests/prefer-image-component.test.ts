import {TSESLint} from '@typescript-eslint/experimental-utils';
import {AST_NODE_TYPES} from '@typescript-eslint/types';
import {preferImageComponent} from '../prefer-image-component';
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
            messageId: 'replaceWithImage' as const,
          },
        ],
      }
    : {};
  return {
    type: AST_NODE_TYPES.JSXOpeningElement,
    messageId: 'preferImageComponent' as const,
    ...suggestions,
  };
}

ruleTester.run('hydrogen/prefer-image-component', preferImageComponent, {
  valid: [
    {
      code: dedent`
        function SomeComponent() {
          return <Image />;
        }
      `,
    },
    {
      code: dedent`
        function SomeComponent() {
          return null;
        }
      `,
    },
  ],
  invalid: [
    {
      code: dedent`
        function SomeComponent() {
          return <img />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        function SomeComponent() {
          return <img 
            src="/one.png"
            alt="One"
            width={500}
            height={500}
          />;
        }
      `,
      errors: [error()],
    },
    {
      code: dedent`
        function SomeComponent() {
          return (
            <>
              <img 
                src="/one.png"
                alt="One"
                width={500}
                height={500}
              />;
              <img 
                src="/two.png"
                alt="Two"
                width={300}
                height={300}
              />;
            </>
          );
        }
      `,
      errors: [error(), error()],
    },
    {
      code: dedent`
        function SomeComponent() {
          return <img />
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Image} from '@shopify/hydrogen';

            function SomeComponent() {
              return <Image />
            }
          `,
        }),
      ],
    },
    {
      code: dedent`
        function SomeComponent() {
          return <img 
            src="/one.png"
            alt="One"
            width={300}
            height={300}
          />;
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Image} from '@shopify/hydrogen';

            function SomeComponent() {
              return <Image 
                src="/one.png"
                alt="One"
                width={300}
                height={300}
              />;
            }
          `,
        }),
      ],
    },
    {
      code: dedent`
        import {Image} from '@shopify/hydrogen';

        function SomeComponent() {
          return <img
            src="/one.png"
            alt="One"
            width={300}
            height={300}
          />;
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Image} from '@shopify/hydrogen';

            function SomeComponent() {
              return <Image
                src="/one.png"
                alt="One"
                width={300}
                height={300}
              />;
            }
          `,
        }),
      ],
    },
    {
      code: dedent`
        import {Button} from '@shopify/hydrogen';

        function SomeComponent() {
          return <img
            src="/one.png"
            alt="One"
            width={300}
            height={300}
          />;
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Button, Image} from '@shopify/hydrogen';

            function SomeComponent() {
              return <Image
                src="/one.png"
                alt="One"
                width={300}
                height={300}
              />;
            }
          `,
        }),
      ],
    },
    {
      code: dedent`
        import {Button} from '@shopify/hydrogen';

        function SomeComponent() {
          return (
            <>
              <img
                src="/one.png"
                alt="One"
                width={300}
                height={300}
              />
              <img
                src="/two.png"
                alt="Two"
                width={300}
                height={300}
              />
            </>
          );
        }
      `,
      errors: [
        error({
          suggestion: `
            import {Button, Image} from '@shopify/hydrogen';

            function SomeComponent() {
              return (
                <>
                  <Image
                    src="/one.png"
                    alt="One"
                    width={300}
                    height={300}
                  />
                  <img
                    src="/two.png"
                    alt="Two"
                    width={300}
                    height={300}
                  />
                </>
              );
            }
          `,
        }),
        error({
          suggestion: `
            import {Button, Image} from '@shopify/hydrogen';

            function SomeComponent() {
              return (
                <>
                  <img
                    src="/one.png"
                    alt="One"
                    width={300}
                    height={300}
                  />
                  <Image
                    src="/two.png"
                    alt="Two"
                    width={300}
                    height={300}
                  />
                </>
              );
            }
          `,
        }),
      ],
    },
  ],
});
