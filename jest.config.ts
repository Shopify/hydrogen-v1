// eslint-disable-next-line node/no-extraneous-import
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: [
    '**/*.(spec|test).[jt]s?(x)',
    '!**/*/dist/**/*',
    '!**/*/fixtures/**/*',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/packages/playground/*',
    '<rootDir>/examples/*',
    '<rootDir>/templates/*',
  ],
  testTimeout: process.env.CI ? 45000 : 10000,
  watchPathIgnorePatterns: ['<rootDir>/temp', 'fixtures'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  globals: {
    __HYDROGEN_DEV__: true,
    __HYDROGEN_TEST__: true,
    __HYDROGEN_CACHE_ID__: '"__QUERY_CACHE_ID__"',
    'ts-jest': {
      tsconfig: './packages/hydrogen/tsconfig.json',
    },
  },
  collectCoverageFrom: [
    'packages/hydrogen/**/*.{ts,tsx}',
    '!packages/hydrogen/**/*.d.{ts,tsx}',
    '!packages/hydrogen/src/graphql/**/*',
    '!packages/hydrogen/node_modules/**/*',
    '!packages/hydrogen/dist/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html-spa', 'text-summary'],
  moduleNameMapper: {
    // captures the module name with '.js', and removes the '.js' part so that the module resolver can find the '.ts' file
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
