import Crypto from 'crypto';
export default () => {
    const buildCacheId = Crypto.randomBytes(8).toString('hex').slice(0, 8);
    return {
        name: 'vite-plugin-purge-query-cache',
        enforce: 'pre',
        transform(code) {
            return code.replace('__QUERY_CACHE_ID__', buildCacheId);
        },
    };
};
