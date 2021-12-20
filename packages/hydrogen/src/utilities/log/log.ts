import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import kleur from 'kleur';
import {getTime} from '../timing';

export interface RequestLogger extends Logger {
  (request: ServerComponentRequest): Logger;
}

export interface Logger {
  trace: (...args: Array<any>) => void;
  debug: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
  fatal: (...args: Array<any>) => void;
}

// @todo - multiple instances of log.ts are loaded, we utilitze the
// global in order to make sure that the logger is a singleton
(globalThis as any).__hlogger = {
  trace(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(...args);
  },
  debug(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(...args);
  },
  warn(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(kleur.yellow('WARN: '), ...args);
  },
  error(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(kleur.red('ERROR: '), ...args);
  },
  fatal(context: {[key: string]: any}, ...args: Array<any>) {
    console.log(kleur.red('FATAL: '), ...args);
  },
};

export function setLogger(_logger: Logger) {
  (globalThis as any).__hlogger = _logger;
}

export const log: RequestLogger = function (
  request: ServerComponentRequest
): Logger {
  return {
    trace: (...args) => (globalThis as any).__hlogger.trace({request}, ...args),
    debug: (...args) => (globalThis as any).__hlogger.debug({request}, ...args),
    warn: (...args) => (globalThis as any).__hlogger.warn({request}, ...args),
    error: (...args) => (globalThis as any).__hlogger.error({request}, ...args),
    fatal: (...args) => (globalThis as any).__hlogger.fatal({request}, ...args),
  };
};
log.trace = (...args) => (globalThis as any).__hlogger.trace({}, ...args);
log.debug = (...args) => (globalThis as any).__hlogger.debug({}, ...args);
log.warn = (...args) => (globalThis as any).__hlogger.warn({}, ...args);
log.error = (...args) => (globalThis as any).__hlogger.error({}, ...args);
log.fatal = (...args) => (globalThis as any).__hlogger.trace({}, ...args);

export function logServerResponse(
  type: 'str' | 'rsc' | 'ssr',
  log: Logger,
  request: ServerComponentRequest,
  responseStatus: number
) {
  const coloredResponseStatus =
    responseStatus >= 500
      ? kleur.red(responseStatus)
      : responseStatus >= 300
      ? kleur.yellow(responseStatus)
      : kleur.green(responseStatus);

  const styledType = kleur.italic(type);
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
