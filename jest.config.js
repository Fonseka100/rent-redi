module.exports = {
  projects: [
    {
      displayName: 'API Tests',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/api/**/*.test.js'],
      collectCoverageFrom: [
        'api/src/**/*.js',
        '!api/src/index.js',
        '!api/src/config.js'
      ],
      coverageDirectory: 'coverage/api',
      setupFilesAfterEnv: ['<rootDir>/test/api/setup.js']
    },
    {
      displayName: 'Client Tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/test/client/**/*.test.js'],
      collectCoverageFrom: [
        'client/src/**/*.js',
        '!client/src/index.js',
        '!client/src/config.js'
      ],
      coverageDirectory: 'coverage/client',
      setupFilesAfterEnv: ['<rootDir>/test/client/setup.js'],
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      }
    }
  ],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testTimeout: 10000
}; 