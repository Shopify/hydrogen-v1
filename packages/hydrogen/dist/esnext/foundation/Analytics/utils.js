import { eventNames } from './const';
const RESERVED_EVENT_NAMES = Object.values(eventNames);
export function getNamedspacedEventname(eventname) {
    // Any event name that is not in the reserved space will be prefix with `c-`
    return RESERVED_EVENT_NAMES.indexOf(eventname) === -1
        ? `c-${eventname}`
        : eventname;
}
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
export function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
