import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {Logger, setLogger, resetLogger, setLoggerOptions} from '../index';
import {collectQueryTimings, logQueryTimings} from '../log-query-timeline';

let mockLogger: jest.Mocked<Logger>;

const QUERY_1 = 'query test1 {}';
const QUERY_2 = 'query testing2 {}';

function expectTiming(mockCall, method, queryName, duration?) {
  let regex;
  if (duration) {
    regex = new RegExp(
      `│ -?[0-9]+\.[0-9]{2}ms.*${method}.*${queryName} \\\(Took ${duration}\.00ms\\\)`
    );
  } else {
    regex = new RegExp(`│ -?[0-9]+\.[0-9]{2}ms.*${method}.*${queryName}`);
  }

  expect(mockCall).toEqual(expect.stringMatching(regex));
}

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

    resetLogger();
    setLogger(mockLogger);
    setLoggerOptions({
      showQueryTiming: true,
    });
  });

  it('should log query timing', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: Date.now(),
    } as ServerComponentRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);
    collectQueryTimings(request, QUERY_1, 'rendered');

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Query timings for http://localhost:3000/[39m"`
    );
    expectTiming(mockLogger.debug.mock.calls[1][1], 'Requested', 'test1');
    expectTiming(mockLogger.debug.mock.calls[2][1], 'Resolved', 'test1', 100);
    expectTiming(mockLogger.debug.mock.calls[3][1], 'Rendered', 'test1');
    expect(mockLogger.debug.mock.calls[4][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });

  it('should detect suspense waterfall', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: Date.now(),
    } as ServerComponentRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'rendered');
    collectQueryTimings(request, QUERY_2, 'requested');
    collectQueryTimings(request, QUERY_2, 'resolved', 100);
    collectQueryTimings(request, QUERY_2, 'requested');
    collectQueryTimings(request, QUERY_2, 'rendered');

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Query timings for http://localhost:3000/[39m"`
    );
    expectTiming(mockLogger.debug.mock.calls[1][1], 'Requested', 'test1');
    expectTiming(mockLogger.debug.mock.calls[2][1], 'Resolved', 'test1', 100);
    expectTiming(mockLogger.debug.mock.calls[3][1], 'Requested', 'test1');
    expectTiming(mockLogger.debug.mock.calls[4][1], 'Rendered', 'test1');
    expect(mockLogger.debug.mock.calls[5][1]).toMatchInlineSnapshot(
      `"[90m│ [39m[33mSuspense waterfall detected[39m"`
    );
    expectTiming(mockLogger.debug.mock.calls[6][1], 'Requested', 'testing2');
    expectTiming(
      mockLogger.debug.mock.calls[7][1],
      'Resolved',
      'testing2',
      100
    );
    expectTiming(mockLogger.debug.mock.calls[8][1], 'Requested', 'testing2');
    expectTiming(mockLogger.debug.mock.calls[9][1], 'Rendered', 'testing2');
    expect(mockLogger.debug.mock.calls[10][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });

  it('should detect unused query', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: Date.now(),
    } as ServerComponentRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Query timings for http://localhost:3000/[39m"`
    );
    expectTiming(mockLogger.debug.mock.calls[1][1], 'Requested', 'test1');
    expectTiming(mockLogger.debug.mock.calls[2][1], 'Resolved', 'test1', 100);
    expect(mockLogger.debug.mock.calls[3][1]).toMatchInlineSnapshot(
      `"[90m│ [39m[33mUnused query detected: test1[39m"`
    );
    expect(mockLogger.debug.mock.calls[4][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });

  it('should detect multiple data load', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: Date.now(),
    } as ServerComponentRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);
    collectQueryTimings(request, QUERY_1, 'resolved', 120);
    collectQueryTimings(request, QUERY_1, 'rendered');

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(
      `"[90m┌── Query timings for http://localhost:3000/[39m"`
    );
    expectTiming(mockLogger.debug.mock.calls[1][1], 'Requested', 'test1');
    expectTiming(mockLogger.debug.mock.calls[2][1], 'Resolved', 'test1', 100);
    expectTiming(mockLogger.debug.mock.calls[3][1], 'Resolved', 'test1', 120);
    expectTiming(mockLogger.debug.mock.calls[4][1], 'Rendered', 'test1');
    expect(mockLogger.debug.mock.calls[5][1]).toMatchInlineSnapshot(
      `"[90m│ [39m[33mMultiple data loads detected: test1[39m"`
    );
    expect(mockLogger.debug.mock.calls[6][1]).toMatchInlineSnapshot(`"[90m└──[39m"`);
  });
});
