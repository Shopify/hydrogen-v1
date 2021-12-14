import {Logger, logServerResponse} from '../log';
// import {kleur} from 'kleur';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';

// jest.mock('kleur');

let mockLogger: Logger;

describe('log', () => {
  beforeEach(() => {
    mockLogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    global.Date.now = () => 2100;
    global.performance.now = () => 2100;
  });

  it('should log 500 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', mockLogger, request, 500);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect((mockLogger.debug as any).mock.calls[0][0]).toMatchInlineSnapshot(
      `"GET [3mstr[23m [31m500[39m 1100.00 ms http://localhost:3000/"`
    );
  });

  it('should log 200 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', mockLogger, request, 200);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect((mockLogger.debug as any).mock.calls[0][0]).toMatchInlineSnapshot(
      `"GET [3mstr[23m [32m200[39m 1100.00 ms http://localhost:3000/"`
    );
  });

  it('should log 300 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as ServerComponentRequest;
    logServerResponse('str', mockLogger, request, 301);
    expect(mockLogger.debug).toHaveBeenCalled();
    expect((mockLogger.debug as any).mock.calls[0][0]).toMatchInlineSnapshot(
      `"GET [3mstr[23m [33m301[39m 1100.00 ms http://localhost:3000/"`
    );
  });
});
