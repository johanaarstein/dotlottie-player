import { esbuildPlugin } from '@web/dev-server-esbuild'
import { legacyPlugin } from '@web/dev-server-legacy'
// import { fromRollup } from '@web/dev-server-rollup'

// import commonjs from '@rollup/plugin-commonjs'
// import { nodeResolve } from '@rollup/plugin-node-resolve'

import { fileURLToPath } from 'url'

const mode = process.env.MODE || 'dev'
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`)
}

export default {
  rootDir: './dev',
  nodeResolve: {
    exportConditions: mode === 'dev' ? ['development'] : [],
  },
  preserveSymlinks: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      // module: 'ESNext',
      // target: 'ES2020',
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype)",
            module: false,
          },
        ],
      },
    }),
    // fromRollup(commonjs),
  ],
}