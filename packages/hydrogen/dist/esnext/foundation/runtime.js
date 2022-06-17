export function setCache(cache) {
    globalThis.__cache = cache;
}
export function getCache() {
    return globalThis.__cache;
}
