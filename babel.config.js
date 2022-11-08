const plugins = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', /*{ loose: true }*/],
]

module.exports = api => {
  api.cache(true)

  return {
    //new
    targets: ">0.5%",
    
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        // {
        //   targets: {
        //     edge: '17',
        //     firefox: '60',
        //     chrome: '67',
        //     safari: '11.1',
        //     esmodules: true,
        //   },
        //   loose: true
        // },
      ],
    ],
    plugins,
    //new
    assumptions: {
      setPublicClassFields: true
    }
  }
}
