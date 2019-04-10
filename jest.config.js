module.exports = {
  verbose: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    'build',
    'node_modules'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/scripts/setupTest.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js|ts}',
  ]
}
