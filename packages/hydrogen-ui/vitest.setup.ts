// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// https://github.com/testing-library/jest-dom/issues/439#issuecomment-1050963245
import {expect} from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
