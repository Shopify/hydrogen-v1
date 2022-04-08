import {ServerAnalyticsRoute} from '../ServerAnalyticsRoute.server';

const createRequest = () => {
  return new Request('__event', {
    headers: {
      'Content-Length': '0',
    },
  });
};

describe('Analytics - ServerAnalyticsRoute', () => {
  it('should return a 200 response', () => {
    const response = ServerAnalyticsRoute(createRequest());
    expect(response.status).toEqual(200);
  });

  it('should delegate request to a server analytics connector', () => {
    const mockServerAnalyticsConnector = jest.fn();
    const request = createRequest();
    const response = ServerAnalyticsRoute(request, [
      {
        request: mockServerAnalyticsConnector,
      },
    ]);

    expect(response.status).toEqual(200);
    expect(mockServerAnalyticsConnector).toHaveBeenCalled();
    expect(mockServerAnalyticsConnector.mock.calls[0][0]).toEqual(request);
  });

  it('should delegate request to multiple server analytics connectors', () => {
    const mockServerAnalyticsConnector1 = jest.fn();
    const mockServerAnalyticsConnector2 = jest.fn();
    const request = createRequest();
    const response = ServerAnalyticsRoute(request, [
      {
        request: mockServerAnalyticsConnector1,
      },
      {
        request: mockServerAnalyticsConnector2,
      },
    ]);

    expect(response.status).toEqual(200);
    expect(mockServerAnalyticsConnector1).toHaveBeenCalled();
    expect(mockServerAnalyticsConnector1.mock.calls[0][0]).toEqual(request);
    expect(mockServerAnalyticsConnector2).toHaveBeenCalled();
    expect(mockServerAnalyticsConnector2.mock.calls[0][0]).toEqual(request);
  });

  it('should delegate json request', () => {
    const testRequest = new Request('__event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: '123',
      }),
    });
    const mockServerAnalyticsConnector = (
      request: Request,
      data?: any,
      type?: string
    ): void => {
      expect(request).toEqual(testRequest);
      expect(data).toEqual({
        test: '123',
      });
      expect(type).toEqual('json');
    };
    const response = ServerAnalyticsRoute(testRequest, [
      {
        request: mockServerAnalyticsConnector,
      },
    ]);

    expect(response.status).toEqual(200);
  });

  it('should delegate text request', () => {
    const testRequest = new Request('__event', {
      method: 'POST',
      body: 'test123',
    });
    const mockServerAnalyticsConnector = (
      request: Request,
      data?: any,
      type?: string
    ): void => {
      expect(request).toEqual(testRequest);
      expect(data).toEqual('test123');
      expect(type).toEqual('text');
    };
    const response = ServerAnalyticsRoute(testRequest, [
      {
        request: mockServerAnalyticsConnector,
      },
    ]);

    expect(response.status).toEqual(200);
  });
});
