import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import copy from 'rollup-plugin-copy'
import filesize from 'rollup-plugin-filesize'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import { swc, minify } from 'rollup-plugin-swc3'

import pkg from './package.json' assert { type: 'json' }

//Node hack
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
global['__filename'] = __filename

const production = !process.env.ROLLUP_WATCH,
  extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
  outputDir = './dist/'

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: pkg.name
    },
    {
      file: pkg.module,
      format: 'es'
    },
    // {
    //   file: './dist/ssr.js',
    //   format: 'cjs'
    // }
  ],
  plugins: [
    nodePolyfills(),
    nodeResolve({
      extensions,
      jsnext: true,
      module: true,
    }),
    commonjs(),
    !production &&
      copy({
        targets: [
          {
            src: './node_modules/@webcomponents/webcomponentsjs/bundles/',
            dest: outputDir,
          },
          {
            src: './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
            dest: outputDir,
          },
        ],
      }),
    swc(),
    production && minify(),
    filesize(),
    !production &&
      serve({
        contentBase: [outputDir],
        open: true,
        host: 'localhost',
        port: 10000,
      }),
  ],
}
