import testCases from './e2e-test-cases';

describe('Node.js development', () => {
  // @ts-ignore
  testCases({getServerUrl: () => globalThis.viteTestUrl});
});
