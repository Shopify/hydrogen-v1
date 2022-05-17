import {port} from '../../test-utils/node-prod-e2e.serve';
import testCases from './e2e-test-cases';

describe('Node.js production', () => {
  // @ts-ignore
  testCases({
    getServerUrl: () => `http://localhost:${port}`,
    isWorker: false,
    isBuild: true,
  });
});
