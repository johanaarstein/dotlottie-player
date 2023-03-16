import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import summary from 'rollup-plugin-summary'
import { swc, minify } from 'rollup-plugin-swc3'
import template from 'rollup-plugin-html-literals'

import pkg from './package.json' assert { type: 'json' }

const input = './src/index.ts',
  extensions = ['.js', '.ts'],
  external = [
    'lit',
    'lit/decorators.js',
    'lottie-web',
    'fflate'
  ],
  plugins = () => {
    return [
      template(),
      nodeResolve({
        extensions,
        jsnext: true,
        module: true,
      }),
      commonjs(),
      swc(),
      minify(),
      summary(),
    ]
  }

export default [
  {
    input: './types/index.d.ts',
    output: {
      file: pkg.types,
      format: 'es'
    },
    plugins: [
      dts(),
    ]
  },
  {
    input,
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'dotlottiePlayer',
    },
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return
      warn(warning)
    },
    plugins: plugins(),
  },
  {
    input,
    external,
    output: [
      {
        file: pkg.module,
        format: 'es',
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs'
      }
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return
      warn(warning)
    },
    plugins: plugins(),
  }
]