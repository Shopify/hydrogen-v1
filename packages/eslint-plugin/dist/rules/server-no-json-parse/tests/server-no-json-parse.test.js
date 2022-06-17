"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const types_1 = require("@typescript-eslint/types");
const server_no_json_parse_1 = require("../server-no-json-parse");
const dedent_1 = __importDefault(require("dedent"));
const ruleTester = new experimental_utils_1.TSESLint.RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
});
function error() {
    return {
        type: types_1.AST_NODE_TYPES.ExpressionStatement,
        messageId: 'serverNoJsonParse',
    };
}
ruleTester.run('hydrogen/server-no-json-parse', server_no_json_parse_1.serverNoJsonParse, {
    valid: [
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
        },
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          return null
        }
      `,
            filename: 'some-component.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          return null
        }
      `,
            filename: 'some-component.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        JSON.parse(someUnsafeJSONObject);

        export async function api() {
          return {}
        }
      `,
            filename: 'some-component.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        JSON.parse(someUnsafeJSONObject);

        export function SomeComponent() {
          return {}
        }
      `,
            filename: 'some-component.server.tsx',
        },
    ],
    invalid: [
        {
            code: (0, dedent_1.default) `
        function SomeComponent() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
            errors: [error()],
            filename: 'some-component.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        export async function api() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
            errors: [error()],
            filename: 'some-component.server.tsx',
        },
        {
            code: (0, dedent_1.default) `
        export async function api() {
          JSON.parse(someUnsafeJSONObject);
          return null
        }
      `,
            errors: [error()],
            filename: 'some-component.server.tsx',
        },
    ],
});
