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

let logger = {
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
  logger = _logger;
}

export const log: RequestLogger = function (
  request: ServerComponentRequest
): Logger {
  return {
    trace: (...args) => logger.trace({request}, ...args),
    debug: (...args) => logger.debug({request}, ...args),
    warn: (...args) => logger.warn({request}, ...args),
    error: (...args) => logger.error({request}, ...args),
    fatal: (...args) => logger.fatal({request}, ...args),
  };
};
log.trace = (...args) => logger.trace({}, ...args);
log.debug = (...args) => logger.debug({}, ...args);
log.warn = (...args) => logger.warn({}, ...args);
log.error = (...args) => logger.error({}, ...args);
log.fatal = (...args) => logger.trace({}, ...args);

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

  log.debug(
    `${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${request.url}`
  );
}

function pad(str: string, _pad: string) {
  return (str + _pad).substring(0, _pad.length);
}
