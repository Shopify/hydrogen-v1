import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {yellow, red, green, italic, lightBlue} from 'kolorist';
import {getTime} from '../timing';
import {parseUrl} from './utils';

/** The `log` utility is a function that's used for logging debugging, warning, and error information about the application.
 * Use this utility by importing `log` from `@shopify/hydrogen`, or by using a `log` prop passed to each page
 * component. We recommend using the `log` prop passed to each page because it will associated your log to the
 * current request in progress.
 */

declare namespace globalThis {
  let __logger: Logger;
}

export interface Logger {
  trace: (...args: Array<any>) => void;
  debug: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
  fatal: (...args: Array<any>) => void;
  options: () => LoggerOptions;
}

export type LoggerOptions = {
  showCacheControlHeader?: boolean;
  showCacheApiStatus?: boolean;
  showQueryTiming?: boolean;
  showUnusedQueryProperties?: boolean;
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
  options: () => ({}),
};

globalThis.__logger = defaultLogger as Logger;

function buildLogger(this: any): Logger {
  return {
    trace: (...args) => globalThis.__logger.trace(this, ...args),
    debug: (...args) => globalThis.__logger.debug(this, ...args),
    warn: (...args) => globalThis.__logger.warn(this, ...args),
    error: (...args) => globalThis.__logger.error(this, ...args),
    fatal: (...args) => globalThis.__logger.fatal(this, ...args),
    options: () => globalThis.__logger.options(),
  };
}

export const log: Logger = buildLogger.call({});

export function getLoggerWithContext(context: any = {}): Logger {
  return buildLogger.call(context);
}

export function setLogger(newLogger: Logger) {
  globalThis.__logger = newLogger;
}

export function setLoggerOptions(options: LoggerOptions) {
  globalThis.__logger.options = () => options;
}

export function resetLogger() {
  globalThis.__logger = defaultLogger;
}

const SERVER_RESPONSE_MAP: Record<string, string> = {
  str: 'streaming SSR',
  rsc: 'Server Components',
  ssr: 'buffered SSR',
};

export function logServerResponse(
  type: RenderType,
  request: ServerComponentRequest,
  responseStatus: number
) {
  const log = getLoggerWithContext(request);
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
