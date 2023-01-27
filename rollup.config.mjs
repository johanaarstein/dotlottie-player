import commonjs from '@rollup/plugin-commonjs'
import { externals } from 'rollup-plugin-node-externals'
import filesize from 'rollup-plugin-filesize'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { swc, minify } from 'rollup-plugin-swc3'
import template from 'rollup-plugin-html-literals'

import pkg from './package.json' assert { type: 'json' }

//Node hack
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
global['__filename'] = __filename

const input = './src/index.ts',
  extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
  globals = {
    lit: 'lit',
    'lit/decorators.js': 'decorators_js',
    'lottie-web': 'Lottie',
    fflate: 'fflate'
  },

  rollupPlugins = (ext = false) => {
    return [
      template(),
      ext && externals({
        // deps: false,
        // include: 'lit'
        exclude: 'lottie-web'
      }),
      nodeResolve({
        extensions,
        jsnext: true,
        module: true,
      }),
      commonjs(),
      swc(),
      minify(),
      filesize(),
    ]
  }

export default [
  {
    input,
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: pkg.name,
        globals
      }
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return
      warn(warning)
    },
    plugins: rollupPlugins(),
  },
  {
    input,
    output: [
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return
      warn(warning)
    },
    plugins: rollupPlugins(true),
  }
]
