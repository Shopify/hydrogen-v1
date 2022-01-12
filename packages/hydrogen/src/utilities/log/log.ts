import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {yellow, red, green, italic, lightBlue} from 'kolorist';
import {getTime} from '../timing';

/** A utility for logging debugging, warning, and error information about the application.
 * Use by importing `log` `@shopify/hydrogen` or by using a `log` prop passed to each page
 * component. Using the latter is ideal, because it will ty your log to the current request in progress.
 */

export interface Logger {
  trace: (...args: Array<any>) => void;
  debug: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
  fatal: (...args: Array<any>) => void;
}

const defaultLogger = {
  trace(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(...args);
  },
  debug(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(...args);
  },
  warn(context: {[key: string]: any}, ...args: Array<any>) {
    console.warn(yellow('WARN: '), ...args);
  },
  error(context: {[key: string]: any}, ...args: Array<any>) {
    console.error(red('ERROR: '), ...args);
  },
  fatal(context: {[key: string]: any}, ...args: Array<any>) {
    console.error(red('FATAL: '), ...args);
  },
};

let logger = defaultLogger as Logger;

export function getLoggerFromContext(context: any): Logger {
  return {
    trace: (...args) => logger.trace(context, ...args),
    debug: (...args) => logger.debug(context, ...args),
    warn: (...args) => logger.warn(context, ...args),
    error: (...args) => logger.error(context, ...args),
    fatal: (...args) => logger.fatal(context, ...args),
  };
}

export function setLogger(newLogger: Logger) {
  logger = newLogger;
}

export function resetLogger() {
  logger = defaultLogger;
}

export const log: Logger = {
  trace(...args) {
    return logger.trace({}, ...args);
  },
  debug(...args) {
    return logger.debug({}, ...args);
  },
  warn(...args) {
    return logger.warn({}, ...args);
  },
  error(...args) {
    return logger.error({}, ...args);
  },
  fatal(...args) {
    return logger.fatal({}, ...args);
  },
};

export function logServerResponse(
  type: 'str' | 'rsc' | 'ssr' | 'api',
  log: Logger,
  request: ServerComponentRequest,
  responseStatus: number
) {
  const coloredResponseStatus =
    responseStatus >= 500
      ? red(responseStatus)
      : responseStatus >= 400
      ? yellow(responseStatus)
      : responseStatus >= 300
      ? lightBlue(responseStatus)
      : green(responseStatus);

  const fullType =
    type === 'api'
      ? 'api'
      : type === 'str'
      ? 'streaming SSR'
      : type === 'rsc'
      ? 'server components'
      : 'buffered SSR';
  const styledType = italic(pad(fullType, '                 '));
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
