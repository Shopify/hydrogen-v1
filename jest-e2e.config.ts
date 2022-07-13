import type {InitialOptionsTsJest} from 'ts-jest';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  testMatch: ['**/playground/**/*.(spec|test).[jt]s?(x)'],
  testTimeout: process.env.CI ? 30000 : 10000,
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
  transformIgnorePatterns: ['node_modules/(?!(kolorist|uuid))'],
};

export default config;
