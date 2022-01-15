import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import {yellow, red, green, italic, lightBlue} from 'kolorist';
import {getTime} from '../timing';
import {QueryKey} from '../../types';
import {hashKey} from '../../framework/cache';

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
  options?: LoggerOptions;
}

export type LoggerOptions = {
  showCacheControlHeader?: boolean;
  showCacheApiStatus?: boolean;
};

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
  options: {},
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

export function setLoggerOptions(options: LoggerOptions) {
  logger.options = options;
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
  type: 'str' | 'rsc' | 'ssr',
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
    type === 'str'
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

function parseUrl(url: string) {
  return /\?state=/.test(url) ? decodeURIComponent(url) : url;
}

type QueryCacheControlHeaders = {
  [key: string]: {
    name: string;
    header: string | null;
  };
};

let queryCacheControlHeaders: QueryCacheControlHeaders = {};
let longestQueryNameLength = 0;
export function collectQueryCacheControlHeaders(
  queryKey: QueryKey,
  cacheControlHeader: string | null
) {
  if (!logger.options?.showCacheControlHeader) {
    return;
  }

  const cacheKey = hashKey(queryKey);
  const queryName = findQueryname(cacheKey);

  longestQueryNameLength =
    longestQueryNameLength < queryName.length
      ? queryName.length
      : longestQueryNameLength;
  queryCacheControlHeaders[cacheKey] = {
    name: queryName,
    header: cacheControlHeader,
  };
}

export function logCacheControlHeaders(
  request: ServerComponentRequest,
  response: ServerComponentResponse
) {
  if (!logger.options?.showCacheControlHeader) {
    return;
  }

  log.debug(`┌── Cache control header for ${parseUrl(request.url)}`);
  log.debug(`│ ${response.cacheControlHeader}`);

  const queryList = Object.keys(queryCacheControlHeaders);
  if (queryList.length > 0) {
    log.debug('│');
    queryList.forEach((cacheKey) => {
      const query = queryCacheControlHeaders[cacheKey];
      log.debug(
        `│ query ${query.name.padEnd(longestQueryNameLength + 1)}${
          query.header
        }`
      );
    });
  }

  log.debug('└──');
  queryCacheControlHeaders = {};
}

function findQueryname(key: string) {
  const match = key.match(/query ([^\s\()]*)\s?(|\(\{)/);
  if (match && match.length > 1) {
    return match[1];
  }
  return '<unknown>';
}

export function logCacheApiStatus(...args: Array<any>) {
  if (!logger.options?.showCacheApiStatus) {
    return;
  }
  log.debug({}, ...args);
}
