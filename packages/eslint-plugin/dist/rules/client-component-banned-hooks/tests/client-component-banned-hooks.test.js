"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const types_1 = require("@typescript-eslint/types");
const client_component_banned_hooks_1 = require("../client-component-banned-hooks");
const dedent_1 = __importDefault(require("dedent"));
const ruleTester = new experimental_utils_1.TSESLint.RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
});
function error(hookName) {
    return {
        type: types_1.AST_NODE_TYPES.CallExpression,
        data: { hook: hookName },
        messageId: 'clientComponentBannedHooks',
    };
}
ruleTester.run('hydrogen/client-component-banned-hooks', client_component_banned_hooks_1.clientComponentBannedHooks, {
    valid: [
        {
            code: (0, dedent_1.default) `
        function ClientComponent() {
          return null;
        }
      `,
            filename: 'ClientComponent.client.tsx',
        },
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
          const [state, setState] = React.useState();
          return null;
        }
      `,
            filename: 'ClientComponent.client.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function ClientComponent() {
          const {foo} = useBar();
          return null;
        }
      `,
            filename: 'ClientComponent.client.tsx',
        },
        {
            code: (0, dedent_1.default) `
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
            code: (0, dedent_1.default) `
        function ClientComponent() {
          const {data} = useQuery();
          return null;
        }
      `,
            errors: [error('useQuery')],
            filename: 'ClientComponent.client.tsx',
        },
    ],
});
