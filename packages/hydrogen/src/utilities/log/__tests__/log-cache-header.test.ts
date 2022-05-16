import {
  Logger,
  setLogger,
  logCacheControlHeaders,
  collectQueryCacheControlHeaders,
  resetLogger,
  setLoggerOptions,
} from '../index';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../../framework/Hydration/ServerComponentResponse.server';

let mockLogger: jest.Mocked<Logger>;

const QUERY_1 = 'test1';
const QUERY_2 = 'testing2';
const QUERY_3 = 'testable3';

describe('cache header log', () => {
  beforeEach(() => {
    mockLogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      options: jest.fn(() => ({})),
    };

    setLogger(mockLogger);
    setLoggerOptions({
      showCacheControlHeader: true,
    });
  });

  afterEach(() => {
    resetLogger();
  });

  it('should log cache control header for main request', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    logCacheControlHeaders('str', request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Cache control header for http://localhost:3000/[39m"`
    );
    expect(mockLogger.debug.mock.calls[1][1]).toMatchInlineSnapshot(
      `"[90m│ public, max-age=1, stale-while-revalidate=9[39m"`
    );
    expect(mockLogger.debug.mock.calls[2][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });

  it('should log cache control header for sub request', () => {
    const request = {
      url: 'http://localhost:3000/react?state=%7B%22pathname%22%3A%22%2F%22%2C%22search%22%3A%22%22%7D',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    logCacheControlHeaders('rsc', request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Cache control header for {\\"pathname\\":\\"/\\",\\"search\\":\\"\\"}[39m"`
    );
    expect(mockLogger.debug.mock.calls[1][1]).toMatchInlineSnapshot(
      `"[90m│ public, max-age=1, stale-while-revalidate=9[39m"`
    );
    expect(mockLogger.debug.mock.calls[2][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });

  it('should log cache control header for main request and sub query request', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    collectQueryCacheControlHeaders(
      request,
      QUERY_1,
      'public, max-age=1, stale-while-revalidate=9'
    );
    logCacheControlHeaders('str', request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Cache control header for http://localhost:3000/[39m"`
    );
    expect(mockLogger.debug.mock.calls[1][1]).toMatchInlineSnapshot(
      `"[90m│ public, max-age=1, stale-while-revalidate=9[39m"`
    );
    expect(mockLogger.debug.mock.calls[2][1]).toMatchInlineSnapshot(`"[90m│[39m"`);
    expect(mockLogger.debug.mock.calls[3][1]).toMatchInlineSnapshot(
      `"[90m│ query test1 public, max-age=1, stale-while-revalidate=9[39m"`
    );
    expect(mockLogger.debug.mock.calls[4][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });

  it('should log cache control header for main request and several sub query requests', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    collectQueryCacheControlHeaders(
      request,
      QUERY_1,
      'public, max-age=1, stale-while-revalidate=9'
    );
    collectQueryCacheControlHeaders(
      request,
      QUERY_2,
      'public, max-age=2, stale-while-revalidate=10'
    );
    collectQueryCacheControlHeaders(
      request,
      QUERY_3,
      'public, max-age=3, stale-while-revalidate=11'
    );
    logCacheControlHeaders('str', request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Cache control header for http://localhost:3000/[39m"`
    );
    expect(mockLogger.debug.mock.calls[1][1]).toMatchInlineSnapshot(
      `"[90m│ public, max-age=1, stale-while-revalidate=9[39m"`
    );
    expect(mockLogger.debug.mock.calls[2][1]).toMatchInlineSnapshot(`"[90m│[39m"`);
    expect(mockLogger.debug.mock.calls[3][1]).toMatchInlineSnapshot(
      `"[90m│ query test1     public, max-age=1, stale-while-revalidate=9[39m"`
    );
    expect(mockLogger.debug.mock.calls[4][1]).toMatchInlineSnapshot(
      `"[90m│ query testing2  public, max-age=2, stale-while-revalidate=10[39m"`
    );
    expect(mockLogger.debug.mock.calls[5][1]).toMatchInlineSnapshot(
      `"[90m│ query testable3 public, max-age=3, stale-while-revalidate=11[39m"`
    );
    expect(mockLogger.debug.mock.calls[6][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });
});
