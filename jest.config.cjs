/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/apps/trade-ui/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'apps/trade-ui/src/**/*.{ts,tsx}',
    '!apps/trade-ui/src/main.tsx'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^msw/lib/node/index\\.js$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^@mswjs/interceptors/(.*)$': '<rootDir>/node_modules/@mswjs/interceptors/$1',
    '^@mswjs/interceptors$': '<rootDir>/node_modules/@mswjs/interceptors'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs)/)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  }
};
