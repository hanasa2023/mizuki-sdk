import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import replace from '@rollup/plugin-replace'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

const ENV = process.env.NODE_ENV
const extensions = ['.ts', '.js']
const external = []

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.esm.js',
      format: 'esm',
      sourcemap: ENV === 'dev',
    },
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescript(),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'es/index.js',
      format: 'es',
      sourcemap: ENV === 'dev',
    },
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescript(),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'typings/index.d.ts', format: 'es' }],
    plugins: [
      json(),
      typescript(),
      typescriptPaths({
        preserveExtensions: true,
      }),
      dts(),
    ],
  },
]
