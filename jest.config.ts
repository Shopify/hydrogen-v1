import type {InitialOptionsTsJest} from 'ts-jest';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  testMatch: [
    '**/*.(spec|test).[jt]s?(x)',
    '!**/*/dist/**/*',
    '!**/*/fixtures/**/*',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/packages/playground/*',
    '<rootDir>/examples/*',
    '<rootDir>/templates/*',
    '<rootDir>/packages/hydrogen-ui/*',
  ],
  testTimeout: process.env.CI ? 30000 : 10000,
  watchPathIgnorePatterns: ['<rootDir>/temp', 'fixtures'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  globals: {
    __HYDROGEN_DEV__: true,
    __HYDROGEN_TEST__: true,
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
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(kolorist|uuid))'],
};

export default config;
