module.exports = {
  presets: [
    [
      '@babel/env'
    ],
    '@babel/react',
    '@babel/typescript'
  ],
  plugins: [
    [
      '@babel/proposal-decorators',
      {
        'legacy': true
      }
    ],
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/transform-object-assign',
    '@babel/transform-runtime'
  ],
  ignore: [/@babel[\\|/]runtime/]
}
