import testCases from './e2e-test-cases';

describe('Node.js development', () => {
  testCases({
    // @ts-expect-error
    getServerUrl: () => globalThis.viteTestUrl,
    isWorker: false,
    isBuild: false,
  });
});
