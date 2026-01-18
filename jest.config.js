/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/index.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/']
};
