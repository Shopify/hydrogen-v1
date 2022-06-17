import { useMemo } from 'react';
export function addParametersToEmbeddedVideoUrl(url, parameters) {
    if (parameters == null) {
        return url;
    }
    const params = Object.keys(parameters).reduce((accumulator, param) => {
        const value = parameters[param];
        if (value == null) {
            return accumulator;
        }
        return accumulator + `&${param}=${value}`;
    }, '');
    return `${url}?${params}`;
}
export function useEmbeddedVideoUrl(url, parameters) {
    return useMemo(() => {
        if (!parameters) {
            return url;
        }
        return addParametersToEmbeddedVideoUrl(url, parameters);
    }, [url, parameters]);
}
