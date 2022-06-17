export { rules } from './rules';
export declare const configs: {
    recommended: {
        extends: string[];
        plugins: string[];
        env: {
            es2021: boolean;
            browser: boolean;
            node: boolean;
        };
        settings: {
            react: {
                version: string;
            };
        };
        parserOptions: {
            ecmaFeatures: {
                jsx: boolean;
            };
            sourceType: string;
        };
        rules: {
            '@shopify/jsx-no-complex-expressions': string;
            '@shopify/jsx-no-hardcoded-content': string;
            'eslint-comments/no-unused-disable': string;
            'jsx-a11y/control-has-associated-label': string;
            'jsx-a11y/label-has-for': string;
            'no-console': string;
            'no-use-before-define': string;
            'no-warning-comments': string;
            'object-shorthand': (string | {
                avoidQuotes: boolean;
            })[];
            'react/display-name': string;
            'react/no-array-index-key': string;
            'react/prop-types': string;
            'react/react-in-jsx-scope': string;
        };
        ignorePatterns: string[];
        overrides: ({
            files: string[];
            plugins: string[];
            extends: string[];
            env: {
                node: boolean;
                jest: boolean;
            };
            rules?: undefined;
        } | {
            files: string[];
            rules: {
                'react-hooks/rules-of-hooks': string;
            };
            plugins?: undefined;
            extends?: undefined;
            env?: undefined;
        })[];
    } & {
        plugins: string[];
        rules: {
            'hydrogen/client-component-banned-hooks': string;
            'hydrogen/prefer-image-component': string;
            'hydrogen/server-component-banned-hooks': string;
            'hydrogen/server-no-json-parse': string;
            'hydrogen/prefer-gql': string;
        };
    };
    hydrogen: {
        plugins: string[];
        rules: {
            'hydrogen/client-component-banned-hooks': string;
            'hydrogen/prefer-image-component': string;
            'hydrogen/server-component-banned-hooks': string;
            'hydrogen/server-no-json-parse': string;
            'hydrogen/prefer-gql': string;
        };
    };
    typescript: {
        overrides: {
            files: string[];
            parser: string;
            extends: string[];
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': string;
                '@typescript-eslint/naming-convention': (string | {
                    selector: string;
                    format: string[];
                    leadingUnderscore: string;
                    trailingUnderscore: string;
                } | {
                    selector: string;
                    format: string[];
                    leadingUnderscore?: undefined;
                    trailingUnderscore?: undefined;
                } | {
                    selector: string;
                    format: string[];
                    leadingUnderscore: string;
                    trailingUnderscore?: undefined;
                })[];
                '@typescript-eslint/no-empty-function': string;
                '@typescript-eslint/no-empty-interface': string;
                '@typescript-eslint/no-explicit-any': string;
                '@typescript-eslint/no-non-null-assertion': string;
                '@typescript-eslint/no-unused-vars': string;
                'react/prop-types': string;
            };
        }[];
    };
};
