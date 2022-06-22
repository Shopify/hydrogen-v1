import {HydrogenRequest} from '../../../foundation/HydrogenRequest/HydrogenRequest.server';
import {Logger, setLogger} from '../log';
import {collectQueryTimings, logQueryTimings} from '../log-query-timeline';

let mockLogger: jest.Mocked<Logger>;

const QUERY_1 = 'test1';
const QUERY_2 = 'testing2';

let dateNowSpy: jest.SpyInstance;
const time = 1640995200000;

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

    dateNowSpy = jest.spyOn(performance, 'now').mockImplementation(() => time);

    setLogger({...mockLogger, showQueryTiming: true});
  });

  afterEach(() => {
    setLogger(undefined);
    dateNowSpy.mockRestore();
  });

  it('should log query timing', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: 1640995200200,
      previouslyLoadedRequest: () => false,
    } as unknown as HydrogenRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);
    collectQueryTimings(request, QUERY_1, 'rendered');

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(`
      "[90m┌── Query timings for http://localhost:3000/[39m[90m
      │ -200.00ms  [90mRequested [90m test1[39m[90m
      │ -200.00ms  [90mResolved  [90m test1 (Took 100.00ms)[39m[90m
      │ -200.00ms  [90mRendered  [90m test1[39m
      [90m└──[39m"
    `);
  });

  it('should detect suspense waterfall', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: 1640995200200,
      previouslyLoadedRequest: () => true,
    } as unknown as HydrogenRequest;
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
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(`
      "[90m┌── Query timings for http://localhost:3000/[39m[90m
      │ -200.00ms  [90mRequested [90m test1[39m[90m
      │ -200.00ms  [90mResolved  [90m test1 (Took 100.00ms)[39m[90m
      │ -200.00ms  [90mRequested [90m test1[39m[90m
      │ -200.00ms  [90mRendered  [90m test1[39m
      [90m│ [39m[33mSuspense waterfall detected[39m[90m
      │ -200.00ms  [90mRequested [90m testing2[39m[90m
      │ -200.00ms  [90mResolved  [90m testing2 (Took 100.00ms)[39m[90m
      │ -200.00ms  [90mRequested [90m testing2[39m[90m
      │ -200.00ms  [90mRendered  [90m testing2[39m
      [90m└──[39m"
    `);
  });

  it('should detect unused query', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      previouslyLoadedRequest: () => false,
      time: 1640995200200,
    } as unknown as HydrogenRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(`
      "[90m┌── Query timings for http://localhost:3000/[39m[90m
      │ -200.00ms  [90mRequested [90m test1[39m[90m
      │ -200.00ms  [90mResolved  [90m test1 (Took 100.00ms)[39m
      [90m│ [39m[33mUnused query detected: test1[39m
      [90m└──[39m"
    `);
  });

  it('should detect multiple data load', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      previouslyLoadedRequest: () => false,
      time: 1640995200200,
    } as unknown as HydrogenRequest;
    collectQueryTimings(request, QUERY_1, 'requested');
    collectQueryTimings(request, QUERY_1, 'resolved', 100);
    collectQueryTimings(request, QUERY_1, 'resolved', 120);
    collectQueryTimings(request, QUERY_1, 'rendered');

    logQueryTimings('ssr', request);

    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.debug.mock.calls[0][1]).toMatchInlineSnapshot(`
      "[90m┌── Query timings for http://localhost:3000/[39m[90m
      │ -200.00ms  [90mRequested [90m test1[39m[90m
      │ -200.00ms  [90mResolved  [90m test1 (Took 100.00ms)[39m[90m
      │ -200.00ms  [90mResolved  [90m test1 (Took 120.00ms)[39m[90m
      │ -200.00ms  [90mRendered  [90m test1[39m
      [90m│ [39m[33mMultiple data loads detected: test1[39m
      [90m└──[39m"
    `);
  });
});
