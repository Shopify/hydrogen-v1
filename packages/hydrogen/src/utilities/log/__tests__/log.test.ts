import {
  log,
  setLogger,
  Logger,
  logServerResponse,
  getLoggerWithContext,
  resetLogger,
} from '../log';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {setLoggerOptions} from '..';

let mockLogger: jest.Mocked<Logger>;

describe('log', () => {
  beforeEach(() => {
    mockLogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      options: jest.fn(() => ({})),
    };

    global.Date.now = () => 2100;
    global.performance.now = () => 2100;

    resetLogger();
    setLogger(mockLogger);
  });

  it('should return the wrapped mockLogger instance when log is called', () => {
    log.debug('test');
    expect(mockLogger.debug).toHaveBeenCalled();
    expect(log.options()).toEqual({});
    expect(mockLogger.debug.mock.calls[0][0]).toEqual({});
    expect(mockLogger.debug.mock.calls[0][1]).toEqual('test');
  });

  it('should return the mockLogger2 instance when setLogger is called', () => {
    const mockLogger2: jest.Mocked<Logger> = {
      trace: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      options: jest.fn(() => ({
        showCacheControlHeader: true,
      })),
    };
    setLogger(mockLogger2);

    log.debug('test');
    expect(mockLogger2.debug).toHaveBeenCalled();
    expect(log.options()).toEqual({
      showCacheControlHeader: true,
    });
    expect(mockLogger2.debug.mock.calls[0][0]).toEqual({});
    expect(mockLogger2.debug.mock.calls[0][1]).toEqual('test');
  });

  it('should set showCacheControlHeader option when setLoggerOptions is called', () => {
    setLoggerOptions({
      showCacheControlHeader: true,
    });
    expect(log.options()).toEqual({
      showCacheControlHeader: true,
    });
  });

  it('should set showCacheApiStatus option when setLoggerOptions is called', () => {
    setLoggerOptions({
      showCacheApiStatus: true,
    });
    expect(log.options()).toEqual({
      showCacheApiStatus: true,
    });
  });

  it('should return the correct options when setLoggerOptions is set multiple times', () => {
    setLoggerOptions({
      showCacheControlHeader: true,
    });
    expect(log.options()).toEqual({
      showCacheControlHeader: true,
    });
    setLoggerOptions({
      showCacheApiStatus: true,
      showCacheControlHeader: true,
    });
    expect(log.options()).toEqual({
      showCacheApiStatus: true,
      showCacheControlHeader: true,
    });
  });

  it('should log 500 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', request, 500);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"GET [3mstreaming SSR    [23m [31m500[39m 1100.00 ms http://localhost:3000/"`
    );
  });

  it('should log 200 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', request, 200);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"GET [3mstreaming SSR    [23m [32m200[39m 1100.00 ms http://localhost:3000/"`
    );
  });

  it('should log 300 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', request, 301);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"GET [3mstreaming SSR    [23m [94m301[39m 1100.00 ms http://localhost:3000/"`
    );
  });

  it('should log 400 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', request, 404);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"GET [3mstreaming SSR    [23m [33m404[39m 1100.00 ms http://localhost:3000/"`
    );
  });

  ['trace', 'debug', 'warn', 'error', 'fatal'].forEach((method) => {
    it(`logs ${method}`, () => {
      (log as any)[method](`hydrogen: ${method}`);
      expect((mockLogger as any)[method]).toHaveBeenCalled();
      expect(((mockLogger as any)[method] as any).mock.calls[0][0]).toEqual({});
      expect(((mockLogger as any)[method] as any).mock.calls[0][1]).toBe(
        `hydrogen: ${method}`
      );
    });

    it('gets logger for a given context', () => {
      const clog = getLoggerWithContext({some: 'data'});

      (clog as any)[method](`hydrogen: ${method}`);
      expect((mockLogger as any)[method]).toHaveBeenCalled();
      expect(((mockLogger as any)[method] as any).mock.calls[0][0]).toEqual({
        some: 'data',
      });
      expect(((mockLogger as any)[method] as any).mock.calls[0][1]).toBe(
        `hydrogen: ${method}`
      );
    });
  });
});
