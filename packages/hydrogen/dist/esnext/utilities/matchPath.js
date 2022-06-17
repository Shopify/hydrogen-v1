import { pathToRegexp } from 'path-to-regexp';
// Modified from React Router v5
// https://github.com/remix-run/react-router/blob/v5/packages/react-router/modules/matchPath.js
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;
function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path])
        return pathCache[path];
    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
/**
 * Public API for matching a URL pathname to a path.
 */
export function matchPath(pathname, options = {}) {
    const { path, exact = false, strict = false, sensitive = false } = options;
    const paths = [].concat(path);
    return paths.reduce((matched, path) => {
        if (!path && path !== '')
            return null;
        if (matched)
            return matched;
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive,
        });
        const match = regexp.exec(pathname);
        if (!match)
            return null;
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact)
            return null;
        return {
            path,
            url: path === '/' && url === '' ? '/' : url,
            isExact,
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {}),
        };
    }, null);
}
