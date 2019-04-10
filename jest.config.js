module.exports = {
  verbose: true,
  timers: 'fake',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/build/', '/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTest.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
};
