import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {yellow, red, green, italic} from 'kolorist';
import {getTime} from '../timing';

export interface Logger {
  trace: (...args: Array<any>) => void;
  debug: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
  fatal: (...args: Array<any>) => void;
}

export function getLoggerFromContext(context: any): Logger {
  return {
    trace: (...args) => (globalThis as any).__hlogger.trace(context, ...args),
    debug: (...args) => (globalThis as any).__hlogger.debug(context, ...args),
    warn: (...args) => (globalThis as any).__hlogger.warn(context, ...args),
    error: (...args) => (globalThis as any).__hlogger.error(context, ...args),
    fatal: (...args) => (globalThis as any).__hlogger.fatal(context, ...args),
  };
}

// @todo - multiple instances of log.ts are loaded, we utilitze the
// global in order to make sure that the logger is a singleton
let defaultLogger = ((globalThis as any).__hlogger = {
  trace(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(...args);
  },
  debug(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(...args);
  },
  warn(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(yellow('WARN: '), ...args);
  },
  error(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(red('ERROR: '), ...args);
  },
  fatal(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(red('FATAL: '), ...args);
  },
});

export function setLogger(_logger: Logger) {
  (globalThis as any).__hlogger = _logger;
}

export function resetLogger() {
  (globalThis as any).__hlogger = defaultLogger;
}

/**
 * A utility for logging debugging, warning, and error information about the application.
 * Use by importing `log` `@shopify/hydrogen` or by using a `log` prop passed to each page
 * component. Using the latter is ideal, because it will ty your log to the current request in progress.
 */
export const log: Logger = {
  trace(...args) {
    return (globalThis as any).__hlogger.trace({}, ...args);
  },
  debug(...args) {
    return (globalThis as any).__hlogger.debug({}, ...args);
  },
  warn(...args) {
    return (globalThis as any).__hlogger.warn({}, ...args);
  },
  error(...args) {
    return (globalThis as any).__hlogger.error({}, ...args);
  },
  fatal(...args) {
    return (globalThis as any).__hlogger.fatal({}, ...args);
  },
};

export function logServerResponse(
  type: 'str' | 'rsc' | 'ssr',
  log: Logger,
  request: ServerComponentRequest,
  responseStatus: number
) {
  const coloredResponseStatus =
    responseStatus >= 500
      ? red(responseStatus)
      : responseStatus >= 300
      ? yellow(responseStatus)
      : green(responseStatus);

  const styledType = italic(type);
  const paddedTiming = pad(
    (getTime() - request.time).toFixed(2) + ' ms',
    '          '
  );
  const url =
    type === 'rsc'
      ? decodeURIComponent(request.url.substring(request.url.indexOf('=') + 1))
      : request.url;

  log.debug(
    `${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`
  );
}

function pad(str: string, _pad: string) {
  return (str + _pad).substring(0, _pad.length);
}
