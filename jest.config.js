/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  maxWorkers: 1,
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
      },
    ],
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
