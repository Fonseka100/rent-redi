// Setup file for API tests
// This file runs before each test file

// Set test environment variables
process.env.NODE_ENV = 'test';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Increase timeout for API tests
jest.setTimeout(10000); 