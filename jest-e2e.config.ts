// eslint-disable-next-line node/no-extraneous-import
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/playground/**/*.(spec|test).[jt]s?(x)'],
  testTimeout: process.env.CI ? 45000 : 10000,
  watchPathIgnorePatterns: ['<rootDir>/temp'],
  globalSetup: './scripts/jest-e2e-global-setup.ts',
  globalTeardown: './scripts/jest-e2e-global-teardown.ts',
  testEnvironment: './scripts/jest-e2e-env.js',
  setupFilesAfterEnv: ['./scripts/jest-e2e-suite-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './packages/playground/tsconfig.json',
    },
  },
  moduleNameMapper: {
    // captures the module name with '.js', and removes the '.js' part so that the module resolver can find the '.ts' file
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
