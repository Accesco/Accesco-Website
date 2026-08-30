const nextJest = require('next/jest');

// Reuses the same SWC-based transform Next.js already uses for the app
// itself, so route/lib files with plain ESM import/export syntax work in
// Jest without adding a separate Babel setup.
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
