// https://github.com/testing-library/jest-dom/issues/439#issuecomment-1050963245
import {expect} from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
