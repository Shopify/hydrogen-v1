import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {yellow, red, green, italic, lightBlue} from 'kolorist';
import {getTime} from '../timing';
import {parseUrl} from './utils';

/** The `log` utility is a function that's used for logging debugging, warning, and error information about the application.
 * Use this utility by importing `log` from `@shopify/hydrogen`, or by using a `log` prop passed to each page
 * component. We recommend using the `log` prop passed to each page because it will associated your log to the
 * current request in progress.
 */

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

export type LoggerConfig = Partial<Exclude<Logger, 'options'>> & LoggerOptions;

export type RenderType = 'str' | 'rsc' | 'ssr' | 'api';

type LoggerContext = Record<string, any>;
const defaultLogger = {
  trace(context: LoggerContext, ...args: Array<any>) {
    // Re-enable following line to show trace debugging information
    // console.log(context.id, ...args);
  },
  debug(context: LoggerContext, ...args: Array<any>) {
    console.log(...args);
  },
  warn(context: LoggerContext, ...args: Array<any>) {
    console.warn(yellow('WARN: '), ...args);
  },
  error(context: LoggerContext, ...args: Array<any>) {
    console.error(red('ERROR: '), ...args);
  },
  fatal(context: LoggerContext, ...args: Array<any>) {
    console.error(red('FATAL: '), ...args);
  },
  options: () => ({} as LoggerOptions),
};

let currentLogger = defaultLogger as Logger;

export function getLoggerWithContext(context: any): Logger {
  return {
    trace: (...args) => currentLogger.trace(context, ...args),
    debug: (...args) => currentLogger.debug(context, ...args),
    warn: (...args) => currentLogger.warn(context, ...args),
    error: (...args) => currentLogger.error(context, ...args),
    fatal: (...args) => currentLogger.fatal(context, ...args),
    options: () => currentLogger.options(),
  };
}

export const log: Logger = getLoggerWithContext({});

export function setLogger(config?: LoggerConfig) {
  if (!config) {
    currentLogger = defaultLogger;
    return;
  }

  const options = {} as LoggerOptions;
  currentLogger = {...defaultLogger, ...config, options: () => options};

  for (const key of Object.keys(config) as (keyof LoggerOptions)[]) {
    if (!(key in defaultLogger)) {
      delete currentLogger[key as keyof Logger];
      options[key] = config[key];
    }
  }
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
