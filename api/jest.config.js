module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js', '**/__tests__/**/*.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js']
}; 