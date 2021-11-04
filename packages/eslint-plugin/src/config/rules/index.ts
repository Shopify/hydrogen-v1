import {deepMerge} from '@typescript-eslint/experimental-utils/dist/eslint-utils';
import overrides from './overrides';
import hydrogen from './hydrogen';

export default deepMerge(hydrogen, overrides);
