import {
  Logger,
  logCacheControlHeaders,
  collectQueryCacheControlHeaders,
  resetLogger,
} from '../index';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../../framework/Hydration/ServerComponentResponse.server';

let mockLogger: jest.Mocked<Logger>;

const QUERY_1 = 'query test1 {}';
const QUERY_2 = 'query testing2 {}';
const QUERY_3 = 'query testable3 {}';

describe('cache header log', () => {
  beforeEach(() => {
    mockLogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      options: {
        showCacheControlHeader: true,
      },
    };

    resetLogger();
  });

  it('should log cache control header for main request', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    logCacheControlHeaders('str', mockLogger, request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toMatchInlineSnapshot(
      `"┌── Cache control header for http://localhost:3000/"`
    );
    expect(mockLogger.debug.mock.calls[1][0]).toMatchInlineSnapshot(
      `"│ public, max-age=1, stale-while-revalidate=9"`
    );
    expect(mockLogger.debug.mock.calls[2][0]).toMatchInlineSnapshot(`"└──"`);
  });

  it('should log cache control header for sub request', () => {
    const request = {
      url: 'http://localhost:3000/react?state=%7B%22pathname%22%3A%22%2F%22%2C%22search%22%3A%22%22%7D',
      ctx: {
        queryCacheControl: [],
      },
    } as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    logCacheControlHeaders('rsc', mockLogger, request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toMatchInlineSnapshot(
      `"┌── Cache control header for {\\"pathname\\":\\"/\\",\\"search\\":\\"\\"}"`
    );
    expect(mockLogger.debug.mock.calls[1][0]).toMatchInlineSnapshot(
      `"│ public, max-age=1, stale-while-revalidate=9"`
    );
    expect(mockLogger.debug.mock.calls[2][0]).toMatchInlineSnapshot(`"└──"`);
  });

  it('should log cache control header for main request and sub query request', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as ServerComponentRequest;
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as ServerComponentResponse;

    collectQueryCacheControlHeaders(
      request,
      QUERY_1,
      'public, max-age=1, stale-while-revalidate=9'
    );
    logCacheControlHeaders('str', mockLogger, request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toMatchInlineSnapshot(
      `"┌── Cache control header for http://localhost:3000/"`
    );
    expect(mockLogger.debug.mock.calls[1][0]).toMatchInlineSnapshot(
      `"│ public, max-age=1, stale-while-revalidate=9"`
    );
    expect(mockLogger.debug.mock.calls[2][0]).toMatchInlineSnapshot(`"│"`);
    expect(mockLogger.debug.mock.calls[3][0]).toMatchInlineSnapshot(
      `"│ query test1 public, max-age=1, stale-while-revalidate=9"`
    );
    expect(mockLogger.debug.mock.calls[4][0]).toMatchInlineSnapshot(`"└──"`);
  });

  it('should log cache control header for main request and several sub query requests', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as ServerComponentRequest;
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
    logCacheControlHeaders('str', mockLogger, request, response);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toMatchInlineSnapshot(
      `"┌── Cache control header for http://localhost:3000/"`
    );
    expect(mockLogger.debug.mock.calls[1][0]).toMatchInlineSnapshot(
      `"│ public, max-age=1, stale-while-revalidate=9"`
    );
    expect(mockLogger.debug.mock.calls[2][0]).toMatchInlineSnapshot(`"│"`);
    expect(mockLogger.debug.mock.calls[3][0]).toMatchInlineSnapshot(
      `"│ query test1     public, max-age=1, stale-while-revalidate=9"`
    );
    expect(mockLogger.debug.mock.calls[4][0]).toMatchInlineSnapshot(
      `"│ query testing2  public, max-age=2, stale-while-revalidate=10"`
    );
    expect(mockLogger.debug.mock.calls[5][0]).toMatchInlineSnapshot(
      `"│ query testable3 public, max-age=3, stale-while-revalidate=11"`
    );
    expect(mockLogger.debug.mock.calls[6][0]).toMatchInlineSnapshot(`"└──"`);
  });
});
