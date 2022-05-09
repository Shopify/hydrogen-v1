import {port} from '../../test-utils/worker-e2e.serve';
import testCases from './e2e-test-cases';

describe('Worker', () => {
  // @ts-ignore
  testCases({
    getServerUrl: () => `http://localhost:${port}`,
    isWorker: true,
    isBuild: true,
  });
});
