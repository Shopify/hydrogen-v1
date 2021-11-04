// eslint-disable-next-line node/no-extraneous-import
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/playground/**/*.(spec|test).[jt]s?(x)'],
  testTimeout: process.env.CI ? 30000 : 10000,
  watchPathIgnorePatterns: ['<rootDir>/temp'],
  globalSetup: './scripts/jest-e2e-setup.js',
  globalTeardown: './scripts/jest-e2e-teardown.js',
  testEnvironment: './scripts/jest-e2e-env.js',
  setupFilesAfterEnv: ['./scripts/jest-e2e-setup-test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './packages/playground/tsconfig.json',
    },
  },
};

export default config;
