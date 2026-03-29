/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  setupFiles: ['<rootDir>/jest.setup-env.mjs'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          types: ['node', 'jest'],
        },
      },
    ],
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
