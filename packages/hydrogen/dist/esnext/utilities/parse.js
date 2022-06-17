export function parseJSON(json) {
    if (String(json).includes('__proto__'))
        return JSON.parse(json, noproto);
    return JSON.parse(json);
}
function noproto(k, v) {
    if (k !== '__proto__')
        return v;
}
