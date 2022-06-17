declare const recommended: {
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
export default recommended;
