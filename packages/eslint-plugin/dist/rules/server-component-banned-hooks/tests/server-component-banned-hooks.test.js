"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const types_1 = require("@typescript-eslint/types");
const server_component_banned_hooks_1 = require("../server-component-banned-hooks");
const dedent_1 = __importDefault(require("dedent"));
const ruleTester = new experimental_utils_1.TSESLint.RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
});
function error(hookName) {
    return {
        type: types_1.AST_NODE_TYPES.CallExpression,
        data: { hook: hookName },
        messageId: 'serverComponentBannedHooks',
    };
}
ruleTester.run('hydrogen/server-component-banned-hooks', server_component_banned_hooks_1.serverComponentBannedHooks, {
    valid: [
        {
            code: (0, dedent_1.default) `
        function ClientComponent() {
          const [state, setState] = useState();
          return null;
        }
      `,
            filename: 'ClientComponent.client.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function ClientComponent() {
          const [state, dispatch] = useReducer(() => {}, {});
          return null;
        }
      `,
            filename: 'ClientComponent.client.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function ServerComponent() {
          return null;
        }
      `,
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function ServerComponent() {
          const {foo} = useBar();
          return null;
        }
      `,
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function ClientComponent() {
          useEffect(() => {});
          return null;
        }
      `,
            filename: 'ClientComponent.client.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ClientComponent() {
            useLayoutEffect(() => {});
            return null;
          }
        `,
            filename: 'ClientComponent.client.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ServerComponent() {
            return null;
          }
        `,
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ServerComponent() {
            const {foo} = useBar();
            return null;
          }
        `,
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ServerComponent() {
            useLayoutEffect(() => {});
            useEffect(() => {});
            return null;
          }
        `,
            filename: 'ServerComponent.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ServerComponent() {
            useEffect(() => {});
            return null;
          }
        `,
            filename: 'ServerComponent.tsx',
        },
    ],
    invalid: [
        {
            code: (0, dedent_1.default) `
        function ServerComponent() {
          const [state, setState] = useState();
          return null;
        }
      `,
            errors: [error('useState')],
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function ServerComponent() {
          const [state, dispatch] = useReducer(() => {}, {});
          return null;
        }
      `,
            errors: [error('useReducer')],
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
          function ServerComponent() {
            useEffect(() => {});
            return null;
          }
        `,
            errors: [error('useEffect')],
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ServerComponent() {
            useLayoutEffect(() => {});
            return null;
          }
        `,
            errors: [error('useLayoutEffect')],
            filename: 'ServerComponent.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
          function ServerComponent() {
            useEffect(() => {});
            useLayoutEffect(() => {});
            return null;
          }
        `,
            errors: [error('useEffect'), error('useLayoutEffect')],
            filename: 'ServerComponent.server.tsx',
        },
    ],
});
