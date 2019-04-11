module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: 'commonjs',
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/transform-object-assign',
    '@babel/transform-runtime',
  ],
  ignore: [/@babel[\\|/]runtime/],
  env: {
    production: {
      plugins: [
        ['transform-react-remove-prop-types', { mode: 'unsafe-wrap' }],
        '@babel/transform-react-constant-elements',
      ],
    },
  },
};
