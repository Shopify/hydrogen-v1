import {beforeAll} from 'vitest';
import {describe, MINIMAL_TEMPLATE} from '../test-framework';

describe(
  'basic-route',
  ({fs}) => {
    beforeAll(async () => {
      await fs.write(MINIMAL_TEMPLATE);
    });
  },
  {
    routes: import.meta.glob('./routes/*.server.*'),
  }
);
