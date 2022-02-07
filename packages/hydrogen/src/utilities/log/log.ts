import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {yellow, red, green, italic, lightBlue} from 'kolorist';
import {getTime} from '../timing';
import {parseUrl} from './utils';

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

export type RenderType = 'str' | 'rsc' | 'ssr' | 'api';

const defaultLogger = {
  trace(context: {[key: string]: any}, ...args: Array<any>) {
    // Re-enable following line to show trace debugging information
    // console.log(context.id, ...args);
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
    options: logger.options,
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

const SERVER_RESPONSE_MAP: Record<string, string> = {
  str: 'streaming SSR',
  rsc: 'Server Components',
  ssr: 'buffered SSR',
};

export function logServerResponse(
  type: RenderType,
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

  const fullType: string = SERVER_RESPONSE_MAP[type] || type;

  const styledType = italic(fullType.padEnd(17));
  const paddedTiming = ((getTime() - request.time).toFixed(2) + ' ms').padEnd(
    10
  );
  const url = parseUrl(type, request.url);

  log.debug(
    `${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`
  );
}

export function logCacheApiStatus(...args: Array<any>) {
  if (!logger.options?.showCacheApiStatus) {
    return;
  }
  log.debug({}, ...args);
}
