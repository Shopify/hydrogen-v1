const PUBLIC = 'public';
const PRIVATE = 'private';
export const NO_STORE = 'no-store';
const optionMapping = {
    maxAge: 'max-age',
    staleWhileRevalidate: 'stale-while-revalidate',
    sMaxAge: 's-maxage',
    staleIfError: 'stale-if-error',
};
export function generateCacheControlHeader(cacheOptions) {
    const cacheControl = [];
    Object.keys(cacheOptions).forEach((key) => {
        if (key === 'mode') {
            cacheControl.push(cacheOptions[key]);
        }
        else if (optionMapping[key]) {
            cacheControl.push(`${optionMapping[key]}=${cacheOptions[key]}`);
        }
    });
    return cacheControl.join(', ');
}
export function CacheNone() {
    return {
        mode: NO_STORE,
    };
}
function guardExpirableModeType(overrideOptions) {
    if (overrideOptions?.mode &&
        overrideOptions?.mode !== PUBLIC &&
        overrideOptions?.mode !== PRIVATE) {
        throw Error("'mode' must be either 'public' or 'private'");
    }
}
export function CacheShort(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1,
        staleWhileRevalidate: 9,
        ...overrideOptions,
    };
}
export function CacheLong(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 3600,
        staleWhileRevalidate: 82800,
        ...overrideOptions,
    };
}
export function CacheCustom(overrideOptions) {
    return overrideOptions;
}
