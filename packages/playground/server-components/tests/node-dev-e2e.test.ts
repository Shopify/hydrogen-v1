import testCases from './e2e-test-cases';

describe('Node.js development', () => {
  testCases({
    // @ts-ignore
    getServerUrl: () => globalThis.viteTestUrl,
    getDevServer: () => globalThis.viteDevServer,
    isWorker: false,
    isBuild: false,
  });
});
