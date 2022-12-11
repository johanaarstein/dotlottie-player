import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import copy from 'rollup-plugin-copy'
import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

import pkg from './package.json' assert { type: 'json' }

const production = !process.env.ROLLUP_WATCH,
  extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
  outputDir = './dist/'

export default {
  input: './src/index.ts',
  treeshake: false,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
      name: pkg.name
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    nodePolyfills(),
    resolve({
      extensions,
      jsnext: true,
      module: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    babel({
      extensions,
      exclude: ['./node_modules/**'],
      babelHelpers: 'bundled'
    }),
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
    filesize(),
    !production &&
      serve({
        contentBase: [outputDir],
        open: true,
        host: 'localhost',
        port: 10000,
      }),

    production && terser(),
  ],
}
