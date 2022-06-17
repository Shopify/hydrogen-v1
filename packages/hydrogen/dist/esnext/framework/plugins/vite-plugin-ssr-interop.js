export default () => {
    return {
        name: 'vite-plugin-ssr-interop',
        enforce: 'pre',
        transform(code, id, options = {}) {
            if (options.ssr && id.includes('foundation/ssr-interop')) {
                return {
                    code: code
                        .replace(/(\s*META_ENV_SSR\s*=\s*)false/, '$1import.meta.env.SSR')
                        .replace(/\/\/@SSR\s*/g, ''),
                    map: { mappings: '' },
                };
            }
        },
    };
};
