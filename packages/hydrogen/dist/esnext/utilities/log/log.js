import { yellow, red, green, italic, lightBlue } from 'kolorist';
import { getTime } from '../timing';
import { parseUrl } from './utils';
const defaultLogger = {
    trace(context, ...args) {
        // Re-enable following line to show trace debugging information
        // console.log(context.id, ...args);
    },
    debug(context, ...args) {
        console.log(...args);
    },
    warn(context, ...args) {
        console.warn(yellow('WARN: '), ...args);
    },
    error(context, ...args) {
        console.error(red('ERROR: '), ...args);
    },
    fatal(context, ...args) {
        console.error(red('FATAL: '), ...args);
    },
    options: () => ({}),
};
let currentLogger = defaultLogger;
function doLog(method, request, ...args) {
    const maybePromise = currentLogger[method](request, ...args);
    if (maybePromise instanceof Promise) {
        request?.ctx?.runtime?.waitUntil?.(maybePromise);
    }
}
export function getLoggerWithContext(context) {
    return {
        trace: (...args) => doLog('trace', context, ...args),
        debug: (...args) => doLog('debug', context, ...args),
        warn: (...args) => doLog('warn', context, ...args),
        error: (...args) => doLog('error', context, ...args),
        fatal: (...args) => doLog('fatal', context, ...args),
        options: () => currentLogger.options(),
    };
}
export const log = getLoggerWithContext({});
export function setLogger(config) {
    if (!config) {
        currentLogger = defaultLogger;
        return;
    }
    const options = {};
    currentLogger = { ...defaultLogger, ...config, options: () => options };
    for (const key of Object.keys(config)) {
        if (!(key in defaultLogger)) {
            delete currentLogger[key];
            options[key] = config[key];
        }
    }
}
const SERVER_RESPONSE_MAP = {
    str: 'streaming SSR',
    rsc: 'Server Components',
    ssr: 'buffered SSR',
};
export function logServerResponse(type, request, responseStatus) {
    const log = getLoggerWithContext(request);
    const coloredResponseStatus = responseStatus >= 500
        ? red(responseStatus)
        : responseStatus >= 400
            ? yellow(responseStatus)
            : responseStatus >= 300
                ? lightBlue(responseStatus)
                : green(responseStatus);
    const fullType = SERVER_RESPONSE_MAP[type] || type;
    const styledType = italic(fullType.padEnd(17));
    const paddedTiming = ((getTime() - request.time).toFixed(2) + ' ms').padEnd(10);
    const url = parseUrl(type, request.url);
    log.debug(`${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`);
}
