"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const types_1 = require("@typescript-eslint/types");
const prefer_gql_1 = require("../prefer-gql");
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
    return {
        type: types_1.AST_NODE_TYPES.ImportDeclaration,
        messageId: 'preferGQL',
    };
}
ruleTester.run('hydrogen/prefer-gql', prefer_gql_1.preferGQL, {
    valid: [
        {
            code: (0, dedent_1.default) `
        import {gql} from '@shopify/hydrogen';
      `,
        },
    ],
    invalid: [
        {
            code: (0, dedent_1.default) `
          import {gql} from 'graphql-tag';
        `,
            errors: [error()],
            output: (0, dedent_1.default) `
        import {gql} from '@shopify/hydrogen';
      `,
        },
        {
            code: (0, dedent_1.default) `
          import {gql} from 'graphql-tag';
          `,
            errors: [error()],
            output: (0, dedent_1.default) `
        import {gql} from '@shopify/hydrogen';
      `,
        },
        {
            code: (0, dedent_1.default) `
            import {Image} from '@shopify/hydrogen';
            import {gql} from 'graphql-tag';
          `,
            errors: [error()],
            output: `import {Image, gql} from '@shopify/hydrogen';
`,
        },
    ],
});
