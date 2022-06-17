import {Logger, setLogger} from '../log';
import {logCacheApiStatus} from '../log-cache-api-status';

let mockLogger: jest.Mocked<Logger>;

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

    setLogger({...mockLogger, showCacheApiStatus: true});
  });

  afterEach(() => {
    setLogger(undefined);
  });

  it('should log cache api status', () => {
    logCacheApiStatus(
      'HIT',
      'https://shopify.dev/?%22__QUERY_CACHE_ID__%22%22hydrogen-preview.myshopify.com%22%22unstable%22%22%7B%5C%22query%5C%22:%5C%22query%20shopInfo%20%7B%5C%5Cn%20%20shop'
    );

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][0]).toEqual({});
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m[Cache] HIT      query shopInfo[39m"`
    );
  });
});
