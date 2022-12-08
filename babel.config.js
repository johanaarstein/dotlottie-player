const plugins = [
  ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
  '@babel/plugin-proposal-class-properties',
]

module.exports = api => {
  api.cache(true)

  return {    
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-env',
    ],
    plugins,
    assumptions: {
      setPublicClassFields: true
    }
  }
}