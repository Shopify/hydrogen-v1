"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const types_1 = require("@typescript-eslint/types");
const prefer_image_component_1 = require("../prefer-image-component");
const dedent_1 = __importDefault(require("dedent"));
const ruleTester = new experimental_utils_1.TSESLint.RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
});
function error(options = {}) {
    const suggestions = options.suggestion
        ? {
            suggestions: [
                {
                    output: (0, dedent_1.default) `
          ${options.suggestion}
        `,
                    messageId: 'replaceWithImage',
                },
            ],
        }
        : {};
    return {
        type: types_1.AST_NODE_TYPES.JSXOpeningElement,
        messageId: 'preferImageComponent',
        ...suggestions,
    };
}
ruleTester.run('hydrogen/prefer-image-component', prefer_image_component_1.preferImageComponent, {
    valid: [
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          return <Image />;
        }
      `,
        },
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          return null;
        }
      `,
        },
    ],
    invalid: [
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          return <img />;
        }
      `,
            errors: [error()],
        },
        {
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
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
