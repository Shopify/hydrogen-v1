declare const _default: {
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
export default _default;
