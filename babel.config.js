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


// {
//   targets: {
//     edge: '17',
//     firefox: '60',
//     chrome: '67',
//     safari: '11.1',
//     esmodules: true,
//   },
//   loose: true
// }